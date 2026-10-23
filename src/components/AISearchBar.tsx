import React, { useState } from 'react';
import { Search, Mic, MicOff, ArrowRight, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface AISearchBarProps {
  currentLang: LanguageCode;
  onSearch: (query: string, parsedIntent?: any) => void;
  isLoading: boolean;
  activeQuery: string;
  onClear: () => void;
  parsedIntent?: any;
  afcftaAdvice?: string;
}

const SAMPLE_PROMPTS: Record<LanguageCode, string[]> = {
  en: [
    'Packaging manufacturers in Angola exporting food containers to Namibia',
    'Organic shea butter wholesale in Côte d’Ivoire with export certificates',
    'Off-grid solar inverters in South Africa certified by SABS',
    'Biodegradable packaging suppliers in Ghana or Rwanda with regional delivery',
  ],
  pt: [
    'Fabricantes de embalagens em Angola que exportam para a Namíbia',
    'Castanha de caju em Moçambique com certificado sanitário para exportação',
    'Sistemas solares e baterias de lítio na África do Sul com norma SABS',
    'Embalagens biodegradáveis ecológicas no Ruanda ou Gana',
  ],
  fr: [
    'Fabricants d’emballages en Angola exportant vers la Namibie',
    'Beurre de karité bio en gros en Côte d’Ivoire certifiés Ecocert',
    'Onduleurs solaires hybrides en Afrique du Sud conformes SABS',
    'Emballages biodégradables au Ghana sous ZLECAf',
  ],
  sw: [
    'Watengenezaji wa vifungashio vya chakula nchini Angola wanaosafirisha Namibia',
    'Wauzaji wa jumla wa macadamia na korosho nchini Kenya na Msumbiji',
    'Vifaa vya umeme wa jua vyenye cheti cha SABS Afrika Kusini',
  ],
  ar: [
    'مصنعو عبوات زجاجية وكرتون للأغذية في مصر وأنغولا للتصدير تحت اتفاقية AfCFTA',
    'موردو زبدة الشيا العضوية بالجملة في كوت ديفوار مع شهادات تصدير موثقة',
    'معدات الطاقة الشمسية وبطاريات الليثيوم المعتمدة في جنوب أفريقيا',
  ],
};

export const AISearchBar: React.FC<AISearchBarProps> = ({
  currentLang,
  onSearch,
  isLoading,
  activeQuery,
  onClear,
  parsedIntent,
  afcftaAdvice,
}) => {
  const [inputVal, setInputVal] = useState(activeQuery);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const samplePrompts = SAMPLE_PROMPTS[currentLang] || SAMPLE_PROMPTS.en;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal.trim());
  };

  const handleSelectSample = (sample: string) => {
    setInputVal(sample);
    onSearch(sample);
  };

  const handleClear = () => {
    setInputVal('');
    onClear();
  };

  const handleToggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice search not supported in this browser.');
      setTimeout(() => setSpeechError(null), 3000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<LanguageCode, string> = {
        en: 'en-US',
        pt: 'pt-AO',
        fr: 'fr-FR',
        sw: 'sw-KE',
        ar: 'ar-EG',
      };
      recognition.lang = langMap[currentLang] || 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechError('Voice capture error. Please type your query.');
        setTimeout(() => setSpeechError(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="w-full bg-neutral-950 p-4 sm:p-6 rounded-3xl space-y-3.5 shadow-2xl">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-300 font-mono flex items-center gap-1.5 font-medium">{t.aiSearchSubtitle}</span>
        </div>

        {activeQuery && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white bg-neutral-900 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.resetSearch}</span>
          </button>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-neutral-900 text-white placeholder-neutral-500 text-xs sm:text-sm pl-11 pr-24 py-3 sm:py-3.5 rounded-2xl focus:bg-neutral-800 transition-colors shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleSpeech}
              title={isListening ? t.listening : 'Voice input'}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isListening ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-800/80'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="bg-white hover:bg-neutral-200 disabled:opacity-40 text-black font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span className="hidden xs:inline">{t.searchBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {speechError && <p className="text-xs text-neutral-400 mt-1 pl-2">{speechError}</p>}
      </form>

      {/* Parsed Intent & Corridor Note */}
      <AnimatePresence>
        {parsedIntent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 rounded-2xl bg-neutral-900 text-xs space-y-1.5 font-mono"
          >
            <div className="text-neutral-400 flex flex-wrap gap-2 items-center">
              <span className="text-white font-bold uppercase text-[10px] bg-black px-2 py-0.5 rounded">Parsed Intent:</span>
              {parsedIntent.productCategory && <span>Sector: {parsedIntent.productCategory} ·</span>}
              {parsedIntent.originCountry && <span>Origin: {parsedIntent.originCountry} ·</span>}
              {parsedIntent.destinationCountry && <span>Target: {parsedIntent.destinationCountry}</span>}
            </div>
            {afcftaAdvice && (
              <div className="text-neutral-300 text-[11px] pt-1 leading-relaxed">
                {afcftaAdvice}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-neutral-500 font-mono">Try:</span>
        {samplePrompts.slice(0, 3).map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectSample(prompt)}
            className="text-[11px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors cursor-pointer truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
