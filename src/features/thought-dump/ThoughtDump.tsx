import React, { useState } from 'react';
import { Bookmark, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { gentleAudio } from '../../utils/GentleAudio';
import { CompletionModal } from '../../components/CompletionModal';

interface ThoughtDumpProps {
  lastThought: string;
  onSaveThought: (thought: string) => void;
  onClearThought: () => void;
  onComplete: () => void;
  onReturnHome: () => void;
  onAnotherReset: () => void;
}

export const ThoughtDump: React.FC<ThoughtDumpProps> = ({
  lastThought,
  onSaveThought,
  onClearThought,
  onComplete,
  onReturnHome,
  onAnotherReset,
}) => {
  const [inputText, setInputText] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const handlePark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSaveThought(inputText.trim());
    setInputText('');
    onComplete(); // increments reset count

    gentleAudio.playSuccessChime();
    gentleAudio.triggerHaptic('success');
    setShowCompletion(true);
  };

  const handleClear = () => {
    onClearThought();
    gentleAudio.playTapSound();
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[520px] py-2">
      {/* Top Title & Instruction */}
      <div className="text-center w-full">
        <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
          Cognitive Offloading
        </span>
        <h2 className="text-2xl font-bold text-white mt-1">
          Park the thought.
        </h2>
        <div className="mt-3 p-3.5 rounded-2xl bg-[#111726] border border-slate-800 text-left max-w-sm mx-auto">
          <p className="text-xs text-slate-300 leading-relaxed italic">
            “Write the thought exactly as it is. Then ask: Can I act on this in the next 10 minutes?”
          </p>
        </div>
      </div>

      {/* Main Form or Existing Parked Thought Card */}
      <div className="w-full max-w-sm my-5">
        {lastThought ? (
          <div className="p-5 rounded-3xl bg-[#111726] border border-indigo-500/30 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <Bookmark className="w-4 h-4 fill-sky-400/20" />
                <span>Safely Parked Locally</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                Stored offline
              </span>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90">
              <p className="text-sm text-slate-100 font-medium whitespace-pre-wrap leading-relaxed">
                “{lastThought}”
              </p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed mb-4">
              <strong>Grounding reminder:</strong> “Parked. You don't have to solve it right now.”
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear thought</span>
              </button>

              <button
                onClick={() => setShowCompletion(true)}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Finished</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePark} className="flex flex-col gap-3">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="What keeps coming back to my mind?"
                rows={4}
                maxLength={400}
                className="w-full p-4 rounded-2xl bg-[#111726] border border-slate-800 focus:border-indigo-500 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono">
                {inputText.length}/400
              </span>
            </div>

            {/* Psychological 10-minute check */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <span>
                If you cannot take a 10-minute physical action on it right now, parking it here allows you to let it rest.
              </span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white shadow-indigo-600/30 active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Park it</span>
            </button>
          </form>
        )}
      </div>

      {/* Bottom reassurance */}
      <div className="text-center max-w-xs">
        <p className="text-[11px] text-slate-400">
          Your thoughts remain purely inside this browser's local memory.
        </p>
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        title="Parked."
        subtitle="You don't have to solve it right now."
        statHighlight="Offloaded from active memory"
        onReturn={onReturnHome}
        onAnotherReset={onAnotherReset}
      />
    </div>
  );
};
