import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, Undo2, Download, RefreshCw, Palette, CheckCircle2 } from 'lucide-react';
import { SKETCH_PROMPTS } from './sketchPrompts';
import { gentleAudio } from '../../utils/GentleAudio';
import { CompletionModal } from '../../components/CompletionModal';

interface QuickSketchProps {
  onComplete: (minutes: number) => void;
  onReturnHome: () => void;
  onAnotherReset: () => void;
}

const PALETTE = [
  // Row 1: Cool & Neutral Tones
  { name: 'White', hex: '#ffffff' },
  { name: 'Silver Slate', hex: '#cbd5e1' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Cyan Teal', hex: '#06b6d4' },
  { name: 'Electric Blue', hex: '#3b82f6' },
  { name: 'Lavender', hex: '#c084fc' },
  { name: 'Deep Indigo', hex: '#818cf8' },
  { name: 'Violet', hex: '#a855f7' },
  { name: 'Eraser', hex: '#0f172a' },

  // Row 2: Warm, Vibrant & Botanical Tones
  { name: 'Mint Green', hex: '#34d399' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Lime Green', hex: '#a3e635' },
  { name: 'Sun Yellow', hex: '#facc15' },
  { name: 'Warm Amber', hex: '#f59e0b' },
  { name: 'Tangerine', hex: '#fb923c' },
  { name: 'Crimson Red', hex: '#ef4444' },
  { name: 'Soft Rose', hex: '#f43f5e' },
  { name: 'Hot Pink', hex: '#ec4899' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 3 },
  { label: 'Medium', size: 6 },
  { label: 'Bold', size: 14 },
];

export const QuickSketch: React.FC<QuickSketchProps> = ({
  onComplete,
  onReturnHome,
  onAnotherReset,
}) => {
  const [promptIndex, setPromptIndex] = useState(() =>
    Math.floor(Math.random() * SKETCH_PROMPTS.length)
  );
  const currentPrompt = SKETCH_PROMPTS[promptIndex];

  const [secondsLeft, setSecondsLeft] = useState(currentPrompt.durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [color, setColor] = useState(PALETTE[1].hex); // Default Sky Blue
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size); // Medium
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize canvas background
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a'; // Deep slate navy canvas background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const handleFinish = useCallback(() => {
    if (!hasCompleted) {
      setHasCompleted(true);
      setIsTimerRunning(false);
      onComplete(1); // 1 minute redirected
      gentleAudio.playSuccessChime();
      gentleAudio.triggerHaptic('success');
      setShowCompletion(true);
    }
  }, [hasCompleted, onComplete]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, handleFinish]);

  // Coordinate helper
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    isDrawingRef.current = true;
    lastPointRef.current = coords;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw single dot if just tapped
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    // Save state for undo
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (historyRef.current.length > 20) {
          historyRef.current.shift();
        }
      }
    }
  };

  const handleUndo = () => {
    if (historyRef.current.length <= 1) return;
    historyRef.current.pop(); // Remove current
    const previous = historyRef.current[historyRef.current.length - 1];
    const canvas = canvasRef.current;
    if (canvas && previous) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(previous, 0, 0);
      }
    }
    gentleAudio.playTapSound();
  };

  const handleClear = () => {
    initCanvas();
    gentleAudio.playTapSound();
  };

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % SKETCH_PROMPTS.length);
    setSecondsLeft(SKETCH_PROMPTS[(promptIndex + 1) % SKETCH_PROMPTS.length].durationSeconds);
    setIsTimerRunning(true);
    setHasCompleted(false);
    initCanvas();
    gentleAudio.playTapSound();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `reset-sketch-${currentPrompt.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    gentleAudio.playTapSound();
  };

  const progressPercent = (secondsLeft / currentPrompt.durationSeconds) * 100;

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[540px] py-2">
      {/* Prompt Card & Timer */}
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Palette className="w-3.5 h-3.5 text-sky-400" />
            <span>Limited-Time Sketch</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-300">
              {secondsLeft}s left
            </span>
          </div>
        </div>

        {/* Prompt Header */}
        <div className="p-3.5 rounded-2xl bg-[#111726] border border-indigo-500/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentPrompt.icon}</span>
            <div className="text-left">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Draw: {currentPrompt.title}
              </h2>
              <p className="text-[11px] text-slate-400">{currentPrompt.hint}</p>
            </div>
          </div>

          <button
            onClick={handleNextPrompt}
            aria-label="New drawing prompt"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next prompt"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden my-2">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive HTML5 Canvas Container */}
      <div className="w-full max-w-sm my-2 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative bg-[#0f172a] touch-none">
        <canvas
          ref={canvasRef}
          width={340}
          height={260}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDrawing();
          }}
          className="w-full h-[260px] block cursor-crosshair select-none"
        />

        {/* Quick Canvas Overlay Actions */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow">
          <button
            onClick={handleUndo}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 cursor-pointer"
            title="Undo stroke"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 active:scale-95 cursor-pointer"
            title="Clear canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-300 hover:text-sky-400 hover:bg-slate-800 active:scale-95 cursor-pointer"
            title="Save sketch"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Color Palette & Brush Sizing */}
      <div className="w-full max-w-sm space-y-2 px-1">
        <div className="p-2.5 rounded-2xl bg-[#111726] border border-slate-800 space-y-2">
          {/* Top Bar: Label & Brush Sizes */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Colors ({PALETTE.length - 1} + Custom)
            </span>

            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 mr-1 font-medium">Brush:</span>
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.size}
                  onClick={() => {
                    setBrushSize(b.size);
                    gentleAudio.playTapSound();
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                    brushSize === b.size
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color swatches in a responsive 2-row grid */}
          <div className="grid grid-cols-10 gap-1.5 pt-1">
            {PALETTE.map((item) => {
              const isSelected = color === item.hex;
              const isEraser = item.name === 'Eraser';

              return (
                <button
                  key={item.hex}
                  onClick={() => {
                    setColor(item.hex);
                    gentleAudio.playTapSound();
                  }}
                  title={item.name}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'ring-2 ring-sky-400 scale-110 shadow-md shadow-sky-500/25 z-10'
                      : 'opacity-85 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {isEraser && <span className="text-[11px]">🧹</span>}
                </button>
              );
            })}

            {/* Custom Color Input Wheel */}
            <label
              title="Custom RGB Color Picker"
              className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center relative bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-400 border border-white/40 ${
                !PALETTE.some((p) => p.hex === color)
                  ? 'ring-2 ring-sky-400 scale-110 shadow-md shadow-sky-500/25 z-10'
                  : 'opacity-90 hover:opacity-100 hover:scale-105'
              }`}
            >
              <span className="text-[10px] font-black text-slate-900 select-none">🎨</span>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  gentleAudio.playTapSound();
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Done / Finish early button */}
        <button
          onClick={handleFinish}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I'm Finished Drawing</span>
        </button>
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        title="Look at what you created! 🎨"
        subtitle="Your hands and senses brought you right into the room."
        statHighlight="Tactile creative grounding completed"
        onReturn={onReturnHome}
        onAnotherReset={onAnotherReset}
      />
    </div>
  );
};
