import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ActivityType, UserStats } from '../../types';
import { QuickActionCard } from '../../components/QuickActionCard';
import { TodayStats } from './TodayStats';
import { gentleAudio } from '../../utils/GentleAudio';

interface HomeScreenProps {
  stats: UserStats;
  onSelectActivity: (activity: ActivityType) => void;
  onInstantReset: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onSelectActivity,
  onInstantReset,
}) => {
  const handlePrimaryClick = () => {
    gentleAudio.playTapSound();
    gentleAudio.triggerHaptic('medium');
    onInstantReset();
  };

  const handleCardClick = (activity: ActivityType) => {
    gentleAudio.playTapSound();
    gentleAudio.triggerHaptic('light');
    onSelectActivity(activity);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Branding & Purpose */}
      <div className="w-full text-center pt-2 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Grounding & Distraction</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">
          RESET
        </h1>
        <p className="text-sm font-medium text-slate-400 tracking-wide">
          “Stop the loop. Do one thing.”
        </p>

        {/* Core grounding anchor quote answering: "What should I do when I start overthinking?" */}
        <div className="mt-5 p-4 rounded-2xl bg-[#111726]/80 border border-slate-800/90 text-left relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-sky-400" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            What to do when overthinking starts:
          </p>
          <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
            “When your mind keeps replaying a question, don't solve it right now. Interrupt it with a tiny action.”
          </blockquote>
        </div>
      </div>

      {/* Hero Primary Button: "I'M OVERTHINKING →" */}
      <div className="w-full mb-7">
        <button
          onClick={handlePrimaryClick}
          className="group w-full py-4 px-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-base sm:text-lg tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>I'M OVERTHINKING</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </button>
        <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
          Launches an immediate random 1–5 minute physical distraction.
        </p>
      </div>

      {/* Four Quick-Action Cards */}
      <div className="w-full space-y-2.5">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Pick a quick reset
          </span>
          <span className="text-[11px] text-slate-400">2–5 min</span>
        </div>

        <QuickActionCard
          id="breathe"
          icon="🌬️"
          title="Breathe"
          subtitle="60-second reset"
          tag="1 min"
          onSelect={handleCardClick}
        />

        <QuickActionCard
          id="reflex"
          icon="⚡"
          title="Reflex"
          subtitle="Break the loop"
          tag="Fast"
          onSelect={handleCardClick}
        />

        <QuickActionCard
          id="focus"
          icon="⏱️"
          title="Focus"
          subtitle="5-minute task"
          tag="5 min"
          onSelect={handleCardClick}
        />

        <QuickActionCard
          id="thought-dump"
          icon="📝"
          title="Thought Dump"
          subtitle="Park it safely"
          tag="Offline"
          onSelect={handleCardClick}
        />
      </div>

      {/* Today Statistics */}
      <TodayStats stats={stats} />
    </div>
  );
};
