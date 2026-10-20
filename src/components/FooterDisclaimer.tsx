import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  return (
    <footer className="w-full max-w-md mx-auto px-6 py-8 mt-auto text-center border-t border-slate-900/80">
      <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Grounding Utility</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
        RESET is a grounding and distraction tool, not a replacement for professional help.
      </p>
    </footer>
  );
};
