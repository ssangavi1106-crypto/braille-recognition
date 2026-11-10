/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { dotsToBraille, BRAILLE_LETTERS, TAMIL_VOWELS, TAMIL_CONSONANTS } from '../lib/braille.ts';
import { Delete, Space, Plus, RotateCcw } from 'lucide-react';

interface BrailleKeyboardProps {
  onAppendBraille: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const BrailleKeyboard: React.FC<BrailleKeyboardProps> = ({
  onAppendBraille,
  onBackspace,
  onClear,
}) => {
  // Current 6-dot matrix [dot1, dot2, dot3, dot4, dot5, dot6]
  const [activeDots, setActiveDots] = useState<boolean[]>([false, false, false, false, false, false]);
  const [activeTab, setActiveTab] = useState<'perkins' | 'alphabet' | 'tamil'>('perkins');

  const toggleDot = (idx: number) => {
    setActiveDots((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleCommitCurrentCell = () => {
    const hasAnyDot = activeDots.some(Boolean);
    if (hasAnyDot) {
      const bChar = dotsToBraille(activeDots);
      onAppendBraille(bChar);
      setActiveDots([false, false, false, false, false, false]);
    }
  };

  const currentPreviewChar = dotsToBraille(activeDots);
  const hasActiveDot = activeDots.some(Boolean);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      {/* Keyboard Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('perkins')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'perkins'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactile 6-Dot Perkins
          </button>
          <button
            onClick={() => setActiveTab('alphabet')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'alphabet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English Grid (A–Z)
          </button>
          <button
            onClick={() => setActiveTab('tamil')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'tamil'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tamil Bharati (தமிழ்)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackspace}
            title="Backspace"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Del</span>
          </button>
          <button
            onClick={onClear}
            title="Clear all"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Perkins 6-Dot Interactive Pad */}
      {activeTab === 'perkins' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            {/* Left 3 dots: 3, 2, 1 */}
            <div className="flex gap-2">
              {[2, 1, 0].map((idx) => {
                const dotNum = idx + 1;
                const isSelected = activeDots[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDot(idx)}
                    className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl border font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-95'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">Dot {dotNum}</span>
                    <span className="text-[10px] opacity-60 font-mono">
                      {idx === 0 ? 'F' : idx === 1 ? 'D' : 'S'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Current Cell Preview */}
            <div className="flex flex-col items-center justify-center px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 min-w-16">
              <span className="text-[10px] text-slate-500 font-medium">CELL</span>
              <span className="text-3xl font-mono text-amber-400 my-1">
                {hasActiveDot ? currentPreviewChar : '⠀'}
              </span>
              <span className="text-[10px] text-slate-400">
                {hasActiveDot ? `Dots ${activeDots.map((v, i) => (v ? i + 1 : null)).filter(Boolean).join(',')}` : 'Empty'}
              </span>
            </div>

            {/* Right 3 dots: 4, 5, 6 */}
            <div className="flex gap-2">
              {[3, 4, 5].map((idx) => {
                const dotNum = idx + 1;
                const isSelected = activeDots[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDot(idx)}
                    className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl border font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-95'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">Dot {dotNum}</span>
                    <span className="text-[10px] opacity-60 font-mono">
                      {idx === 3 ? 'J' : idx === 4 ? 'K' : 'L'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Commit Cell, Space */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <button
              onClick={handleCommitCurrentCell}
              disabled={!hasActiveDot}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dot Cell to Text</span>
            </button>
            <button
              onClick={() => onAppendBraille('⠀')}
              className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors"
            >
              <Space className="w-4 h-4" />
              <span>Space</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Direct English Alphabet Palette */}
      {activeTab === 'alphabet' && (
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5">
          {Object.entries(BRAILLE_LETTERS).map(([char, val]) => {
            const bChar = String.fromCharCode(0x2800 + val);
            return (
              <button
                key={char}
                onClick={() => onAppendBraille(bChar)}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all text-slate-200"
              >
                <span className="text-xl font-mono text-amber-400">{bChar}</span>
                <span className="text-xs font-semibold text-slate-300 uppercase">{char}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 3: Tamil Bharati Braille Palette */}
      {activeTab === 'tamil' && (
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-xs text-slate-400 font-medium mb-1.5">உயிரெழுத்துக்கள் (Vowels)</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
              {Object.entries(TAMIL_VOWELS).map(([char, bChar]) => (
                <button
                  key={char}
                  onClick={() => onAppendBraille(bChar)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all"
                >
                  <span className="text-xl font-mono text-amber-400">{bChar}</span>
                  <span className="text-xs font-tamil text-slate-300">{char}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium mb-1.5">மெய்யெழுத்துக்கள் (Consonants)</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-1.5">
              {Object.entries(TAMIL_CONSONANTS).map(([char, bChar]) => (
                <button
                  key={char}
                  onClick={() => onAppendBraille(bChar)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all"
                >
                  <span className="text-xl font-mono text-amber-400">{bChar}</span>
                  <span className="text-xs font-tamil text-slate-300">{char}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
