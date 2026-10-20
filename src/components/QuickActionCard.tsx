import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ActivityType } from '../types';

interface QuickActionCardProps {
  id: ActivityType;
  icon: string;
  title: string;
  subtitle: string;
  tag: string;
  onSelect: (activity: ActivityType) => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  id,
  icon,
  title,
  subtitle,
  tag,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className="group w-full p-4 rounded-2xl bg-[#111726] hover:bg-[#161f33] border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between text-left transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-indigo-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100 text-sm group-hover:text-white transition-colors">
              {title}
            </h3>
            <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {tag}
            </span>
          </div>
          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors mt-0.5">
            “{subtitle}”
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-sky-400 group-hover:bg-slate-800/50 transition-all">
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
};
