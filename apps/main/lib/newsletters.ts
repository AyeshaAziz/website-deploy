import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { safeBaseName } from '@/lib/newsletters/thumbnail';

export interface Newsletter {
  name: string;
  href: string;
  thumbnail: string;
}

const NEWSLETTER_DIR = path.join(process.cwd(), 'public', 'newsletters');
const THUMBNAIL_DIR = path.join(NEWSLETTER_DIR, 'thumbnails');
const FALLBACK_THUMBNAIL = '/newsletter-fallback.svg';

function issueNumber(name: string): number {
  const match = name.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function thumbnailFor(pdfName: string): string {
  const base = safeBaseName(pdfName);
  const thumbnailName = `${base}.webp`;
  const thumbnailPath = path.join(THUMBNAIL_DIR, thumbnailName);
  if (existsSync(thumbnailPath)) {
    return `/newsletters/thumbnails/${encodeURIComponent(thumbnailName)}`;
  }
  return FALLBACK_THUMBNAIL;
}

export function getNewsletters(): Newsletter[] {
  try {
    const entries = readdirSync(NEWSLETTER_DIR, { withFileTypes: true });
    const pdfs = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'))
      .map((entry) => entry.name);

    const newsletters = pdfs.map((name) => ({
      name: name.replace(/\.pdf$/i, ''),
      href: `/newsletters/${encodeURIComponent(name)}`,
      thumbnail: thumbnailFor(name),
    }));

    return newsletters.sort((a, b) => {
      const diff = issueNumber(b.name) - issueNumber(a.name);
      if (diff !== 0) return diff;
      return b.name.localeCompare(a.name);
    });
  } catch (error) {
    console.error('Failed to load newsletters:', error);
    return [];
  }
}

export { safeBaseName, THUMBNAIL_DIR, NEWSLETTER_DIR };
