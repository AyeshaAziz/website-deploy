import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export interface Newsletter {
  name: string;
  href: string;
}

export function getNewsletters(): Newsletter[] {
  const dir = join(process.cwd(), 'public', 'newsletters');
  try {
    return readdirSync(dir)
      .filter((file) => file.toLowerCase().endsWith('.pdf'))
      .sort()
      .reverse()
      .map((file) => ({
        name: file.replace(/\.pdf$/i, ''),
        href: `/newsletters/${encodeURIComponent(file)}`,
      }));
  } catch {
    return [];
  }
}
