import React from 'react';
import { motion } from 'motion/react';

interface AudioWaveformProps {
  mode: 'idle' | 'transmitting' | 'receiving' | 'connected' | 'muted';
  bars?: number;
  className?: string;
}

const BAR_WEIGHTS = [0.42, 0.72, 0.95, 0.58, 1, 0.84, 0.48, 0.91, 0.66, 0.78, 0.52, 0.88, 0.61, 0.94, 0.45, 0.74];

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  mode,
  bars = 16,
  className = '',
}) => {
  const isAnimating = mode === 'transmitting' || mode === 'receiving' || mode === 'connected';

  const barColorClass =
    mode === 'transmitting'
      ? 'bg-amber-400'
      : mode === 'receiving'
        ? 'bg-emerald-400'
        : mode === 'connected'
          ? 'bg-blue-400'
          : mode === 'muted'
            ? 'bg-slate-600'
            : 'bg-slate-700';

  return (
    <div
      className={`flex items-center justify-center gap-1 h-12 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, idx) => {
        const weight = BAR_WEIGHTS[idx % BAR_WEIGHTS.length];
        const minScale = mode === 'muted' ? 0.14 : isAnimating ? 0.22 : 0.18;
        const maxScale =
          mode === 'transmitting'
            ? Math.min(1, weight + 0.1)
            : mode === 'receiving'
              ? weight * 0.9
              : mode === 'connected'
                ? weight * 0.75
                : 0.22;

        return (
          <motion.span
            key={idx}
            className={`w-1 rounded-full h-10 origin-center transition-colors duration-200 ${barColorClass}`}
            animate={
              isAnimating
                ? {
                    scaleY: [minScale, maxScale, minScale * 1.35, maxScale * 0.75, minScale],
                    opacity: [0.65, 1, 0.8, 0.95, 0.65],
                  }
                : {
                    scaleY: mode === 'muted' ? 0.12 : 0.2,
                    opacity: mode === 'muted' ? 0.35 : 0.5,
                  }
            }
            transition={
              isAnimating
                ? {
                    duration: mode === 'transmitting' ? 0.65 + (idx % 4) * 0.11 : 0.9 + (idx % 5) * 0.12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: idx * 0.04,
                  }
                : { duration: 0.2 }
            }
          />
        );
      })}
    </div>
  );
};
