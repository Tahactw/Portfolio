/**
 * Client-side image pipeline: resize to a sane web size, encode to WebP
 * (JPEG where the browser can't encode WebP), report before/after sizes.
 *
 * EXIF orientation: decoding goes through createImageBitmap / <img>, and
 * per the HTML spec (and all evergreen browsers since ~2020) EXIF
 * orientation is applied during decode — so phone photos land upright
 * without us parsing EXIF ourselves.
 */

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  originalBytes: number;
  finalBytes: number;
  ext: 'webp' | 'jpg';
}

const MAX_EDGE = 1920;
const QUALITY = 0.82;
/** Post-compression ceiling, per the content guidelines. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> path (some formats/browsers) */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const source = await decode(file);
  const sw = 'width' in source ? source.width : 0;
  const sh = 'height' in source ? source.height : 0;
  if (!sw || !sh) throw new Error('That file could not be read as an image.');

  const scale = Math.min(1, MAX_EDGE / Math.max(sw, sh));
  const w = Math.round(sw * scale);
  const h = Math.round(sh * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not process the image (no canvas support).');
  ctx.drawImage(source, 0, 0, w, h);
  if ('close' in source) source.close();

  const tryEncode = (type: string, q: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q));

  let blob = await tryEncode('image/webp', QUALITY);
  let ext: 'webp' | 'jpg' = 'webp';
  if (!blob || blob.type !== 'image/webp') {
    blob = await tryEncode('image/jpeg', 0.85);
    ext = 'jpg';
  }
  if (!blob) throw new Error('Your browser could not encode the image.');

  return {
    blob,
    width: w,
    height: h,
    originalBytes: file.size,
    finalBytes: blob.size,
    ext,
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Collision-safe media filename from a human name. */
export function mediaFilename(baseName: string, ext: string): string {
  const slug =
    baseName
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'file';
  const stamp = Date.now().toString(36);
  return `${slug}-${stamp}.${ext}`;
}
