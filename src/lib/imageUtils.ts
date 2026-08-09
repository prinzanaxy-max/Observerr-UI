const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
const MAX_INPUT_BYTES = 5 * 1024 * 1024;
const OUTPUT_SIZE = 256;
const JPEG_QUALITY = 0.85;

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export const validateProfileImage = (file: File): ImageValidationResult => {
  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return { ok: false, message: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }
  if (file.size > MAX_INPUT_BYTES) {
    return { ok: false, message: 'Profile picture must be 5 MB or smaller' };
  }
  return { ok: true };
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image file.'));
    };
    img.src = url;
  });

/** Resize and compress an image for local profile storage. */
export const compressProfileImage = async (file: File): Promise<string> => {
  const validation = validateProfileImage(file);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const side = OUTPUT_SIZE;
  canvas.width = side;
  canvas.height = side;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not process image.');
  }

  const scale = Math.max(side / img.width, side / img.height);
  const width = img.width * scale;
  const height = img.height * scale;
  const x = (side - width) / 2;
  const y = (side - height) / 2;

  ctx.drawImage(img, x, y, width, height);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
};

export const PROFILE_IMAGE_ACCEPT = ACCEPTED_TYPES.join(',');
