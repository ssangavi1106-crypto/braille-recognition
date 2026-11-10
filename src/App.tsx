/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { VisionScanner } from './components/VisionScanner.tsx';
import { BrailleTranslator } from './components/BrailleTranslator.tsx';
import { SpeechBar } from './components/SpeechBar.tsx';
import { BrailleGuide } from './components/BrailleGuide.tsx';
import { LanguageSettingsModal } from './components/LanguageSettingsModal.tsx';
import { toBrailleSentence, SUPPORTED_LANGUAGES } from './lib/braille.ts';
import { getAvailableVoices, findBestVoice, speakSentenceRobust } from './lib/speech.ts';
import { Eye, Languages, Sparkles, BookOpen, Volume2, Globe } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'converter' | 'guide'>('scanner');
  const [currentText, setCurrentText] = useState<string>('');
  const [currentBraille, setCurrentBraille] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>('ta'); // Default Tamil
  const [detectedType, setDetectedType] = useState<string>('none');
  const [detectionNotes, setDetectionNotes] = useState<string>('');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [autoVoiceAlert, setAutoVoiceAlert] = useState<string | null>(null);

  useEffect(() => {
    getAvailableVoices().then(setAvailableVoices);
  }, []);

  const selectedLangInfo = SUPPORTED_LANGUAGES[selectedLang] || {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    bcp47: 'ta-IN',
  };

  /**
   * Speak text immediately using robust Web Speech Synthesis
   */
  const speakTextImmediately = useCallback((textToSpeak: string, langCode: string) => {
    if (!textToSpeak || textToSpeak === '—' || textToSpeak === 'No words or Braille detected') {
      return;
    }

    speakSentenceRobust(
      textToSpeak,
      langCode,
      0.95,
      1.0,
      () => {
        setAutoVoiceAlert(`Speaking: "${textToSpeak.slice(0, 45)}${textToSpeak.length > 45 ? '...' : ''}" in ${SUPPORTED_LANGUAGES[langCode]?.name || langCode}`);
      },
      () => {
        setTimeout(() => setAutoVoiceAlert(null), 3000);
      }
    );
  }, []);

  /**
   * Triggered when photo upload or camera snap finishes
   */
  const handleScanComplete = (result: {
    text: string;
    braille: string;
    detectedType: string;
    notes?: string;
    shouldAutoSpeak?: boolean;
  }) => {
    setCurrentText(result.text);
    setCurrentBraille(result.braille);
    setDetectedType(result.detectedType);
    setDetectionNotes(result.notes || '');

    // User requirement: "naa photo upload or camera la yeduthaoddanae atha voice extract pannanum"
    if (result.shouldAutoSpeak && result.text && result.text !== '—') {
      speakTextImmediately(result.text, selectedLang);
    }
  };

  const handleQuickDemo = () => {
    const demoTamil = 'வணக்கம்! பிரெய்லி மற்றும் குரல் ஸ்டுடியோவிற்கு வரவேற்கிறோம்.';
    const bDemo = toBrailleSentence(demoTamil);
    setCurrentText(demoTamil);
    setCurrentBraille(bDemo);
    setSelectedLang('ta');
    speakTextImmediately(demoTamil, 'ta');
  };

  const handleSpeakChar = (charText: string, lang: string) => {
    speakTextImmediately(charText, lang);
  };

  const handleTestVoice = (langCode: string) => {
    const samplePhrases: Record<string, string> = {
      ta: 'வணக்கம், குரல் சோதனை வெற்றிகரமாக முடிந்தது.',
      hi: 'नमस्ते, आवाज परीक्षण सफल रहा।',
      te: 'నమస్కారం, వాయిస్ పరీక్ష పూర్తయింది.',
      ml: 'നമസ്കാരം, ശബ്ദ പരിശോധന വിജയകരമാണ്.',
      kn: 'ನಮಸ್ಕಾರ, ಧ್ವನಿ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿಯಾಗಿದೆ.',
      bn: 'নমস্কার, ভয়েস পরীক্ষা সফল হয়েছে।',
      es: 'Hola, prueba de voz completada con éxito.',
      fr: 'Bonjour, test vocal réussi.',
      de: 'Hallo, Sprachtest erfolgreich abgeschlossen.',
      ar: 'مرحبا، تم اختبار الصوت بنجاح.',
      'zh-CN': '您好，语音测试已成功。',
      ja: 'こんにちは、音声テストが正常に完了しました。',
      en: 'Hello, voice test completed successfully.',
    };

    const phrase = samplePhrases[langCode] || `Hello, testing voice audio for ${SUPPORTED_LANGUAGES[langCode]?.name || langCode}.`;
    speakTextImmediately(phrase, langCode);
  };

  return (
    <div className="min-h-screen bg-[#090d1a] text-slate-100 flex flex-col">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickDemo={handleQuickDemo}
        onOpenLanguages={() => setIsLangModalOpen(true)}
        selectedLangFlag={selectedLangInfo.flag}
        selectedLangName={selectedLangInfo.name}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-6">
        {/* Instant Auto-Voice Floating Status Alert */}
        {autoVoiceAlert && (
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm shadow-xl shadow-emerald-950/40 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
              <span className="font-medium">{autoVoiceAlert}</span>
            </div>
            <button
              onClick={() => speakTextImmediately(currentText, selectedLang)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
            >
              Replay Audio
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-2">
          <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 font-medium mb-2">
            <span>Assistive Accessibility</span>
            <span aria-hidden="true">·</span>
            <span>Instant Auto-Voice on Upload & Camera</span>
            <span aria-hidden="true">·</span>
            <span>All 75+ Global Languages</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            Braille & Sentence Speech Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 text-balance leading-relaxed">
            Upload a photo or snap your camera — text and Braille dots are <strong>automatically extracted and spoken in voice</strong> immediately.
          </p>

          {/* Quick Language Selector Pill */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                Active Language: <strong>{selectedLangInfo.flag} {selectedLangInfo.name} ({selectedLangInfo.nativeName})</strong>
              </span>
              <span className="text-[11px] text-indigo-400 font-medium">All Languages (75+) ⚙️</span>
            </button>
          </div>
        </section>

        {/* Primary View Switcher Navigation */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Camera & Image OCR (Auto-Voice)</span>
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'converter'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>Sentence Converter & Keyboard</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Braille Chart Guide</span>
            </button>
          </div>
        </div>

        {/* Active View Module */}
        {activeTab === 'scanner' && (
          <div className="flex flex-col gap-6">
            <VisionScanner
              onScanComplete={handleScanComplete}
              selectedLang={selectedLang}
              onOpenLanguageSettings={() => setIsLangModalOpen(true)}
            />

            {/* Display notes if available */}
            {detectionNotes && (
              <div className="flex items-center gap-2 p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-300">
                <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>Detection Summary: {detectionNotes}</span>
              </div>
            )}

            {/* Speech and Audio controls */}
            <SpeechBar
              text={currentText}
              braille={currentBraille}
              selectedLang={selectedLang}
              onLangChange={setSelectedLang}
              onOpenLanguageSettings={() => setIsLangModalOpen(true)}
            />

            {/* Braille and Text Results Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-400 tracking-wider">
                    BRAILLE NOTATION (UNICODE)
                  </span>
                  {currentBraille ? (
                    <div className="font-braille text-3xl sm:text-4xl text-amber-300 min-h-16 mt-2 leading-relaxed break-words tracking-widest">
                      {currentBraille}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic min-h-16 mt-2 flex items-center">
                      Waiting for photo upload... Braille patterns will appear here once an image is analyzed.
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  {currentBraille ? `${currentBraille.length} Braille characters extracted` : 'No Braille extracted yet'}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 tracking-wider">
                    RECOGNIZED / TRANSLATED SENTENCE (VOICE TARGET)
                  </span>
                  {currentText ? (
                    <div className="text-xl sm:text-2xl font-medium text-slate-100 min-h-16 mt-2 leading-relaxed break-words">
                      {currentText}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic min-h-16 mt-2 flex items-center">
                      Waiting for photo upload... Extracted text will appear and be spoken aloud here.
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  {currentText ? 'Voice ready for playback' : 'No sentence extracted yet'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'converter' && (
          <div className="flex flex-col gap-6">
            <BrailleTranslator
              currentText={currentText}
              currentBraille={currentBraille}
              onChange={(txt, brl) => {
                setCurrentText(txt);
                setCurrentBraille(brl);
              }}
              selectedLang={selectedLang}
            />

            <SpeechBar
              text={currentText}
              braille={currentBraille}
              selectedLang={selectedLang}
              onLangChange={setSelectedLang}
              onOpenLanguageSettings={() => setIsLangModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="flex flex-col gap-6">
            <BrailleGuide onSpeakChar={handleSpeakChar} />
            <SpeechBar
              text={currentText}
              braille={currentBraille}
              selectedLang={selectedLang}
              onLangChange={setSelectedLang}
              onOpenLanguageSettings={() => setIsLangModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Complete All Languages Settings Modal */}
      <LanguageSettingsModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedLang={selectedLang}
        onSelectLang={(code) => {
          setSelectedLang(code);
        }}
        onTestVoice={handleTestVoice}
        availableVoices={availableVoices}
      />

      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AI Braille & Voice Recognition Studio. Accessible multimodal assistive tech.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Instant Camera/Upload Auto-Voice</span>
            <span aria-hidden="true">·</span>
            <span>All 75+ World Languages</span>
            <span aria-hidden="true">·</span>
            <span>பாரதி பிரெய்லி (Tamil)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
