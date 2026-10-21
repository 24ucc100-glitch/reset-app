import React, { useState, useCallback } from 'react';
import { RotateCcw, Zap, ArrowRight } from 'lucide-react';
import { gentleAudio } from '../../utils/GentleAudio';
import { CompletionModal } from '../../components/CompletionModal';

interface RapidMathProps {
  onComplete: (minutes: number) => void;
  onReturnHome: () => void;
  onAnotherReset: () => void;
}

interface MathProblem {
  expression: string;
  answer: number;
  options: number[];
}

const generateProblem = (): MathProblem => {
  const types = ['add', 'sub', 'mul'] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  let a = 0;
  let b = 0;
  let answer = 0;
  let expression = '';

  if (type === 'add') {
    a = Math.floor(Math.random() * 45) + 12;
    b = Math.floor(Math.random() * 45) + 12;
    answer = a + b;
    expression = `${a} + ${b}`;
  } else if (type === 'sub') {
    a = Math.floor(Math.random() * 50) + 30;
    b = Math.floor(Math.random() * 25) + 8;
    answer = a - b;
    expression = `${a} - ${b}`;
  } else {
    a = Math.floor(Math.random() * 9) + 4;
    b = Math.floor(Math.random() * 9) + 3;
    answer = a * b;
    expression = `${a} × ${b}`;
  }

  // Generate 3 unique plausible decoys
  const decoys = new Set<number>();
  const offsets = [-2, 2, -1, 1, -10, 10, -5, 5, -3, 3];
  for (const offset of offsets) {
    const val = answer + offset;
    if (val > 0 && val !== answer) {
      decoys.add(val);
      if (decoys.size >= 3) break;
    }
  }

  const allOptions = [answer, ...Array.from(decoys).slice(0, 3)];
  // Shuffle options
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  return {
    expression,
    answer,
    options: allOptions,
  };
};

export const RapidMath: React.FC<RapidMathProps> = ({
  onComplete,
  onReturnHome,
  onAnotherReset,
}) => {
  const [problem, setProblem] = useState<MathProblem>(generateProblem);
  const [solvedCount, setSolvedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [selectedCorrect, setSelectedCorrect] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const nextProblem = useCallback(() => {
    setSelectedCorrect(null);
    setWrongAnswers([]);
    setProblem(generateProblem());
  }, []);

  const handleFinish = useCallback(() => {
    if (!hasCompleted) {
      setHasCompleted(true);
      onComplete(1); // 1 minute redirected
      gentleAudio.playSuccessChime();
      gentleAudio.triggerHaptic('success');
      setShowCompletion(true);
    }
  }, [hasCompleted, onComplete]);

  // Handle tap on option
  const handleAnswer = (option: number) => {
    if (wrongAnswers.includes(option) || selectedCorrect !== null) return;

    if (option === problem.answer) {
      // Correct!
      setSelectedCorrect(option);
      gentleAudio.playTapSound();
      gentleAudio.triggerHaptic('light');

      const nextSolved = solvedCount + 1;
      setSolvedCount(nextSolved);
      setStreak((prev) => prev + 1);

      // Check if reached 10 problems
      if (nextSolved >= 10 && !hasCompleted) {
        setTimeout(() => {
          handleFinish();
        }, 350);
      } else {
        // Immediate next problem emerging
        setTimeout(() => {
          nextProblem();
        }, 220);
      }
    } else {
      // Wrong
      setWrongAnswers((prev) => [...prev, option]);
      setStreak(0);
      gentleAudio.playEarlyNotice();
      gentleAudio.triggerHaptic('light');
    }
  };

  const handleRestart = () => {
    setSolvedCount(0);
    setStreak(0);
    setWrongAnswers([]);
    setSelectedCorrect(null);
    setShowCompletion(false);
    setHasCompleted(false);
    nextProblem();
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[520px] py-2">
      {/* Top Header */}
      <div className="text-center w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Rapid Mental Math</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Solve & Keep Moving
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Tap the answer immediately. New problems emerge instantly to displace recursive loops.
        </p>
      </div>

      {/* Progress & Solved Counter */}
      <div className="w-full max-w-sm flex items-center justify-between px-2 my-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Solved:
          </span>
          <span className="text-lg font-bold text-sky-400 tabular-nums">
            {solvedCount}
          </span>
          <span className="text-xs text-slate-500">/ 10 target</span>
        </div>

        {streak >= 3 && (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">
            <span>🔥</span>
            <span>{streak} streak</span>
          </div>
        )}

        <button
          onClick={handleRestart}
          aria-label="Reset math session"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Math Problem Card */}
      <div className="w-full max-w-sm rounded-3xl bg-[#111726] border border-slate-800 p-6 shadow-xl flex flex-col items-center text-center my-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Calculate:
        </span>
        
        {/* Large Math Expression */}
        <div className="text-5xl sm:text-6xl font-black text-white tracking-tight my-4 font-mono select-none">
          {problem.expression} = ?
        </div>

        <p className="text-[11px] text-slate-400 mb-6">
          Tap the correct number below:
        </p>

        {/* 4 Instant Tap Choice Buttons (2x2 Grid) */}
        <div className="w-full grid grid-cols-2 gap-3">
          {problem.options.map((option, idx) => {
            const isCorrect = selectedCorrect === option;
            const isWrong = wrongAnswers.includes(option);

            return (
              <button
                key={idx}
                disabled={isWrong || selectedCorrect !== null}
                onClick={() => handleAnswer(option)}
                className={`py-4 px-4 rounded-2xl text-2xl font-bold font-mono transition-all active:scale-95 cursor-pointer flex items-center justify-center select-none shadow-md ${
                  isCorrect
                    ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/40 ring-4 ring-emerald-400/30'
                    : isWrong
                    ? 'bg-rose-950/40 text-rose-400 border border-rose-500/40 opacity-40 cursor-not-allowed'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/60 hover:border-sky-400/40'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Finish Button */}
      <div className="w-full max-w-sm mt-4 px-2 flex items-center justify-between">
        <p className="text-[11px] text-slate-400">
          Fast arithmetic pulls neural activity into working memory.
        </p>
        <button
          onClick={handleFinish}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer whitespace-nowrap pl-2"
        >
          <span>Done now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        title="Attention Sharp ✓"
        subtitle="Your analytical brain is anchored in the present moment."
        statHighlight={`${solvedCount} math problems solved`}
        onReturn={onReturnHome}
        onAnotherReset={onAnotherReset}
      />
    </div>
  );
};
