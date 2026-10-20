import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import type { ScreenType } from '../types';

interface NavigationHeaderProps {
  currentScreen: ScreenType;
  onNavigateHome: () => void;
  onOpenSettings: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentScreen,
  onNavigateHome,
  onOpenSettings,
}) => {
  const isHome = currentScreen === 'home';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/60 bg-[#080b11]/80 backdrop-blur-md px-4 py-3 sm:px-6 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Back button or serene status */}
        <div className="w-10 flex items-center justify-start">
          {!isHome ? (
            <button
              onClick={onNavigateHome}
              aria-label="Back to home"
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5" title="Calm mode active">
              <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
              <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">calm</span>
            </div>
          )}
        </div>

        {/* Center: Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center p-[2px] shadow-sm shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-[#080b11] rounded-[6px] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
            </div>
          </div>
          <span className="font-bold tracking-widest text-sm text-slate-100 group-hover:text-white transition-colors">
            RESET
          </span>
        </button>

        {/* Right: Settings */}
        <div className="w-10 flex items-center justify-end">
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
