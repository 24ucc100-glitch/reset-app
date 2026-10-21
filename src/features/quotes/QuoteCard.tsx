import React, { useState } from 'react';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';
import { GROUNDING_QUOTES } from './quotesData';
import { gentleAudio } from '../../utils/GentleAudio';

export const QuoteCard: React.FC = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * GROUNDING_QUOTES.length));
  const [isRotating, setIsRotating] = useState(false);

  const handleNextQuote = () => {
    setIsRotating(true);
    gentleAudio.playTapSound();
    gentleAudio.triggerHaptic('light');

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % GROUNDING_QUOTES.length);
      setIsRotating(false);
    }, 180);
  };

  const current = GROUNDING_QUOTES[index];

  return (
    <div className="w-full my-5 p-4 rounded-3xl bg-gradient-to-br from-[#121829] via-[#0f1422] to-[#121829] border border-indigo-500/25 shadow-lg relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[10px] font-semibold tracking-wider uppercase text-indigo-300">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Energize Mindset • {current.theme}</span>
        </div>

        <button
          onClick={handleNextQuote}
          aria-label="Spark another quote"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
          title="Spark new quote"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRotating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline text-slate-400">Next</span>
        </button>
      </div>

      <div className="flex items-start gap-3 my-2">
        <Quote className="w-5 h-5 text-indigo-400/60 flex-shrink-0 mt-0.5 rotate-180" />
        <p className={`text-xs sm:text-sm text-slate-200 font-medium leading-relaxed italic transition-opacity duration-200 ${isRotating ? 'opacity-20' : 'opacity-100'}`}>
          “{current.quote}”
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
        <span className="font-semibold text-slate-400">— {current.author}</span>
        <button
          onClick={handleNextQuote}
          className="text-sky-400 hover:text-sky-300 font-medium active:scale-95 transition-transform cursor-pointer"
        >
          Spark another ⚡
        </button>
      </div>
    </div>
  );
};
