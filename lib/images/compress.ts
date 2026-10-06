/*
 * Shrink a photo in the browser before upload: longest side ≤ 2400px, re-encoded as WebP
 * (JPEG if the browser can't make WebP). Phone photos of 5–12 MB typically become 300–800 KB,
 * which fits the bucket's 5 MB limit and keeps the website fast. Runs only in the browser.
 */

export const MAX_EDGE = 2400;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_INPUT_BYTES = 40 * 1024 * 1024; // refuse absurd files before decoding them

export type CompressedImage = { blob: Blob; type: "image/webp" | "image/jpeg"; extension: "webp" | "jpg"; width: number; height: number };

/** Target size keeping the aspect ratio, never upscaling. */
export function fitWithin(width: number, height: number, maxEdge = MAX_EDGE) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function toBlob(canvas: HTMLCanvasElement | OffscreenCanvas, type: string, quality: number): Promise<Blob | null> {
  if ("convertToBlob" in canvas) return canvas.convertToBlob({ type, quality }).catch(() => null);
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressImage(file: File): Promise<CompressedImage> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Unsupported format — please use a JPG, PNG or WebP photo.");
  }
  if (file.size > MAX_INPUT_BYTES) throw new Error("This file is too large (over 40 MB).");

  let bitmap: ImageBitmap;
  try {
    // imageOrientation: rotate phone photos the right way up (EXIF)
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Couldn't read this photo. Try saving it as JPG first.");
  }

  const { width, height } = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process this photo.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Older browsers silently return PNG when asked for WebP — check and fall back to JPEG
  const webp = await toBlob(canvas, "image/webp", 0.82);
  if (webp && webp.type === "image/webp") return { blob: webp, type: "image/webp", extension: "webp", width, height };

  const jpeg = await toBlob(canvas, "image/jpeg", 0.85);
  if (!jpeg) throw new Error("Your browser couldn't process this photo.");
  return { blob: jpeg, type: "image/jpeg", extension: "jpg", width, height };
}
