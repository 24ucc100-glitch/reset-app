import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Music2 } from 'lucide-react';
import type { AmbientTrack, AmbientTrackId } from '../../types';
import { ambientSynth } from './AmbientSynth';

const TRACKS: AmbientTrack[] = [
  { id: 'zen', name: 'Zen Harmonics', subtitle: 'Harmonic drone & bells', icon: '🧘' },
  { id: 'alpha', name: 'Alpha 10Hz', subtitle: 'Brainwave loop reset', icon: '🧠' },
  { id: 'rain', name: 'Gentle Rain', subtitle: 'Natural acoustic rainfall', icon: '🌧️' },
  { id: 'cosmic', name: 'Cosmic Pad', subtitle: 'Ethereal ambient chord', icon: '🌌' },
];

interface AmbientTunesPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbientTunesPlayer: React.FC<AmbientTunesPlayerProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => ambientSynth.isPlaying());
  const [selectedTrack, setSelectedTrack] = useState<AmbientTrackId>(
    () => ambientSynth.getCurrentTrack() || 'zen'
  );
  const [volume, setVolume] = useState<number>(() => ambientSynth.getVolume());

  const togglePlay = (trackId: AmbientTrackId = selectedTrack) => {
    if (isPlaying && selectedTrack === trackId) {
      ambientSynth.stop();
      setIsPlaying(false);
    } else {
      setSelectedTrack(trackId);
      ambientSynth.play(trackId);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientSynth.setVolume(val);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tunes-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity"
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#111726] border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-sky-400">
              <Music2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="tunes-title" className="text-base font-bold text-white flex items-center gap-2">
                Stop Overthinking Tunes
                {isPlaying && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">Offline synthesized soothing soundscapes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close ambient tunes"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-2 mb-4">
          {TRACKS.map((track) => {
            const isThisTrackActive = isPlaying && selectedTrack === track.id;
            const isThisTrackSelected = selectedTrack === track.id;

            return (
              <button
                key={track.id}
                onClick={() => togglePlay(track.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isThisTrackActive
                    ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-sky-500/50 shadow-md shadow-indigo-950/40'
                    : isThisTrackSelected
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-[#0c121e]/80 border-slate-800/60 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{track.icon}</span>
                  <div>
                    <h3 className={`text-xs font-semibold ${isThisTrackActive ? 'text-sky-300' : 'text-slate-200'}`}>
                      {track.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">{track.subtitle}</p>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isThisTrackActive
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isThisTrackActive ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume & Master Play/Stop Control */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
              <span>Volume</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">{Math.round(volume * 100)}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => togglePlay(selectedTrack)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-rose-300" />
                  <span>Pause Soundscape</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play Selected Track</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-3">
          Synthesized in real-time. Loops infinitely in the background without internet.
        </p>
      </div>
    </div>
  );
};
