import type { MediaVideoDTO } from '@itqa/core';

const CHANNEL_ID = 'UCFfBE6Jh86oromF4MDWG8xg';
const CHANNEL_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 5000;
const DEFAULT_LIMIT = 8;
const PLAYLIST_LIMIT = 12;

/** ITQA event playlists: Jalsa talks and the annual award ceremony, merged newest first. */
export const EVENT_PLAYLIST_IDS = [
  'PL4HCURUMuDVIcXuuocgrMJyfe3zrwCROO',
  'PL4HCURUMuDVKncjj27YqeY0ntSiMB9YGR',
  'PL4HCURUMuDVJYbhg772397DihbrZEg3rG',
  'PL4HCURUMuDVKKoWTuVxj0HvjX7AQRsgNm',
  'PL4HCURUMuDVKoGf62q-1sN9GjcRTa9lGs',
];

function playlistFeedUrl(playlistId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
}

const ENTRY_PATTERN = /<entry>([\s\S]*?)<\/entry>/g;
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }
    return NAMED_ENTITIES[entity] ?? match;
  });
}

function readTag(entry: string, pattern: RegExp): string | null {
  const match = entry.match(pattern);
  return match ? decodeEntities(match[1].trim()) : null;
}

/** Parse a YouTube channel Atom feed into video cards. Pure, so it is unit-testable. */
export function parseChannelFeed(xml: string): MediaVideoDTO[] {
  const videos: MediaVideoDTO[] = [];
  for (const match of xml.matchAll(ENTRY_PATTERN)) {
    const entry = match[1];
    const id = readTag(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = readTag(entry, /<title>([^<]*)<\/title>/);
    const url = readTag(entry, /<link\s+rel="alternate"\s+href="([^"]+)"/);
    const imageUrl = readTag(entry, /<media:thumbnail\s+url="([^"]+)"/);
    const publishedAt = readTag(entry, /<published>([^<]+)<\/published>/);
    if (!id || !title || !url || !imageUrl) continue;
    videos.push({ id, title, url, imageUrl, publishedAt });
  }
  return videos;
}

async function fetchFeed(url: string): Promise<MediaVideoDTO[]> {
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return [];
    return parseChannelFeed(await response.text());
  } catch {
    return [];
  }
}

/**
 * Latest uploads from the ITQA YouTube channel. Returns an empty array when the
 * feed is unavailable (offline builds, network errors) so the page can fall back
 * to static content.
 */
export async function getChannelVideos(limit = DEFAULT_LIMIT): Promise<MediaVideoDTO[]> {
  return (await fetchFeed(CHANNEL_FEED_URL)).slice(0, limit);
}

/**
 * Merge playlist feeds into one newest-first list, dropping duplicate videos and
 * entries without a publish date. Pure, so it is unit-testable.
 */
export function mergeVideosNewestFirst(feeds: MediaVideoDTO[][], limit: number): MediaVideoDTO[] {
  const seen = new Set<string>();
  return feeds
    .flat()
    .filter((video) => {
      if (!video.publishedAt || seen.has(video.id)) return false;
      seen.add(video.id);
      return true;
    })
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, limit);
}

/**
 * Merged uploads from the ITQA event playlists (Jalsa talks and the annual award
 * ceremony), newest first. Returns an empty array when no feed is reachable so
 * the page can fall back to static content.
 */
export async function getPlaylistVideos(
  playlistIds = EVENT_PLAYLIST_IDS,
  limit = PLAYLIST_LIMIT,
): Promise<MediaVideoDTO[]> {
  const feeds = await Promise.all(playlistIds.map((id) => fetchFeed(playlistFeedUrl(id))));
  return mergeVideosNewestFirst(feeds, limit);
}
