/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BRAILLE_LETTERS,
  DIGIT_MAP,
  REV_DIGIT_MAP,
  TAMIL_VOWELS,
  TAMIL_CONSONANTS,
  CONTRACTIONS,
} from '../lib/braille.ts';
import { BrailleCell } from './BrailleCell.tsx';
import { Volume2 } from 'lucide-react';

interface BrailleGuideProps {
  onSpeakChar: (text: string, lang: string) => void;
}

export const BrailleGuide: React.FC<BrailleGuideProps> = ({ onSpeakChar }) => {
  const [section, setSection] = useState<'english' | 'numbers' | 'contractions' | 'tamil'>('english');

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Braille Reference Chart & Pronunciation</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tap any cell to hear standard voice audio pronunciation
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSection('english')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              section === 'english' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alphabet (A–Z)
          </button>
          <button
            onClick={() => setSection('numbers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              section === 'numbers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Numbers (0–9)
          </button>
          <button
            onClick={() => setSection('tamil')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              section === 'tamil' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bharati Tamil (தமிழ்)
          </button>
          <button
            onClick={() => setSection('contractions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              section === 'contractions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Grade 2 Contractions
          </button>
        </div>
      </div>

      {/* Section 1: English Alphabet */}
      {section === 'english' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {Object.entries(BRAILLE_LETTERS).map(([char, val]) => {
            const bChar = String.fromCharCode(0x2800 + val);
            return (
              <div
                key={char}
                onClick={() => onSpeakChar(char, 'en')}
                className="group flex flex-col items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer hover:scale-105"
              >
                <span className="text-sm font-bold text-white uppercase">{char}</span>
                <div className="my-2">
                  <BrailleCell char={bChar} size="sm" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400">
                  <Volume2 className="w-3 h-3" />
                  <span className="font-mono text-amber-400">{bChar}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section 2: Numbers */}
      {section === 'numbers' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(REV_DIGIT_MAP).map(([num, letterKey]) => {
            const letterVal = BRAILLE_LETTERS[letterKey] || 1;
            const bChar = String.fromCharCode(0x2800 + letterVal);
            return (
              <div
                key={num}
                onClick={() => onSpeakChar(`Number ${num}`, 'en')}
                className="group flex flex-col items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer hover:scale-105"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Number Sign ⠼ +</span>
                  <span className="font-bold text-white text-base">{num}</span>
                </div>
                <div className="my-2 flex items-center gap-1">
                  <BrailleCell char="⠼" size="sm" />
                  <BrailleCell char={bChar} size="sm" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400">
                  <Volume2 className="w-3 h-3" />
                  <span className="font-mono text-amber-400">⠼{bChar}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section 3: Tamil Bharati Braille */}
      {section === 'tamil' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-tamil mb-3">
              உயிரெழுத்துக்கள் (Tamil Vowels)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {Object.entries(TAMIL_VOWELS).map(([char, bChar]) => (
                <div
                  key={char}
                  onClick={() => onSpeakChar(char, 'ta')}
                  className="group flex flex-col items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer hover:scale-105"
                >
                  <span className="text-base font-bold text-white font-tamil">{char}</span>
                  <div className="my-2">
                    <BrailleCell char={bChar} size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400">
                    <Volume2 className="w-3 h-3" />
                    <span className="font-mono text-amber-400">{bChar}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-tamil mb-3">
              மெய்யெழுத்துக்கள் (Tamil Consonants)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {Object.entries(TAMIL_CONSONANTS).map(([char, bChar]) => (
                <div
                  key={char}
                  onClick={() => onSpeakChar(char, 'ta')}
                  className="group flex flex-col items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer hover:scale-105"
                >
                  <span className="text-base font-bold text-white font-tamil">{char}</span>
                  <div className="my-2">
                    <BrailleCell char={bChar} size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400">
                    <Volume2 className="w-3 h-3" />
                    <span className="font-mono text-amber-400">{bChar}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Grade 2 Contractions */}
      {section === 'contractions' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(CONTRACTIONS).map(([bChar, word]) => (
            <div
              key={word}
              onClick={() => onSpeakChar(word, 'en')}
              className="group flex flex-col items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer hover:scale-105"
            >
              <span className="text-sm font-bold text-white">{word}</span>
              <div className="my-2">
                <BrailleCell char={bChar} size="sm" />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400">
                <Volume2 className="w-3 h-3" />
                <span className="font-mono text-amber-400">{bChar}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
