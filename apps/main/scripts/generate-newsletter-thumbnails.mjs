import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const newsletterDir = path.join(root, 'public', 'newsletters');
const thumbnailDir = path.join(newsletterDir, 'thumbnails');

function safeName(name) {
  const withoutExt = name.replace(/\.pdf$/i, '');
  const cleaned = withoutExt.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
  return cleaned.slice(0, 80) || 'newsletter';
}

async function generate(pdfPath, thumbPath) {
  const fs = await import('node:fs/promises');
  const buffer = await fs.readFile(pdfPath);
  if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new Error('Invalid PDF header');
  }
  const doc = await getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;
  if (!doc || doc.numPages < 1) throw new Error('No pages');
  const page = await doc.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const width = 320;
  const scale = width / baseViewport.width;
  const viewport = page.getViewport({ scale: Math.max(scale, 0.1) });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  const png = canvas.toBuffer('image/png');
  mkdirSync(path.dirname(thumbPath), { recursive: true });
  await sharp(png).resize(width, null, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
}

async function main() {
  mkdirSync(thumbnailDir, { recursive: true });
  const entries = readdirSync(newsletterDir, { withFileTypes: true });
  const pdfs = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'));
  let generated = 0;
  let skipped = 0;
  for (const entry of pdfs) {
    const base = safeName(entry.name);
    const thumbPath = path.join(thumbnailDir, `${base}.webp`);
    if (existsSync(thumbPath)) {
      skipped += 1;
      console.log(`skip (exists): ${entry.name}`);
      continue;
    }
    const pdfPath = path.join(newsletterDir, entry.name);
    try {
      await generate(pdfPath, thumbPath);
      generated += 1;
      console.log(`generated: ${entry.name} -> ${path.basename(thumbPath)}`);
    } catch (error) {
      console.error(`failed: ${entry.name}: ${error instanceof Error ? error.message : error}`);
    }
  }
  console.log(`Done. Generated ${generated}, skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
