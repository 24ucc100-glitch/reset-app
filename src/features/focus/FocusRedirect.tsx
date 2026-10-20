import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import type { FocusTaskOption, FocusTaskItem } from '../../types';
import { gentleAudio } from '../../utils/GentleAudio';
import { CompletionModal } from '../../components/CompletionModal';

interface FocusRedirectProps {
  onComplete: (minutes: number) => void;
  onReturnHome: () => void;
  onAnotherReset: () => void;
}

const TASKS: FocusTaskItem[] = [
  {
    id: 'clean',
    icon: '🧹',
    title: 'Clean one small area',
    description: 'Desk, sink, nightstand or shelf',
    detail: 'Pick just one physical surface near you. Clear clutter or wipe it down until the timer rings.',
  },
  {
    id: 'walk',
    icon: '🚶',
    title: 'Walk for 5 minutes',
    description: 'Step away from your screen or seat',
    detail: 'Walk around your room, down the corridor, or outside. Pay attention to the sensation of your feet.',
  },
  {
    id: 'water',
    icon: '💧',
    title: 'Drink water + stretch',
    description: 'Slow sip, roll shoulders & neck',
    detail: 'Pour a fresh glass of cold water. Take three slow sips and roll your shoulders backwards five times.',
  },
  {
    id: 'problem',
    icon: '🧠',
    title: 'Solve one easy problem',
    description: 'Gently shift gears to concrete thinking',
    detail: 'Engage your logical brain with an effortless micro-puzzle below.',
  },
];

const MINI_PROBLEMS = [
  {
    question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    answer: '5 cents ($0.05)',
    hint: 'If ball is 5¢, bat is $1.05. Total = $1.10.',
  },
  {
    question: 'What gets wetter and wetter the more it dries?',
    answer: 'A towel',
    hint: 'Think of bathroom items!',
  },
  {
    question: 'Quick mental math: 47 + 38 = ?',
    answer: '85',
    hint: '47 + 30 = 77; 77 + 8 = 85.',
  },
  {
    question: 'I have branches, but no fruit, trunk or leaves. What am I?',
    answer: 'A bank (or a river/railroad)',
    hint: 'Think outside nature.',
  },
];

const INITIAL_SECONDS = 5 * 60; // 5:00 = 300 seconds

export const FocusRedirect: React.FC<FocusRedirectProps> = ({
  onComplete,
  onReturnHome,
  onAnotherReset,
}) => {
  const [selectedTask, setSelectedTask] = useState<FocusTaskOption>('clean');
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Micro problem state if task is 'problem'
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleFinish = useCallback(() => {
    if (!hasCompleted) {
      setHasCompleted(true);
      onComplete(5); // 5 minutes redirected
      gentleAudio.playSuccessChime();
      gentleAudio.triggerHaptic('success');
      setShowCompletion(true);
    }
  }, [hasCompleted, onComplete]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleFinish]);

  const handleStart = () => {
    setIsRunning(true);
    gentleAudio.playTapSound();
  };

  const handlePause = () => {
    setIsRunning(false);
    gentleAudio.playTapSound();
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(INITIAL_SECONDS);
    setShowCompletion(false);
    setHasCompleted(false);
    gentleAudio.playTapSound();
  };

  const currentTaskItem = TASKS.find((t) => t.id === selectedTask) || TASKS[0];

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = ((INITIAL_SECONDS - secondsLeft) / INITIAL_SECONDS) * 100;

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[520px] py-2">
      {/* Top Header */}
      <div className="text-center w-full">
        <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
          Attention Redirection
        </span>
        <h2 className="text-2xl font-bold text-white mt-1">
          5-Minute Task
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Engage your body or hands with a concrete action for 5 minutes.
        </p>
      </div>

      {/* Task Selector Tabs */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-2 my-4">
        {TASKS.map((task) => {
          const isSelected = selectedTask === task.id;
          return (
            <button
              key={task.id}
              onClick={() => {
                setSelectedTask(task.id);
                setShowAnswer(false);
                gentleAudio.playTapSound();
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/60 shadow-sm shadow-indigo-500/10'
                  : 'bg-[#111726] border-slate-800/80 hover:border-slate-700/60 opacity-80 hover:opacity-100'
              }`}
            >
              <span className="text-lg">{task.icon}</span>
              <div className="overflow-hidden">
                <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {task.title}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {task.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Prominent Selected Task Display Card */}
      <div className="w-full max-w-sm rounded-3xl bg-[#111726] border border-slate-800/90 p-5 shadow-xl flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-2">
          {currentTaskItem.icon}
        </div>
        <h3 className="text-base font-bold text-white">
          {currentTaskItem.title}
        </h3>
        <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
          {currentTaskItem.detail}
        </p>

        {/* Micro problem section if "problem" is selected */}
        {selectedTask === 'problem' && (
          <div className="w-full mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-sky-400">
                <Sparkles className="w-3 h-3" />
                <span>Micro Riddle #{puzzleIndex + 1}</span>
              </span>
              <button
                onClick={() => {
                  setPuzzleIndex((prev) => (prev + 1) % MINI_PROBLEMS.length);
                  setShowAnswer(false);
                }}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Next Riddle
              </button>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              {MINI_PROBLEMS[puzzleIndex].question}
            </p>
            {showAnswer ? (
              <div className="mt-2 pt-2 border-t border-slate-800 text-xs">
                <p className="text-emerald-400 font-bold">
                  Answer: {MINI_PROBLEMS[puzzleIndex].answer}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {MINI_PROBLEMS[puzzleIndex].hint}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Reveal Answer
              </button>
            )}
          </div>
        )}

        {/* Large 5:00 Countdown Clock */}
        <div className="mt-5 mb-3 flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono tabular-nums">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
            {isRunning ? 'In Progress' : secondsLeft === INITIAL_SECONDS ? 'Ready' : 'Paused'}
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons: Start, Pause, Resume, Reset */}
        <div className="w-full flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{secondsLeft === INITIAL_SECONDS ? 'Start' : 'Resume'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            aria-label="Reset countdown"
            className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 active:scale-95 transition-all cursor-pointer"
            title="Reset to 5:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center max-w-xs mt-3">
        When the 5 minutes conclude, check in gently with your body.
      </p>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        title="5 minutes done."
        subtitle="Check in with yourself."
        statHighlight="5 minutes redirected to physical action"
        onReturn={onReturnHome}
        onAnotherReset={onAnotherReset}
      />
    </div>
  );
};
