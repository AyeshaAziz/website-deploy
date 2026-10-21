import { describe, expect, it } from 'vitest';
import type { MediaVideoDTO } from '@itqa/core';
import { mergeVideosNewestFirst, parseChannelFeed } from './youtube';

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
  <entry>
    <yt:videoId>eoPiHV5fI2k</yt:videoId>
    <title>Tarjamatul-Qur'an &amp; Tajweed | Lesson #25</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=eoPiHV5fI2k"/>
    <published>2026-07-06T05:00:05+00:00</published>
    <media:group>
      <media:thumbnail url="https://i2.ytimg.com/vi/eoPiHV5fI2k/hqdefault.jpg" width="480" height="360"/>
    </media:group>
  </entry>
  <entry>
    <yt:videoId>ZFNvmSnnB1E</yt:videoId>
    <title>He brings forth the Living from the Dead</title>
    <link rel="alternate" href="https://www.youtube.com/shorts/ZFNvmSnnB1E"/>
    <published>2026-06-10T08:34:29+00:00</published>
    <media:group>
      <media:thumbnail url="https://i3.ytimg.com/vi/ZFNvmSnnB1E/hqdefault.jpg" width="480" height="360"/>
    </media:group>
  </entry>
  <entry>
    <title>Missing video id is skipped</title>
  </entry>
</feed>`;

describe('parseChannelFeed', () => {
  it('maps valid entries and decodes entities', () => {
    const videos = parseChannelFeed(FEED);
    expect(videos).toHaveLength(2);
    expect(videos[0]).toEqual({
      id: 'eoPiHV5fI2k',
      title: "Tarjamatul-Qur'an & Tajweed | Lesson #25",
      url: 'https://www.youtube.com/watch?v=eoPiHV5fI2k',
      imageUrl: 'https://i2.ytimg.com/vi/eoPiHV5fI2k/hqdefault.jpg',
      publishedAt: '2026-07-06T05:00:05+00:00',
    });
  });

  it('returns an empty array when there are no entries', () => {
    expect(parseChannelFeed('<feed></feed>')).toEqual([]);
  });
});

function video(id: string, publishedAt: string): MediaVideoDTO {
  return {
    id,
    title: id,
    url: `https://www.youtube.com/watch?v=${id}`,
    imageUrl: `https://i2.ytimg.com/vi/${id}/hqdefault.jpg`,
    publishedAt,
  };
}

describe('mergeVideosNewestFirst', () => {
  it('merges feeds newest first and trims to the limit', () => {
    const merged = mergeVideosNewestFirst(
      [
        [video('a', '2022-01-01T00:00:00+00:00'), video('b', '2024-06-01T00:00:00+00:00')],
        [video('c', '2025-03-01T00:00:00+00:00')],
      ],
      2,
    );
    expect(merged.map((item) => item.id)).toEqual(['c', 'b']);
  });

  it('drops duplicates and entries without a publish date', () => {
    const noDate = { ...video('d', '2023-01-01T00:00:00+00:00'), publishedAt: undefined };
    const merged = mergeVideosNewestFirst(
      [[video('a', '2022-01-01T00:00:00+00:00')], [video('a', '2023-01-01T00:00:00+00:00'), noDate]],
      10,
    );
    expect(merged.map((item) => item.id)).toEqual(['a']);
  });
});
