/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, Mic, MicOff, Copy, Check, Sparkles, Volume2, VolumeX, Zap, Send } from 'lucide-react';
import { toBrailleSentence, brailleSentenceToText, containsBraille, SUPPORTED_LANGUAGES } from '../lib/braille.ts';
import { BrailleCell } from './BrailleCell.tsx';
import { BrailleKeyboard } from './BrailleKeyboard.tsx';

interface BrailleTranslatorProps {
  currentText: string;
  currentBraille: string;
  onChange: (text: string, braille: string) => void;
  selectedLang: string;
  onSpeak?: (text: string, lang: string) => void;
}

export const BrailleTranslator: React.FC<BrailleTranslatorProps> = ({
  currentText,
  currentBraille,
  onChange,
  selectedLang,
  onSpeak,
}) => {
  const [inputText, setInputText] = useState(currentText);
  const [useGrade2, setUseGrade2] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [copiedType, setCopiedType] = useState<'text' | 'braille' | null>(null);
  const [activeTab, setActiveTab] = useState<'text-to-braille' | 'braille-keyboard'>('text-to-braille');
  const [autoSpeakOnType, setAutoSpeakOnType] = useState(true);
  const debounceTimerRef = useRef<any>(null);

  const langInfo = SUPPORTED_LANGUAGES[selectedLang] || { name: 'English', flag: '🌐', nativeName: 'English' };

  useEffect(() => {
    setInputText(currentText);
  }, [currentText]);

  // Handle live text input (Normal sentence or Braille)
  const handleTextChange = (val: string) => {
    setInputText(val);

    let decoded = '';
    let bEncoded = '';

    if (containsBraille(val)) {
      decoded = brailleSentenceToText(val, selectedLang);
      bEncoded = val;
      onChange(decoded, val);
    } else {
      decoded = val;
      bEncoded = toBrailleSentence(val, useGrade2);
      onChange(val, bEncoded);
    }

    // Auto-speak if enabled
    if (autoSpeakOnType && onSpeak && decoded.trim().length > 1) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        onSpeak(decoded.trim(), selectedLang);
      }, 700);
    }
  };

  // Toggle Grade 2 contractions
  const handleToggleGrade2 = () => {
    const nextVal = !useGrade2;
    setUseGrade2(nextVal);
    if (inputText && !containsBraille(inputText)) {
      const bEncoded = toBrailleSentence(inputText, nextVal);
      onChange(inputText, bEncoded);
    }
  };

  // Voice speech-to-text dictation
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const bcp = SUPPORTED_LANGUAGES[selectedLang]?.bcp47 || 'en-US';
      recognition.lang = bcp;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const newText = inputText ? `${inputText} ${transcript}` : transcript;
          handleTextChange(newText);
          if (onSpeak) {
            onSpeak(newText, selectedLang);
          }
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const copyToClipboard = (type: 'text' | 'braille', content: string) => {
    if (!content || content === '—') return;
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Append Braille character from Perkins keyboard
  const handleAppendBraille = (char: string) => {
    const nextBraille = (currentBraille === '—' ? '' : currentBraille) + char;
    const decoded = brailleSentenceToText(nextBraille, selectedLang);
    setInputText(decoded);
    onChange(decoded, nextBraille);
  };

  const handleBackspace = () => {
    if (!currentBraille || currentBraille === '—') return;
    const nextBraille = currentBraille.slice(0, -1);
    const decoded = brailleSentenceToText(nextBraille, selectedLang);
    setInputText(decoded);
    onChange(decoded, nextBraille);
  };

  const handleClear = () => {
    setInputText('');
    onChange('', '');
  };

  // Quick preset sentences
  const setQuickExample = (text: string) => {
    handleTextChange(text);
    if (onSpeak) {
      onSpeak(text, selectedLang);
    }
  };

  const handleTriggerSpeak = () => {
    const textToSpeak = currentText || inputText;
    if (textToSpeak && textToSpeak !== '—' && onSpeak) {
      onSpeak(textToSpeak, selectedLang);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('text-to-braille')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'text-to-braille'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Normal Sentence & Braille
          </button>
          <button
            onClick={() => setActiveTab('braille-keyboard')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'braille-keyboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactile Braille Keyboard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={autoSpeakOnType}
              onChange={(e) => setAutoSpeakOnType(e.target.checked)}
              className="accent-emerald-500 rounded cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Voice on type</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={useGrade2}
              onChange={handleToggleGrade2}
              className="accent-indigo-500 rounded cursor-pointer"
            />
            <span>Grade 2 Contractions</span>
          </label>
        </div>
      </div>

      {activeTab === 'text-to-braille' ? (
        /* Text Typing & Voice Dictation Area */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Type or Paste Normal Sentence (English, தமிழ், Hindi, etc.):
              </span>
              <span className="text-[11px] text-indigo-400 font-medium bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Voice Target: {langInfo.flag} {langInfo.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Voice dictation microphone"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
              </button>

              {inputText && (
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type or paste any normal sentence here (e.g. 'Good morning! How are you?', 'காலை வணக்கம்! எப்படி இருக்கிறீர்கள்?')..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-base"
          />

          {/* Action Row: Direct Voice Convert & Speak Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <button
              type="button"
              onClick={handleTriggerSpeak}
              disabled={!inputText || inputText.trim().length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-semibold text-sm shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Convert Normal Sentence to Voice & Speak</span>
            </button>

            <span className="text-xs text-slate-400">
              Converts to both natural speech voice and Braille notation
            </span>
          </div>

          {/* Quick sentence presets */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-500 font-medium">Try Normal Sentences:</span>
            <button
              onClick={() => setQuickExample('Hello! Welcome to our studio.')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Hello! Welcome to our studio.
            </button>
            <button
              onClick={() => setQuickExample('வணக்கம்! இன்று உங்களை வரவேற்பதில் மகிழ்ச்சி.')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-tamil cursor-pointer"
            >
              வணக்கம்! இன்று வரவேற்பதில் மகிழ்ச்சி.
            </button>
            <button
              onClick={() => setQuickExample('கல்வி கண் போன்றது.')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-tamil cursor-pointer"
            >
              கல்வி கண் போன்றது.
            </button>
            <button
              onClick={() => setQuickExample('Braille empowers independent reading.')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Braille empowers independent reading.
            </button>
          </div>
        </div>
      ) : (
        /* Tactile Keyboard Mode */
        <BrailleKeyboard
          onAppendBraille={handleAppendBraille}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />
      )}

      {/* Results Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Normal Plain Text Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <span className="text-xs font-semibold text-emerald-400 tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>NORMAL SENTENCE (VOICE AUDIO)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerSpeak}
                  disabled={!currentText || currentText === '—'}
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/40 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Speak</span>
                </button>
                <button
                  onClick={() => copyToClipboard('text', currentText)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedType === 'text' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-slate-100 min-h-16 leading-relaxed break-words">
              {currentText || '—'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
            {currentText && currentText !== '—'
              ? `Spoken aloud in ${langInfo.name} (${langInfo.nativeName})`
              : 'Enter any normal sentence or Braille to speak voice'}
          </div>
        </div>

        {/* Braille Output Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <span className="text-xs font-semibold text-amber-400 tracking-wider">
                BRAILLE NOTATION (UNICODE)
              </span>
              <button
                onClick={() => copyToClipboard('braille', currentBraille)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedType === 'braille' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-braille text-3xl sm:text-4xl text-amber-300 min-h-16 leading-relaxed break-words tracking-widest selection:bg-amber-500 selection:text-black">
              {currentBraille || '—'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
            {currentBraille && currentBraille !== '—'
              ? `${currentBraille.length} Braille cells matched`
              : 'Waiting for text or scan input...'}
          </div>
        </div>
      </div>

      {/* Visual 6-Dot Raised Cells Gallery */}
      {currentBraille && currentBraille !== '—' && currentBraille.trim().length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Raised 6-Dot Tactile Cells Breakdown:
            </span>
            <span className="text-xs text-slate-500">
              Yellow dots indicate active raised pins
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 max-h-56 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {Array.from(currentBraille).map((char, idx) => (
              <BrailleCell
                key={idx}
                char={char}
                size="md"
                showLabels={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
