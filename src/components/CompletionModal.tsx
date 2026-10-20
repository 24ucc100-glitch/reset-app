import React from 'react';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  statHighlight?: string;
  onReturn: () => void;
  onAnotherReset: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  title,
  subtitle,
  statHighlight,
  onReturn,
  onAnotherReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#111726] border border-slate-800 p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* Glow badge */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-sky-400 mb-4 shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-sky-400" />
        </div>

        {/* Title */}
        <h2 id="completion-title" className="text-2xl font-bold text-white tracking-tight mb-2">
          {title}
        </h2>

        {/* Subtitle / Grounding message */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-xs mb-4">
          “{subtitle}”
        </p>

        {/* Stat highlight if provided */}
        {statHighlight && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 mb-6">
            <span>✨</span>
            <span>{statHighlight}</span>
          </div>
        )}

        {/* Core psychological return question */}
        <div className="w-full pt-4 border-t border-slate-800/80 mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Ready to step back?
          </p>
          <p className="text-base font-medium text-slate-100">
            Do you want to return to what you were doing?
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={onReturn}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <span>Yes, I'm ready</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onAnotherReset}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/60 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Another 2-minute reset</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-4">
          Interrupting the loop is enough. No need to over-analyze.
        </p>
      </div>
    </div>
  );
};
