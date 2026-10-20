import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { gentleAudio } from '../../utils/GentleAudio';
import { CompletionModal } from '../../components/CompletionModal';

interface ReflexGameProps {
  onComplete: (bestMs: number) => void;
  onReturnHome: () => void;
  onAnotherReset: () => void;
}

type GameState = 'idle' | 'waiting' | 'ready' | 'early' | 'roundResult' | 'finished';

const TOTAL_ROUNDS = 5;

export const ReflexGame: React.FC<ReflexGameProps> = ({
  onComplete,
  onReturnHome,
  onAnotherReset,
}) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimes, setRoundTimes] = useState<number[]>([]);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    };
  }, []);

  const startRound = () => {
    setGameState('waiting');
    gentleAudio.playTapSound();

    // Random delay between 800ms and 3000ms
    const randomDelay = Math.floor(Math.random() * (3000 - 800 + 1)) + 800;

    timerTimeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('ready');
      gentleAudio.playTapSound();
      gentleAudio.triggerHaptic('medium');
    }, randomDelay);
  };

  const handleScreenTap = () => {
    if (gameState === 'waiting') {
      // User tapped too early!
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      setGameState('early');
      gentleAudio.playEarlyNotice();
      gentleAudio.triggerHaptic('light');
    } else if (gameState === 'ready') {
      // Successful tap!
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setLastReactionTime(elapsed);
      gentleAudio.playTapSound();
      gentleAudio.triggerHaptic('success');

      const nextTimes = [...roundTimes, elapsed];
      setRoundTimes(nextTimes);

      if (currentRound >= TOTAL_ROUNDS) {
        // All 5 rounds done
        setGameState('finished');
        const minTime = Math.min(...nextTimes);
        onComplete(minTime);
        gentleAudio.playSuccessChime();
        setShowCompletion(true);
      } else {
        setGameState('roundResult');
      }
    }
  };

  const handleNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    startRound();
  };

  const handleResetGame = () => {
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    setGameState('idle');
    setCurrentRound(1);
    setRoundTimes([]);
    setLastReactionTime(null);
    setShowCompletion(false);
    gentleAudio.playTapSound();
  };

  const averageTime =
    roundTimes.length > 0
      ? Math.round(roundTimes.reduce((acc, curr) => acc + curr, 0) / roundTimes.length)
      : 0;

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[520px] py-2">
      {/* Header instructions */}
      <div className="text-center w-full">
        <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
          Reflex Game • Round {Math.min(currentRound, TOTAL_ROUNDS)} of {TOTAL_ROUNDS}
        </span>
        <h2 className="text-2xl font-bold text-white mt-1">
          Break the Loop
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          “Wait for GO. Tap as fast as you can.”
        </p>
      </div>

      {/* Interactive Reflex Arena */}
      <div className="w-full max-w-sm my-6">
        {gameState === 'idle' && (
          <div className="p-8 rounded-3xl bg-[#111726] border border-slate-800 text-center flex flex-col items-center justify-center min-h-[280px]">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ready to test?</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-xs">
              When the screen turns green and flashes <strong>TAP!</strong>, hit it immediately. 5 quick rounds.
            </p>
            <button
              onClick={startRound}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/40 flex items-center gap-2 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START ROUND 1</span>
            </button>
          </div>
        )}

        {gameState === 'waiting' && (
          <button
            onClick={handleScreenTap}
            className="w-full min-h-[280px] rounded-3xl bg-slate-900 border-2 border-amber-500/30 flex flex-col items-center justify-center p-6 text-center select-none active:scale-[0.99] transition-all cursor-pointer focus:outline-none"
          >
            <span className="w-4 h-4 rounded-full bg-amber-400 animate-ping mb-4" />
            <span className="text-xl font-bold text-amber-300">Wait for GO...</span>
            <span className="text-xs text-slate-400 mt-2">Hold your finger ready. Don't tap yet.</span>
          </button>
        )}

        {gameState === 'early' && (
          <div className="w-full min-h-[280px] rounded-3xl bg-rose-950/30 border-2 border-rose-500/40 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl mb-2">😄</span>
            <h3 className="text-lg font-bold text-rose-300 mb-1">
              Too early 😄 Try again.
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Anticipating the tap keeps you in your head. Wait for the green flash!
            </p>
            <button
              onClick={startRound}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              Try Round {currentRound} Again
            </button>
          </div>
        )}

        {gameState === 'ready' && (
          <button
            onClick={handleScreenTap}
            className="w-full min-h-[280px] rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 border-4 border-white/60 flex flex-col items-center justify-center p-6 text-center select-none active:scale-95 transition-transform cursor-pointer shadow-2xl shadow-emerald-500/50"
          >
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md animate-bounce">
              TAP!
            </span>
            <span className="text-sm font-semibold text-emerald-950 mt-2 bg-white/70 px-3 py-1 rounded-full">
              NOW!
            </span>
          </button>
        )}

        {gameState === 'roundResult' && (
          <div className="w-full min-h-[280px] rounded-3xl bg-[#111726] border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Round {currentRound} Reaction
            </span>
            <span className="text-4xl font-extrabold text-sky-400 tracking-tight my-2">
              {lastReactionTime} <span className="text-xl font-normal text-slate-400">ms</span>
            </span>
            <p className="text-xs text-slate-400 mb-6">
              {lastReactionTime && lastReactionTime < 250
                ? '⚡ Incredible focus!'
                : 'Nice sharp response.'}
            </p>
            <button
              onClick={handleNextRound}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Start Round {currentRound + 1}
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="w-full min-h-[280px] rounded-3xl bg-[#111726] border border-emerald-500/30 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
              5 Rounds Completed
            </span>
            <span className="text-3xl font-extrabold text-white tracking-tight my-2">
              {averageTime} ms <span className="text-xs font-normal text-slate-400 block mt-0.5">average reaction</span>
            </span>
            <div className="flex gap-2 my-3">
              {roundTimes.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 border border-slate-700/60 text-slate-300 font-mono"
                >
                  {t}ms
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowCompletion(true)}
              className="mt-3 py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              Continue →
            </button>
          </div>
        )}
      </div>

      {/* Footer controls & round dots */}
      <div className="w-full max-w-sm flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i + 1 < currentRound || (i + 1 === currentRound && (gameState === 'roundResult' || gameState === 'finished'))
                  ? 'bg-sky-400'
                  : i + 1 === currentRound
                  ? 'bg-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleResetGame}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset game</span>
        </button>
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        title="Nice."
        subtitle="Your attention is back in the room."
        statHighlight={`Average reaction: ${averageTime} ms`}
        onReturn={onReturnHome}
        onAnotherReset={onAnotherReset}
      />
    </div>
  );
};
