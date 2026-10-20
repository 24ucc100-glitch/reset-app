import React from 'react';
import { Clock, CheckCircle2, Zap, Bookmark } from 'lucide-react';
import type { UserStats } from '../../types';

interface TodayStatsProps {
  stats: UserStats;
}

export const TodayStats: React.FC<TodayStatsProps> = ({ stats }) => {
  return (
    <section className="w-full mt-6 pt-5 border-t border-slate-800/60">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Today
        </h2>
        <span className="text-[11px] text-slate-400">
          Non-judgmental tracking
        </span>
      </div>

      {/* Primary 2-column metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#111726] border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-medium text-slate-400">Resets completed</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-white">
              {stats.resetsToday}
            </span>
            <span className="text-[11px] text-slate-400">
              ({stats.totalResets} all-time)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#111726] border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-slate-400">Minutes redirected</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-white">
              {stats.minutesRedirected}
            </span>
            <span className="text-[11px] text-slate-400">min</span>
          </div>
        </div>
      </div>

      {/* Secondary gentle indicators */}
      {(stats.bestReactionTime !== null || stats.lastThought) && (
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {stats.bestReactionTime !== null && (
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Best reflex:</span>
              </span>
              <span className="font-semibold text-slate-200">
                {stats.bestReactionTime} ms
              </span>
            </div>
          )}

          {stats.lastThought && (
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                <Bookmark className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Parked thought:</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                Stored
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
