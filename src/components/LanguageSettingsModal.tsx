/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Search, Check, Globe, Volume2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '../lib/braille.ts';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: string;
  onSelectLang: (langCode: string) => void;
  onTestVoice: (langCode: string) => void;
  availableVoices: SpeechSynthesisVoice[];
}

export const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLang,
  onSelectLang,
  onTestVoice,
  availableVoices,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'indian' | 'popular' | 'european' | 'asian' | 'other'>('all');

  const voiceLangs = useMemo(() => {
    return new Set(availableVoices.map((v) => v.lang.toLowerCase().split('-')[0]));
  }, [availableVoices]);

  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return Object.entries(SUPPORTED_LANGUAGES).filter(([code, info]) => {
      // Category filter
      if (activeCategory !== 'all' && info.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (!q) return true;
      return (
        code.toLowerCase().includes(q) ||
        info.name.toLowerCase().includes(q) ||
        info.nativeName.toLowerCase().includes(q) ||
        info.bcp47.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  if (!isOpen) return null;

  const currentInfo: LanguageInfo | undefined = SUPPORTED_LANGUAGES[selectedLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Voice & Speech Language Settings</h2>
              <p className="text-xs text-slate-400">
                Choose from all 75+ world languages for Braille reading, OCR, and voice speech
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Language Pill */}
        <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-900/30 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Active Language:</span>
            <span className="font-semibold text-white flex items-center gap-1.5 bg-indigo-600/30 border border-indigo-500/40 px-2.5 py-0.5 rounded-md">
              <span>{currentInfo?.flag}</span>
              <span>{currentInfo?.name}</span>
              <span className="text-indigo-300 font-medium">({currentInfo?.nativeName})</span>
            </span>
          </div>
          <button
            onClick={() => onTestVoice(selectedLang)}
            className="flex items-center gap-1.5 text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice Sound</span>
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by language name or native script (e.g. Tamil, தமிழ், Hindi, हिन्दी, Spanish, Español, ta)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Languages (75+)
            </button>
            <button
              onClick={() => setActiveCategory('indian')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'indian'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🇮🇳 Indian Languages (தமிழ், हिन्दी...)
            </button>
            <button
              onClick={() => setActiveCategory('popular')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'popular'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Popular Global
            </button>
            <button
              onClick={() => setActiveCategory('asian')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'asian'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Asian
            </button>
            <button
              onClick={() => setActiveCategory('european')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'european'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              European
            </button>
            <button
              onClick={() => setActiveCategory('other')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'other'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Middle East & Africa
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filteredLanguages.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No language found matching "{search}".
            </div>
          ) : (
            filteredLanguages.map(([code, info]) => {
              const isSelected = selectedLang === code;
              const hasVoice = voiceLangs.has(code.toLowerCase().split('-')[0]);

              return (
                <div
                  key={code}
                  onClick={() => {
                    onSelectLang(code);
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl shrink-0">{info.flag}</span>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white truncate">
                          {info.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {info.nativeName}
                        <span className="ml-1 text-[10px] text-slate-500 font-mono">
                          [{info.bcp47}]
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Test audio button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLang(code);
                      onTestVoice(code);
                    }}
                    title={`Test audio speech in ${info.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-600/40 transition-colors opacity-80 group-hover:opacity-100"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredLanguages.length}</strong> languages
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
