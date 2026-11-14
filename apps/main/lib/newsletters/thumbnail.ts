import { createCanvas } from '@napi-rs/canvas';
import { readFile, mkdir, rm, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export interface ThumbnailOptions {
  width?: number;
  quality?: number;
}

function thumbnailWidth(): number {
  const raw = process.env.NEWSLETTER_THUMBNAIL_WIDTH;
  const parsed = raw ? Number.parseInt(raw, 10) : 320;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 320;
}

function thumbnailQuality(): number {
  const raw = process.env.NEWSLETTER_THUMBNAIL_QUALITY;
  const parsed = raw ? Number.parseInt(raw, 10) : 75;
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 100 ? parsed : 75;
}

export function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).equals(Buffer.from('%PDF-'));
}

export function safeBaseName(name: string): string {
  const withoutExt = name.replace(/\.pdf$/i, '');
  const cleaned = withoutExt.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
  return cleaned.slice(0, 80) || 'newsletter';
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function generateThumbnail(
  pdfPath: string,
  thumbnailPath: string,
  options: ThumbnailOptions = {},
): Promise<void> {
  const width = options.width ?? thumbnailWidth();
  const quality = options.quality ?? thumbnailQuality();

  const pdfBuffer = await readFile(pdfPath);
  if (!isPdfBuffer(pdfBuffer)) {
    throw new Error('Invalid PDF file: missing PDF header.');
  }

  let document: { numPages: number; getPage: (n: number) => Promise<any> } | null = null;
  try {
    document = await getDocument({ data: new Uint8Array(pdfBuffer), verbosity: 0 }).promise;
    if (!document || document.numPages < 1) {
      throw new Error('PDF has no pages.');
    }

    const page = await document.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = width / baseViewport.width;
    const viewport = page.getViewport({ scale: Math.max(scale, 0.1) });

    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;

    const pngBuffer = canvas.toBuffer('image/png');

    await mkdir(path.dirname(thumbnailPath), { recursive: true });
    await sharp(pngBuffer)
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(thumbnailPath);
  } catch (error) {
    await rm(thumbnailPath, { force: true }).catch(() => undefined);
    throw error;
  } finally {
    // pdfjs document cleanup is handled by garbage collection in this setup.
  }
}
