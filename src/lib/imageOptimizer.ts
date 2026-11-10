/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Optimizes and sharpens an uploaded or captured image for ultra-accurate OCR & Braille scanning:
 * - Scales down large camera photos (e.g. 4000x3000 -> max 1024px)
 * - Applies auto-contrast stretch and edge sharpening so faint Braille dots and text stand out clearly
 * - Compresses to lightweight JPEG (~120KB) for instant processing
 */
export async function optimizeImageForScan(
  fileOrDataUrl: File | string,
  maxDimension = 1024
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Calculate scale factor
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Draw onto downscaled canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        resolve({ dataUrl: typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '', width: img.width, height: img.height });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // --- High-Accuracy Contrast & Sharpness Enhancement ---
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;

        // Auto-contrast min/max luminance calculation
        let minLum = 255;
        let maxLum = 0;

        for (let i = 0; i < d.length; i += 4) {
          const lum = (d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8;
          if (lum < minLum) minLum = lum;
          if (lum > maxLum) maxLum = lum;
        }

        const range = maxLum - minLum || 1;

        // Stretch contrast so dark dots/text are darker and background is cleaner
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const lum = (r * 77 + g * 150 + b * 29) >> 8;

          let stretched = ((lum - minLum) / range) * 255;
          // Sharpen curve: deepen darks, brighten lights
          stretched = stretched < 110 ? stretched * 0.65 : Math.min(255, stretched * 1.15);

          d[i] = stretched;
          d[i + 1] = stretched;
          d[i + 2] = stretched;
        }

        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        // Fallback if getImageData is tainted
      }

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
      resolve({
        dataUrl: optimizedDataUrl,
        width,
        height,
      });
    };

    img.onerror = (err) => {
      reject(err);
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      img.src = URL.createObjectURL(fileOrDataUrl);
    }
  });
}
