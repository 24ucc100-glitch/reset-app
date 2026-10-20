import React, { useState } from 'react';
import { X, Moon, Sun, Volume2, VolumeX, Sparkles, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import type { AppSettings, UserStats } from '../types';
import { gentleAudio } from '../utils/GentleAudio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  stats: UserStats;
  onClose: () => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onClearThought: () => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  stats,
  onClose,
  onUpdateSettings,
  onClearThought,
  onResetStats,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [thoughtClearedNotice, setThoughtClearedNotice] = useState(false);

  if (!isOpen) return null;

  const handleClearThought = () => {
    onClearThought();
    setThoughtClearedNotice(true);
    setTimeout(() => setThoughtClearedNotice(false), 2500);
  };

  const handleResetAllStats = () => {
    onResetStats();
    setShowConfirmReset(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity"
    >
      <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#111726] border border-slate-800 p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2">
            <h2 id="settings-title" className="text-lg font-bold text-white">
              Preferences
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              Offline
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-4 text-sm">
          {/* Theme switcher */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <p className="font-medium text-slate-200">Appearance</p>
                <p className="text-xs text-slate-400">Calm Dark vs. Soft Light</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700/80 active:scale-95 transition-all"
            >
              {settings.theme === 'dark' ? 'Dark navy' : 'Light'}
            </button>
          </div>

          {/* Reduce animations */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">Reduce Motion</p>
                <p className="text-xs text-slate-400">Minimal animations</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reduceMotion: !settings.reduceMotion })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                settings.reduceMotion ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle reduced motion"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.reduceMotion ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <p className="font-medium text-slate-200">Gentle Audio Chimes</p>
                <p className="text-xs text-slate-400">Synthesized offline tones</p>
              </div>
            </div>
            <button
              onClick={() => {
                const newVal = !settings.soundEnabled;
                gentleAudio.setEnabled(newVal);
                if (newVal) gentleAudio.playTapSound();
                onUpdateSettings({ soundEnabled: newVal });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle sound effects"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.soundEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Clear saved thought */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-200">Parked Thought</p>
                  <p className="text-xs text-slate-400">
                    {stats.lastThought ? '1 thought parked locally' : 'No thought parked'}
                  </p>
                </div>
              </div>
              <button
                disabled={!stats.lastThought}
                onClick={handleClearThought}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  stats.lastThought
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 active:scale-95 cursor-pointer'
                    : 'bg-slate-800 border-slate-700/40 text-slate-600 cursor-not-allowed'
                }`}
              >
                Clear
              </button>
            </div>
            {thoughtClearedNotice && (
              <p className="text-xs text-emerald-400 font-medium pl-12 animate-fade-in">
                Parked thought deleted.
              </p>
            )}
          </div>

          {/* Reset statistics */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            {!showConfirmReset ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Reset Statistics</p>
                    <p className="text-xs text-slate-400">Wipe reset counters & history</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700/80 active:scale-95 transition-all"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset all local stats?</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  This will zero out your resets today ({stats.resetsToday}) and total minutes ({stats.minutesRedirected}m).
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetAllStats}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold active:scale-95 transition-all"
                  >
                    Confirm Wipe
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Philosophy reminder */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            RESET does not track personal data, uses zero external tracking scripts, and never syncs to a server.
          </p>
        </div>
      </div>
    </div>
  );
};
