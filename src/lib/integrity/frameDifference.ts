export type LumaFrame = {
  pixels: Uint8Array;
  width: number;
  height: number;
};

export function frameDifferenceRatio(previous: LumaFrame, current: LumaFrame): number {
  if (
    previous.width !== current.width ||
    previous.height !== current.height ||
    previous.pixels.length !== current.pixels.length ||
    current.pixels.length === 0
  ) {
    return 1;
  }

  let changed = 0;
  for (let index = 0; index < current.pixels.length; index += 1) {
    if (Math.abs(current.pixels[index] - previous.pixels[index]) >= 6) {
      changed += 1;
    }
  }
  return changed / current.pixels.length;
}

export function sampleVideoLuma(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): LumaFrame | null {
  const width = 32;
  const height = 24;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;

  try {
    context.drawImage(video, 0, 0, width, height);
    const rgba = context.getImageData(0, 0, width, height).data;
    const pixels = new Uint8Array(width * height);
    for (let source = 0, target = 0; source < rgba.length; source += 4, target += 1) {
      pixels[target] = Math.round(
        rgba[source] * 0.299 + rgba[source + 1] * 0.587 + rgba[source + 2] * 0.114,
      );
    }
    return { pixels, width, height };
  } catch {
    return null;
  }
}
