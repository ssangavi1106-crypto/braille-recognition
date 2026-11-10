/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    Tesseract?: any;
  }
}

// Cache workers across recognition calls to prevent slow repeated WASM re-initialization
const workerPool: Record<string, any> = {};

/**
 * Preprocesses a canvas to drastically improve OCR character recognition accuracy:
 * - Grayscale conversion
 * - High contrast stretch
 * - Thresholding for clear text separation
 */
export function enhanceCanvasForOCR(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  // Auto-contrast stretch
  let minLum = 255;
  let maxLum = 0;

  for (let i = 0; i < d.length; i += 4) {
    const lum = (d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8;
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const range = maxLum - minLum || 1;

  for (let i = 0; i < d.length; i += 4) {
    const lum = (d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8;
    let stretched = ((lum - minLum) / range) * 255;
    // Mild binarization curve
    stretched = stretched < 128 ? stretched * 0.7 : Math.min(255, stretched * 1.2);

    d[i] = stretched;
    d[i + 1] = stretched;
    d[i + 2] = stretched;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Executes high-accuracy OCR directly in the browser using Tesseract engine:
 * Extracts Latin and Tamil normal sentences from images without requiring external cloud keys.
 */
export async function runBrowserOCR(
  canvas: HTMLCanvasElement,
  langCode: string
): Promise<{ text: string; confidence: number }> {
  if (typeof window === 'undefined' || !window.Tesseract) {
    console.warn('Tesseract not yet loaded in window');
    return { text: '', confidence: 0 };
  }

  // Map language code: 'ta' -> 'tam', 'hi' -> 'hin', others -> 'eng'
  let tLang = 'eng';
  if (langCode === 'ta') {
    tLang = 'tam+eng';
  } else if (langCode === 'hi') {
    tLang = 'hin+eng';
  }

  const enhancedCanvas = enhanceCanvasForOCR(canvas);

  // Helper with 4.5s timeout guard so it never blocks the user
  const runWithWorker = async (lang: string): Promise<{ text: string; confidence: number }> => {
    try {
      if (!workerPool[lang]) {
        workerPool[lang] = await window.Tesseract.createWorker(lang);
      }
      const worker = workerPool[lang];
      const ret = await worker.recognize(enhancedCanvas);

      const rawText = ret?.data?.text || '';
      const cleanText = rawText
        .replace(/[\r\n]+/g, ' ')
        .replace(/[\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        text: cleanText,
        confidence: ret?.data?.confidence || 0,
      };
    } catch (err) {
      delete workerPool[lang];
      throw err;
    }
  };

  try {
    const result = await Promise.race([
      runWithWorker(tLang),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Tesseract OCR timeout')), 4500)
      ),
    ]);

    if (result && result.text) {
      return result;
    }
  } catch (err) {
    console.warn(`Primary OCR for ${tLang} fell back, trying standard 'eng':`, err);
  }

  // Fast fallback to 'eng' worker if multi-lingual model timed out
  try {
    const engResult = await runWithWorker('eng');
    return engResult;
  } catch (e) {
    console.error('All OCR attempts finished without match:', e);
    return { text: '', confidence: 0 };
  }
}
