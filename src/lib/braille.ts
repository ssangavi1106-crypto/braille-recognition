/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Standard Grade 1 Braille (English a-z)
export const BRAILLE_LETTERS: Record<string, number> = {
  a: 1,  b: 3,  c: 9,  d: 25, e: 17, f: 11, g: 27, h: 19, i: 10, j: 26,
  k: 5,  l: 7,  m: 13, n: 29, o: 21, p: 15, q: 31, r: 23, s: 14, t: 30,
  u: 37, v: 39, w: 58, x: 45, y: 61, z: 53
};

export const DIGIT_MAP: Record<string, string> = {
  a: '1', b: '2', c: '3', d: '4', e: '5',
  f: '6', g: '7', h: '8', i: '9', j: '0'
};

export const REV_DIGIT_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DIGIT_MAP).map(([k, v]) => [v, k])
);

// Punctuation characters mapped to Unicode offset from 0x2800
export const PUNCT_MAP: Record<string, string> = {
  [String.fromCharCode(0x2800 + 50)]: '.',
  [String.fromCharCode(0x2800 + 2)]: ',',
  [String.fromCharCode(0x2800 + 6)]: ';',
  [String.fromCharCode(0x2800 + 18)]: ':',
  [String.fromCharCode(0x2800 + 38)]: '?',
  [String.fromCharCode(0x2800 + 22)]: '!',
  [String.fromCharCode(0x2800 + 36)]: '-',
  [String.fromCharCode(0x2800 + 4)]: "'",
  [String.fromCharCode(0x2800 + 54)]: '"',
  [String.fromCharCode(0x2800)]: ' ',
  ' ': ' '
};

export const REV_PUNCT_MAP: Record<string, string> = {
  '.': String.fromCharCode(0x2800 + 50),
  ',': String.fromCharCode(0x2800 + 2),
  ';': String.fromCharCode(0x2800 + 6),
  ':': String.fromCharCode(0x2800 + 18),
  '?': String.fromCharCode(0x2800 + 38),
  '!': String.fromCharCode(0x2800 + 22),
  '-': String.fromCharCode(0x2800 + 36),
  "'": String.fromCharCode(0x2800 + 4),
  '"': String.fromCharCode(0x2800 + 54),
  ' ': '⠀'
};

// Common Grade 2 Braille Contractions
export const CONTRACTIONS: Record<string, string> = {
  [String.fromCharCode(0x2800 + 46)]: 'the',
  [String.fromCharCode(0x2800 + 47)]: 'and',
  [String.fromCharCode(0x2800 + 63)]: 'for',
  [String.fromCharCode(0x2800 + 55)]: 'of',
  [String.fromCharCode(0x2800 + 62)]: 'with',
  [String.fromCharCode(0x2800 + 20)]: 'in',
  [String.fromCharCode(0x2800 + 33)]: 'ch',
  [String.fromCharCode(0x2800 + 41)]: 'sh',
  [String.fromCharCode(0x2800 + 57)]: 'th',
  [String.fromCharCode(0x2800 + 49)]: 'wh',
  [String.fromCharCode(0x2800 + 43)]: 'ed',
  [String.fromCharCode(0x2800 + 59)]: 'er',
  [String.fromCharCode(0x2800 + 51)]: 'ou',
  [String.fromCharCode(0x2800 + 42)]: 'ow'
};

export const LETTER_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(BRAILLE_LETTERS).map(([k, v]) => [String.fromCharCode(0x2800 + v), k])
);

export const CAP_SIGN = String.fromCharCode(0x2800 + 32); // dot 6 (U+2820) ⠠
export const NUM_SIGN = String.fromCharCode(0x2800 + 60); // dots 3,4,5,6 (U+283C) ⠼

// Bharati Braille mappings (Tamil script)
// Tamil vowels (உயிரெழுத்துக்கள்)
export const TAMIL_VOWELS: Record<string, string> = {
  'அ': String.fromCharCode(0x2800 + 1),       // ⠁ (a)
  'ஆ': String.fromCharCode(0x2800 + 28),      // ⠜ (aa)
  'இ': String.fromCharCode(0x2800 + 10),      // ⠊ (i)
  'ஈ': String.fromCharCode(0x2800 + 20),      // ⠔ (ii)
  'உ': String.fromCharCode(0x2800 + 37),      // ⠥ (u)
  'ஊ': String.fromCharCode(0x2800 + 51),      // ⠳ (uu)
  'எ': String.fromCharCode(0x2800 + 17),      // ⠑ (e)
  'ஏ': String.fromCharCode(0x2800 + 33),      // ⠡ (ee)
  'ஐ': String.fromCharCode(0x2800 + 12),      // ⠌ (ai)
  'ஒ': String.fromCharCode(0x2800 + 21),      // ⠕ (o)
  'ஓ': String.fromCharCode(0x2800 + 49),      // ⠱ (oo)
  'ஔ': String.fromCharCode(0x2800 + 42),      // ⠪ (au)
  'ஃ': String.fromCharCode(0x2800 + 32),      // ⠠ (aytham)
};

// Tamil consonants (மெய்யெழுத்துக்கள் base)
export const TAMIL_CONSONANTS: Record<string, string> = {
  'க': String.fromCharCode(0x2800 + 5),       // ⠅ (ka)
  'ங': String.fromCharCode(0x2800 + 44),      // ⠬ (nga)
  'ச': String.fromCharCode(0x2800 + 9),       // ⠉ (cha)
  'ஞ': String.fromCharCode(0x2800 + 18),      // ⠒ (nya)
  'ட': String.fromCharCode(0x2800 + 62),      // ⠾ (tta)
  'ண': String.fromCharCode(0x2800 + 60),      // ⠼ (nna)
  'த': String.fromCharCode(0x2800 + 30),      // ⠞ (ta)
  'ந': String.fromCharCode(0x2800 + 29),      // ⠝ (na)
  'ப': String.fromCharCode(0x2800 + 15),      // ⠏ (pa)
  'ம': String.fromCharCode(0x2800 + 13),      // ⠍ (ma)
  'ய': String.fromCharCode(0x2800 + 61),      // ⠽ (ya)
  'ர': String.fromCharCode(0x2800 + 23),      // ⠗ (ra)
  'ல': String.fromCharCode(0x2800 + 7),       // ⠇ (la)
  'வ': String.fromCharCode(0x2800 + 39),      // ⠧ (va)
  'ழ': String.fromCharCode(0x2800 + 55),      // ⠷ (zha)
  'ள': String.fromCharCode(0x2800 + 56),      // ⠸ (lla)
  'ற': String.fromCharCode(0x2800 + 26),      // ⠚ (rra)
  'ன': String.fromCharCode(0x2800 + 34),      // ⠢ (nna)
  'ஜ': String.fromCharCode(0x2800 + 26),      // ⠚ (ja)
  'ஷ': String.fromCharCode(0x2800 + 47),      // ⠯ (sha)
  'ஸ': String.fromCharCode(0x2800 + 14),      // ⠎ (sa)
  'ஹ': String.fromCharCode(0x2800 + 19),      // ⠓ (ha)
};

// Tamil Virama (pulli) and vowel signs
export const TAMIL_SIGNS: Record<string, string> = {
  '்': String.fromCharCode(0x2800 + 4),       // ⠄ (halant/virama)
  'ா': String.fromCharCode(0x2800 + 28),      // ⠜ (aa sign)
  'ி': String.fromCharCode(0x2800 + 10),      // ⠊ (i sign)
  'ீ': String.fromCharCode(0x2800 + 20),      // ⠔ (ii sign)
  'ு': String.fromCharCode(0x2800 + 37),      // ⠥ (u sign)
  'ூ': String.fromCharCode(0x2800 + 51),      // ⠳ (uu sign)
  'ெ': String.fromCharCode(0x2800 + 17),      // ⠑ (e sign)
  'ே': String.fromCharCode(0x2800 + 33),      // ⠡ (ee sign)
  'ை': String.fromCharCode(0x2800 + 12),      // ⠌ (ai sign)
  'ொ': String.fromCharCode(0x2800 + 21),      // ⠕ (o sign)
  'ோ': String.fromCharCode(0x2800 + 49),      // ⠱ (oo sign)
  'ௌ': String.fromCharCode(0x2800 + 42),      // ⠪ (au sign)
};

// Reverse map for Tamil Braille
export const REVERSE_TAMIL_BRAILLE: Record<string, string> = {};
for (const [k, v] of Object.entries(TAMIL_VOWELS)) {
  REVERSE_TAMIL_BRAILLE[v] = k;
}
for (const [k, v] of Object.entries(TAMIL_CONSONANTS)) {
  if (!REVERSE_TAMIL_BRAILLE[v]) REVERSE_TAMIL_BRAILLE[v] = k;
}
for (const [k, v] of Object.entries(TAMIL_SIGNS)) {
  if (!REVERSE_TAMIL_BRAILLE[v]) REVERSE_TAMIL_BRAILLE[v] = k;
}

export const TAMIL_VOWEL_TO_SIGN: Record<string, string> = {
  'அ': '',
  'ஆ': 'ா',
  'இ': 'ி',
  'ஈ': 'ீ',
  'உ': 'ு',
  'ஊ': 'ூ',
  'எ': 'ெ',
  'ஏ': 'ே',
  'ஐ': 'ை',
  'ஒ': 'ொ',
  'ஓ': 'ோ',
  'ஔ': 'ௌ',
};

/**
 * Complete Trained 64-Cell Braille Dictionary
 * Maps every 6-dot bitmask (0 to 63) to exact letter, digit, Tamil glyph, punctuation, and contraction.
 */
export interface BrailleCellDefinition {
  val: number;
  dots: number[];
  char: string;
  en: string;
  digit?: string;
  tamil?: string;
  tamilSign?: string;
  contraction?: string;
  punct?: string;
  special?: 'cap' | 'num' | 'space';
}

export const CELL_64_MAP: Record<number, BrailleCellDefinition> = {};

// Build full 64 table
for (let v = 0; v < 64; v++) {
  const activeDots: number[] = [];
  if (v & 1) activeDots.push(1);
  if (v & 2) activeDots.push(2);
  if (v & 4) activeDots.push(3);
  if (v & 8) activeDots.push(4);
  if (v & 16) activeDots.push(5);
  if (v & 32) activeDots.push(6);

  const uChar = String.fromCharCode(0x2800 + v);
  const def: BrailleCellDefinition = {
    val: v,
    dots: activeDots,
    char: uChar,
    en: LETTER_REVERSE[uChar] || '',
    digit: DIGIT_MAP[LETTER_REVERSE[uChar] || ''] || undefined,
    tamil: REVERSE_TAMIL_BRAILLE[uChar] || undefined,
    contraction: CONTRACTIONS[uChar] || undefined,
    punct: PUNCT_MAP[uChar] || undefined,
  };

  if (v === 0) def.special = 'space';
  else if (v === 32) def.special = 'cap';
  else if (v === 60) def.special = 'num';

  CELL_64_MAP[v] = def;
}

/**
 * Check if a text has Tamil script characters
 */
export function hasTamil(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

/**
 * Checks if a string contains Unicode Braille characters (U+2800 - U+28FF)
 */
export function containsBraille(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x2800 && code <= 0x28ff) return true;
  }
  return false;
}

/**
 * Convert plain text sentence (English, Tamil, numbers, punctuation) to Braille Unicode string
 */
export function toBrailleSentence(text: string, useGrade2 = true): string {
  if (!text) return '';
  const out: string[] = [];
  let inNum = false;

  const words = text.split(' ');
  for (let wIdx = 0; wIdx < words.length; wIdx++) {
    const word = words[wIdx];
    if (wIdx > 0) {
      out.push('⠀');
      inNum = false;
    }

    // Check Tamil text
    if (hasTamil(word)) {
      inNum = false;
      for (const ch of word) {
        if (TAMIL_VOWELS[ch]) {
          out.push(TAMIL_VOWELS[ch]);
        } else if (TAMIL_CONSONANTS[ch]) {
          out.push(TAMIL_CONSONANTS[ch]);
        } else if (TAMIL_SIGNS[ch]) {
          out.push(TAMIL_SIGNS[ch]);
        } else if (REV_PUNCT_MAP[ch]) {
          out.push(REV_PUNCT_MAP[ch]);
        } else {
          out.push(ch);
        }
      }
      continue;
    }

    // Grade 2 contractions for English
    const lowW = word.toLowerCase();
    if (useGrade2) {
      if (lowW === 'the') {
        if (word[0] === word[0].toUpperCase()) out.push(CAP_SIGN);
        out.push(String.fromCharCode(0x2800 + 46));
        continue;
      } else if (lowW === 'and') {
        if (word[0] === word[0].toUpperCase()) out.push(CAP_SIGN);
        out.push(String.fromCharCode(0x2800 + 47));
        continue;
      } else if (lowW === 'for') {
        if (word[0] === word[0].toUpperCase()) out.push(CAP_SIGN);
        out.push(String.fromCharCode(0x2800 + 63));
        continue;
      } else if (lowW === 'with') {
        if (word[0] === word[0].toUpperCase()) out.push(CAP_SIGN);
        out.push(String.fromCharCode(0x2800 + 62));
        continue;
      }
    }

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (ch >= 'A' && ch <= 'Z') {
        out.push(CAP_SIGN);
        const low = ch.toLowerCase();
        if (BRAILLE_LETTERS[low] !== undefined) {
          out.push(String.fromCharCode(0x2800 + BRAILLE_LETTERS[low]));
        }
        inNum = false;
      } else if (ch >= '0' && ch <= '9') {
        if (!inNum) {
          out.push(NUM_SIGN);
          inNum = true;
        }
        const letChar = REV_DIGIT_MAP[ch] || 'a';
        out.push(String.fromCharCode(0x2800 + BRAILLE_LETTERS[letChar]));
      } else if (BRAILLE_LETTERS[ch] !== undefined) {
        out.push(String.fromCharCode(0x2800 + BRAILLE_LETTERS[ch]));
        inNum = false;
      } else if (REV_PUNCT_MAP[ch]) {
        out.push(REV_PUNCT_MAP[ch]);
        inNum = false;
      } else if (ch === '\n' || ch === '\r') {
        out.push('\n');
        inNum = false;
      } else {
        out.push(ch);
        inNum = false;
      }
    }
  }

  return out.join('');
}

/**
 * Decode a single 6-dot Braille cell value (0-63)
 */
export function decodeBrailleCell(
  cellVal: number,
  preferLang = 'en',
  inNumber = false
): string {
  const def = CELL_64_MAP[cellVal];
  if (!def) return '';

  if (def.special === 'space') return ' ';
  if (def.special === 'cap') return '';
  if (def.special === 'num') return '';

  if (inNumber && def.digit) {
    return def.digit;
  }

  if (preferLang === 'ta' && def.tamil) {
    return def.tamil;
  }

  if (def.contraction) return def.contraction;
  if (def.en) return def.en;
  if (def.punct) return def.punct;
  if (def.tamil) return def.tamil;

  return def.char;
}

/**
 * Convert Braille Unicode string back to plain text sentence
 * Fully supports Tamil Bharati Braille, Grade 1/2 English, Numbers, and Punctuation
 */
export function brailleSentenceToText(brailleStr: string, preferLang = 'en'): string {
  if (!brailleStr) return '';
  const out: string[] = [];
  let capNext = false;
  let capAll = false;
  let inNumber = false;

  let i = 0;
  const n = brailleStr.length;

  // Detect whether the input braille has Tamil signs
  let hasTamilContext = preferLang === 'ta';
  for (let k = 0; k < n; k++) {
    const c = brailleStr[k];
    const code = c.charCodeAt(0);
    if (code >= 0x2800 && code <= 0x28ff) {
      const v = code - 0x2800;
      // Signs specific to Tamil like ⠠ followed by consonants or signs like ⠜, ⠾, ⠷, ⠸, ⠢
      if (v === 28 || v === 62 || v === 55 || v === 56 || v === 34 || v === 44) {
        hasTamilContext = true;
        break;
      }
    }
  }

  while (i < n) {
    const c = brailleStr[i];
    const code = c.charCodeAt(0);

    // If not in Braille Unicode range, keep as-is
    if (code < 0x2800 || code > 0x28ff) {
      if (c === ' ' || c === '\n' || c === '\r' || c === '\t') {
        inNumber = false;
        capAll = false;
        capNext = false;
      }
      out.push(c);
      i += 1;
      continue;
    }

    const val = code - 0x2800;

    // Capital Sign (dot 6 = 32)
    if (val === 32) {
      // In Tamil Bharati braille, dot 6 (⠠) before vowel can also be Aytham (ஃ)
      if (hasTamilContext && i + 1 < n && brailleStr[i + 1] === ' ') {
        out.push('ஃ');
        i += 1;
        continue;
      }
      if (i + 1 < n && brailleStr[i + 1].charCodeAt(0) - 0x2800 === 32) {
        capAll = true;
        i += 2;
      } else {
        capNext = true;
        i += 1;
      }
      continue;
    }

    // Number Sign (dots 3,4,5,6 = 60) vs Tamil consonant ண
    if (val === 60) {
      if (hasTamilContext) {
        out.push('ண');
        inNumber = false;
        i += 1;
        continue;
      }
      inNumber = true;
      i += 1;
      continue;
    }

    // Space (empty cell = 0)
    if (val === 0) {
      inNumber = false;
      capAll = false;
      capNext = false;
      out.push(' ');
      i += 1;
      continue;
    }

    // Tamil processing if in Tamil mode or detected Tamil
    if (hasTamilContext && REVERSE_TAMIL_BRAILLE[c]) {
      let tamilChar = REVERSE_TAMIL_BRAILLE[c];
      const prevChar = out.length > 0 ? out[out.length - 1] : '';
      const isPrevConsonant = /[\u0B95-\u0BB9]/.test(prevChar) && prevChar !== '்';

      // If previous char is a consonant and this is a vowel, combine it as a vowel sign!
      if (isPrevConsonant && TAMIL_VOWEL_TO_SIGN[tamilChar] !== undefined) {
        tamilChar = TAMIL_VOWEL_TO_SIGN[tamilChar];
      }

      if (tamilChar) {
        out.push(tamilChar);
      }
      inNumber = false;
      i += 1;
      continue;
    }

    // Contractions (English)
    if (!hasTamilContext && CONTRACTIONS[c]) {
      const word = CONTRACTIONS[c];
      if (capAll) {
        out.push(word.toUpperCase());
      } else if (capNext) {
        out.push(word.charAt(0).toUpperCase() + word.slice(1));
        capNext = false;
      } else {
        out.push(word);
      }
      inNumber = false;
      i += 1;
      continue;
    }

    // Punctuation
    if (PUNCT_MAP[c]) {
      inNumber = false;
      out.push(PUNCT_MAP[c]);
      i += 1;
      continue;
    }

    // Letters or Digits
    if (LETTER_REVERSE[c]) {
      const ch = LETTER_REVERSE[c];
      if (inNumber) {
        out.push(DIGIT_MAP[ch] || ch);
      } else {
        if (capAll || capNext) {
          out.push(ch.toUpperCase());
          capNext = false;
        } else {
          out.push(ch);
        }
      }
      i += 1;
      continue;
    }

    // Tamil Braille fallback
    if (REVERSE_TAMIL_BRAILLE[c]) {
      out.push(REVERSE_TAMIL_BRAILLE[c]);
      inNumber = false;
      i += 1;
      continue;
    }

    // Fallback: decode from 64 table
    const decoded = decodeBrailleCell(val, preferLang, inNumber);
    out.push(decoded || c);
    i += 1;
  }

  const rawResult = out.join('');

  // Post-process Tamil uyir-mei ligatures if Tamil characters are present
  // In Bharati Braille, consonant (e.g. க) + sign (e.g. ா) = கா, consonant + ் = க்
  let cleaned = rawResult;
  if (/[\u0B80-\u0BFF]/.test(cleaned)) {
    // Normalise any separate virama/pulli or signs into proper combined Unicode
    cleaned = cleaned.normalize('NFC');
  }

  return cleaned.replace(/ +/g, ' ').trim();
}

/**
 * Returns an array of booleans [dot1, dot2, dot3, dot4, dot5, dot6] for a given Braille Unicode char
 * Dot 1: bit 0 (val 1)
 * Dot 2: bit 1 (val 2)
 * Dot 3: bit 2 (val 4)
 * Dot 4: bit 3 (val 8)
 * Dot 5: bit 4 (val 16)
 * Dot 6: bit 5 (val 32)
 */
export function getBrailleDots(char: string): boolean[] {
  if (!char) return [false, false, false, false, false, false];
  const code = char.charCodeAt(0);
  if (code < 0x2800 || code > 0x28ff) {
    return [false, false, false, false, false, false];
  }
  const val = code - 0x2800;
  return [
    (val & 1) !== 0,
    (val & 2) !== 0,
    (val & 4) !== 0,
    (val & 8) !== 0,
    (val & 16) !== 0,
    (val & 32) !== 0,
  ];
}

/**
 * Create Braille char from active dots
 */
export function dotsToBraille(dots: boolean[]): string {
  let val = 0;
  if (dots[0]) val |= 1;
  if (dots[1]) val |= 2;
  if (dots[2]) val |= 4;
  if (dots[3]) val |= 8;
  if (dots[4]) val |= 16;
  if (dots[5]) val |= 32;
  return String.fromCharCode(0x2800 + val);
}

/**
 * Generates an audio tone or speech synthesis helper
 */
export interface LanguageInfo {
  name: string;
  nativeName: string;
  bcp47: string;
  flag: string;
  category: 'indian' | 'popular' | 'european' | 'asian' | 'other';
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageInfo> = {
  // Indian Languages (Bharati)
  ta: { name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN', flag: '🇮🇳', category: 'indian' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN', flag: '🇮🇳', category: 'indian' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN', flag: '🇮🇳', category: 'indian' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN', flag: '🇮🇳', category: 'indian' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN', flag: '🇮🇳', category: 'indian' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN', flag: '🇮🇳', category: 'indian' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN', flag: '🇮🇳', category: 'indian' },
  mr: { name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', flag: '🇮🇳', category: 'indian' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', flag: '🇮🇳', category: 'indian' },
  ur: { name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-PK', flag: '🇵🇰', category: 'indian' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bcp47: 'or-IN', flag: '🇮🇳', category: 'indian' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া', bcp47: 'as-IN', flag: '🇮🇳', category: 'indian' },
  ne: { name: 'Nepali', nativeName: 'नेपाली', bcp47: 'ne-NP', flag: '🇳🇵', category: 'indian' },
  si: { name: 'Sinhala', nativeName: 'සිංහල', bcp47: 'si-LK', flag: '🇱🇰', category: 'indian' },
  sa: { name: 'Sanskrit', nativeName: 'संस्कृतम्', bcp47: 'sa-IN', flag: '🇮🇳', category: 'indian' },

  // English & Popular Global
  en: { name: 'English (US)', nativeName: 'English (US)', bcp47: 'en-US', flag: '🇺🇸', category: 'popular' },
  'en-GB': { name: 'English (UK)', nativeName: 'English (UK)', bcp47: 'en-GB', flag: '🇬🇧', category: 'popular' },
  'en-IN': { name: 'English (India)', nativeName: 'English (India)', bcp47: 'en-IN', flag: '🇮🇳', category: 'popular' },
  es: { name: 'Spanish', nativeName: 'Español', bcp47: 'es-ES', flag: '🇪🇸', category: 'popular' },
  'es-419': { name: 'Spanish (Latin America)', nativeName: 'Español Latino', bcp47: 'es-419', flag: '🇲🇽', category: 'popular' },
  fr: { name: 'French', nativeName: 'Français', bcp47: 'fr-FR', flag: '🇫🇷', category: 'popular' },
  'fr-CA': { name: 'French (Canada)', nativeName: 'Français Canadien', bcp47: 'fr-CA', flag: '🇨🇦', category: 'popular' },
  de: { name: 'German', nativeName: 'Deutsch', bcp47: 'de-DE', flag: '🇩🇪', category: 'popular' },
  ar: { name: 'Arabic', nativeName: 'العربية', bcp47: 'ar-SA', flag: '🇸🇦', category: 'popular' },
  'zh-CN': { name: 'Chinese (Simplified)', nativeName: '中文 简体', bcp47: 'zh-CN', flag: '🇨🇳', category: 'popular' },
  'zh-TW': { name: 'Chinese (Traditional)', nativeName: '中文 繁體', bcp47: 'zh-TW', flag: '🇹🇼', category: 'popular' },
  ja: { name: 'Japanese', nativeName: '日本語', bcp47: 'ja-JP', flag: '🇯🇵', category: 'popular' },
  ko: { name: 'Korean', nativeName: '한국어', bcp47: 'ko-KR', flag: '🇰🇷', category: 'popular' },
  ru: { name: 'Russian', nativeName: 'Русский', bcp47: 'ru-RU', flag: '🇷🇺', category: 'popular' },
  pt: { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', bcp47: 'pt-BR', flag: '🇧🇷', category: 'popular' },
  'pt-PT': { name: 'Portuguese (Portugal)', nativeName: 'Português', bcp47: 'pt-PT', flag: '🇵🇹', category: 'popular' },
  it: { name: 'Italian', nativeName: 'Italiano', bcp47: 'it-IT', flag: '🇮🇹', category: 'popular' },

  // Asian Languages
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', bcp47: 'vi-VN', flag: '🇻🇳', category: 'asian' },
  th: { name: 'Thai', nativeName: 'ไทย', bcp47: 'th-TH', flag: '🇹🇭', category: 'asian' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', bcp47: 'id-ID', flag: '🇮🇩', category: 'asian' },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu', bcp47: 'ms-MY', flag: '🇲🇾', category: 'asian' },
  tl: { name: 'Filipino / Tagalog', nativeName: 'Filipino', bcp47: 'fil-PH', flag: '🇵🇭', category: 'asian' },
  my: { name: 'Burmese', nativeName: 'မြန်မာစာ', bcp47: 'my-MM', flag: '🇲🇲', category: 'asian' },
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ', bcp47: 'km-KH', flag: '🇰🇭', category: 'asian' },
  jw: { name: 'Javanese', nativeName: 'Basa Jawa', bcp47: 'jv-ID', flag: '🇮🇩', category: 'asian' },
  su: { name: 'Sundanese', nativeName: 'Basa Sunda', bcp47: 'su-ID', flag: '🇮🇩', category: 'asian' },
  yue: { name: 'Cantonese', nativeName: '粵語', bcp47: 'zh-HK', flag: '🇭🇰', category: 'asian' },

  // European Languages
  nl: { name: 'Dutch', nativeName: 'Nederlands', bcp47: 'nl-NL', flag: '🇳🇱', category: 'european' },
  pl: { name: 'Polish', nativeName: 'Polski', bcp47: 'pl-PL', flag: '🇵🇱', category: 'european' },
  sv: { name: 'Swedish', nativeName: 'Svenska', bcp47: 'sv-SE', flag: '🇸🇪', category: 'european' },
  no: { name: 'Norwegian', nativeName: 'Norsk', bcp47: 'nb-NO', flag: '🇳🇴', category: 'european' },
  da: { name: 'Danish', nativeName: 'Dansk', bcp47: 'da-DK', flag: '🇩🇰', category: 'european' },
  fi: { name: 'Finnish', nativeName: 'Suomi', bcp47: 'fi-FI', flag: '🇫🇮', category: 'european' },
  el: { name: 'Greek', nativeName: 'Ελληνικά', bcp47: 'el-GR', flag: '🇬🇷', category: 'european' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', bcp47: 'tr-TR', flag: '🇹🇷', category: 'european' },
  cs: { name: 'Czech', nativeName: 'Čeština', bcp47: 'cs-CZ', flag: '🇨🇿', category: 'european' },
  sk: { name: 'Slovak', nativeName: 'Slovenčina', bcp47: 'sk-SK', flag: '🇸🇰', category: 'european' },
  hu: { name: 'Hungarian', nativeName: 'Magyar', bcp47: 'hu-HU', flag: '🇭🇺', category: 'european' },
  ro: { name: 'Romanian', nativeName: 'Română', bcp47: 'ro-RO', flag: '🇷🇴', category: 'european' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', bcp47: 'uk-UA', flag: '🇺🇦', category: 'european' },
  bg: { name: 'Bulgarian', nativeName: 'Български', bcp47: 'bg-BG', flag: '🇧🇬', category: 'european' },
  hr: { name: 'Croatian', nativeName: 'Hrvatski', bcp47: 'hr-HR', flag: '🇭🇷', category: 'european' },
  sr: { name: 'Serbian', nativeName: 'Српски', bcp47: 'sr-RS', flag: '🇷🇸', category: 'european' },
  bs: { name: 'Bosnian', nativeName: 'Bosanski', bcp47: 'bs-BA', flag: '🇧🇦', category: 'european' },
  ca: { name: 'Catalan', nativeName: 'Català', bcp47: 'ca-ES', flag: '🇪🇸', category: 'european' },
  eu: { name: 'Basque', nativeName: 'Euskara', bcp47: 'eu-ES', flag: '🇪🇸', category: 'european' },
  gl: { name: 'Galician', nativeName: 'Galego', bcp47: 'gl-ES', flag: '🇪🇸', category: 'european' },
  cy: { name: 'Welsh', nativeName: 'Cymraeg', bcp47: 'cy-GB', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', category: 'european' },
  ga: { name: 'Irish', nativeName: 'Gaeilge', bcp47: 'ga-IE', flag: '🇮🇪', category: 'european' },
  is: { name: 'Icelandic', nativeName: 'Íslenska', bcp47: 'is-IS', flag: '🇮🇸', category: 'european' },
  et: { name: 'Estonian', nativeName: 'Eesti', bcp47: 'et-EE', flag: '🇪🇪', category: 'european' },
  lv: { name: 'Latvian', nativeName: 'Latviešu', bcp47: 'lv-LV', flag: '🇱🇻', category: 'european' },
  lt: { name: 'Lithuanian', nativeName: 'Lietuvių', bcp47: 'lt-LT', flag: '🇱🇹', category: 'european' },
  sq: { name: 'Albanian', nativeName: 'Shqip', bcp47: 'sq-AL', flag: '🇦🇱', category: 'european' },

  // Middle East & Africa & Other
  he: { name: 'Hebrew', nativeName: 'עברית', bcp47: 'he-IL', flag: '🇮🇱', category: 'other' },
  sw: { name: 'Swahili', nativeName: 'Kiswahili', bcp47: 'sw-KE', flag: '🇰🇪', category: 'other' },
  af: { name: 'Afrikaans', nativeName: 'Afrikaans', bcp47: 'af-ZA', flag: '🇿🇦', category: 'other' },
  am: { name: 'Amharic', nativeName: 'አማርኛ', bcp47: 'am-ET', flag: '🇪🇹', category: 'other' },
  ha: { name: 'Hausa', nativeName: 'Hausa', bcp47: 'ha-NG', flag: '🇳🇬', category: 'other' },
  la: { name: 'Latin', nativeName: 'Latina', bcp47: 'la', flag: '🏛️', category: 'other' },
};

