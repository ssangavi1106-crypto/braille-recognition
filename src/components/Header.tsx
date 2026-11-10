/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'converter' | 'guide';
  onTabChange: (tab: 'scanner' | 'converter' | 'guide') => void;
  onQuickDemo: () => void;
  onOpenLanguages: () => void;
  selectedLangFlag?: string;
  selectedLangName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onQuickDemo,
  onOpenLanguages,
  selectedLangFlag,
  selectedLangName,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
          AI Braille Voice Studio
        </span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onTabChange('scanner')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'scanner' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Vision OCR & Camera
        </button>
        <button
          onClick={() => onTabChange('converter')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'converter' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Sentence & Keyboard
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'guide' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Braille Chart (English & தமிழ்)
        </button>
        <button
          onClick={onOpenLanguages}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-indigo-300"
        >
          <span>{selectedLangFlag || '🌐'}</span>
          <span>{selectedLangName ? `${selectedLangName} (All ⚙️)` : 'All Languages (75+)'}</span>
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={async () => {
            const url = window.location.href;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: 'AI Braille & Voice Recognition Studio',
                  text: 'Convert Braille dot patterns and sentences to speech voice in Tamil, English, and 75+ languages!',
                  url,
                });
              } catch (e) {
                // user cancelled or failed, fallback to copy
              }
            } else {
              await navigator.clipboard.writeText(url);
              alert('Link copied to clipboard! You can share it or open on any phone.');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Share app link or open on phone"
        >
          <span className="text-sm">📱</span>
          <span>Share App</span>
        </button>

        <button
          onClick={onQuickDemo}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-md shadow-indigo-950/40 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Audio Demo</span>
        </button>
      </div>
    </header>
  );
};
