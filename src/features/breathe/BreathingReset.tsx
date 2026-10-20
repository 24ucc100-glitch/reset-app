import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { gentleAudio } from '../../utils/GentleAudio';
import { CompletionModal } from '../../components/CompletionModal';

interface BreathingResetProps {
  onComplete: (minutes: number) => void;
  onReturnHome: () => void;
  onAnotherReset: () => void;
}

type BreathPhase = 'idle' | 'inhale' | 'exhale';

const TOTAL_SECONDS = 60;
const CYCLE_HALF = 4; // 4 seconds in, 4 seconds out

export const BreathingReset: React.FC<BreathingResetProps> = ({
  onComplete,
  onReturnHome,
  onAnotherReset,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Interval reference
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimerRef = useRef<number>(0);

  const handleFinish = useCallback(() => {
    if (!hasCompleted) {
      setHasCompleted(true);
      onComplete(1); // 1 minute redirected
      gentleAudio.playSuccessChime();
      gentleAudio.triggerHaptic('success');
      setShowCompletion(true);
    }
  }, [hasCompleted, onComplete]);

  // Sound and phase loop
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsActive(false);
          setPhase('idle');
          handleFinish();
          return 0;
        }
        return prev - 1;
      });

      cycleTimerRef.current = (cycleTimerRef.current + 1) % (CYCLE_HALF * 2);
      if (cycleTimerRef.current < CYCLE_HALF) {
        setPhase('inhale');
      } else {
        setPhase('exhale');
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, handleFinish]);

  // Audio tone cue on phase switch
  useEffect(() => {
    if (!isActive) return;
    if (phase === 'inhale') {
      gentleAudio.playBreatheChime(396);
      gentleAudio.triggerHaptic('light');
    } else if (phase === 'exhale') {
      gentleAudio.playBreatheChime(330);
      gentleAudio.triggerHaptic('light');
    }
  }, [phase, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    cycleTimerRef.current = 0;
    gentleAudio.playTapSound();
  };

  const handlePause = () => {
    setIsActive(false);
    gentleAudio.playTapSound();
  };

  const handleRestart = () => {
    setIsActive(false);
    setSecondsLeft(TOTAL_SECONDS);
    setPhase('idle');
    cycleTimerRef.current = 0;
    setShowCompletion(false);
    setHasCompleted(false);
    gentleAudio.playTapSound();
  };

  const progressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[520px] py-2">
      {/* Header instructions */}
      <div className="text-center w-full">
        <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
          60-Second Guided Breath
        </span>
        <h2 className="text-2xl font-bold text-white mt-1">
          Breathe & Release
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Synchronize your breath with the circle. Allow your nervous system to ground.
        </p>
      </div>

      {/* Animated Circle Container */}
      <div className="relative my-8 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
        {/* Background glow ring */}
        <div
          className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
            phase === 'inhale'
              ? 'w-60 h-60 bg-sky-500/15 blur-xl scale-125'
              : phase === 'exhale'
              ? 'w-44 h-44 bg-indigo-500/10 blur-lg scale-95'
              : 'w-44 h-44 bg-slate-800/20 blur-md'
          }`}
        />

        {/* Breathing animated central circle */}
        <div
          style={{
            transform: phase === 'inhale' ? 'scale(1.35)' : phase === 'exhale' ? 'scale(0.92)' : 'scale(1)',
            transition: isActive ? 'transform 4s ease-in-out, background 4s ease-in-out' : 'transform 0.5s ease',
          }}
          className={`relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center border shadow-2xl ${
            phase === 'inhale'
              ? 'bg-gradient-to-tr from-indigo-600/40 via-sky-500/30 to-teal-400/20 border-sky-400/50 shadow-sky-500/20'
              : phase === 'exhale'
              ? 'bg-gradient-to-tr from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/30 shadow-indigo-500/10'
              : 'bg-gradient-to-tr from-slate-900 to-[#111726] border-slate-800 shadow-slate-950'
          }`}
        >
          {/* Phase text */}
          <div className="text-center px-4">
            <span
              className={`text-lg sm:text-xl font-extrabold tracking-wide transition-colors ${
                phase === 'inhale'
                  ? 'text-sky-300'
                  : phase === 'exhale'
                  ? 'text-indigo-300'
                  : 'text-slate-400'
              }`}
            >
              {phase === 'inhale'
                ? 'Breathe in'
                : phase === 'exhale'
                ? 'Breathe out'
                : 'Ready'}
            </span>

            {/* Countdown seconds */}
            <div className="text-2xl font-black tracking-tight text-white mt-1 tabular-nums">
              {secondsLeft}s
            </div>

            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              remaining
            </div>
          </div>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full max-w-xs px-4 mb-6">
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls: Start, Pause/Stop, Restart */}
      <div className="w-full max-w-xs flex items-center justify-center gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{secondsLeft === TOTAL_SECONDS ? 'Start' : 'Resume'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={handleRestart}
          aria-label="Restart exercise"
          className="p-3.5 rounded-2xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        title="Done ✓"
        subtitle="You don't need to solve the thought right now."
        statHighlight="1 minute redirected to breath"
        onReturn={onReturnHome}
        onAnotherReset={onAnotherReset}
      />
    </div>
  );
};
