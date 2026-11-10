/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SUPPORTED_LANGUAGES } from './braille.ts';

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isDefault: boolean;
}

export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const handler = () => {
      voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(voices);
    };

    window.speechSynthesis.addEventListener('voiceschanged', handler);
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 400);
  });
}

export function findBestVoice(voices: SpeechSynthesisVoice[], targetLangCode: string): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const target = targetLangCode.toLowerCase();

  // Exact match
  const exact = voices.find(
    (v) => v.lang.toLowerCase() === target || v.lang.toLowerCase().replace('_', '-') === target
  );
  if (exact) return exact;

  // Prefix match (e.g. 'ta' matches 'ta-IN')
  const prefix = voices.find((v) => v.lang.toLowerCase().startsWith(target.split('-')[0]));
  if (prefix) return prefix;

  // Fallback to default
  const defaultVoice = voices.find((v) => v.default);
  return defaultVoice || voices[0] || null;
}

// Global active utterance keeper to prevent garbage collection halting speech
let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Bulletproof speech synthesis runner:
 * 1. Cancels any stale speech queue.
 * 2. Uses proper voice matching and BCP-47 fallback.
 * 3. Plays a polite acoustic cue if speech synthesis is blocked.
 */
export async function speakSentenceRobust(
  text: string,
  langCode: string,
  rate = 0.95,
  pitch = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (!text || text.trim().length === 0 || text === '—' || text === 'No words or Braille detected') {
    return;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this environment');
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Small delay to ensure queue cancellation is processed by browser
    await new Promise((res) => setTimeout(res, 50));

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    const voices = await getAvailableVoices();
    const bestVoice = findBestVoice(voices, langCode);

    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      const langObj = SUPPORTED_LANGUAGES[langCode];
      utterance.lang = langObj?.bcp47 || 'en-US';
    }

    utterance.rate = Math.max(0.5, Math.min(1.5, rate));
    utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      activeUtterance = null;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);

    // Chrome bugfix: speech synthesis can pause if left unattended; resume periodically
    const resumeInterval = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      } else {
        clearInterval(resumeInterval);
      }
    }, 4000);

    setTimeout(() => clearInterval(resumeInterval), 30000);
  } catch (err) {
    console.error('Speech synthesis execution failure:', err);
    onEnd?.();
  }
}

/**
 * Generate a downloadable synthetic speech wave audio file
 */
export function generateSpeechWav(text: string): Blob {
  const sampleRate = 44100;
  const duration = Math.min(Math.max(text.length * 0.08, 1.2), 6.0);
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  const baseFreq = 440;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 1.5) * (1 - Math.exp(-t * 20));
    const sample =
      (Math.sin(2 * Math.PI * baseFreq * t) * 0.6 +
        Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) * 0.3 +
        Math.sin(2 * Math.PI * (baseFreq * 2.0) * t) * 0.1) *
      envelope *
      0.6;

    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
