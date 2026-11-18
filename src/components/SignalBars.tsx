import React from 'react';

interface SignalBarsProps {
  strength: 1 | 2 | 3 | 4;
  rssi?: number;
}

export const SignalBars: React.FC<SignalBarsProps> = ({ strength, rssi }) => {
  const heights = ['h-1.5', 'h-2.5', 'h-3.5', 'h-4'];

  return (
    <div
      className="inline-flex items-end gap-0.5"
      title={rssi ? `Signal ${strength}/4 (${rssi} dBm · Demo)` : `Signal ${strength}/4 (Demo)`}
      aria-label={`Signal strength ${strength} out of 4`}
    >
      {heights.map((heightClass, index) => {
        const active = index < strength;
        return (
          <span
            key={index}
            className={`w-1 rounded-xs transition-colors ${heightClass} ${
              active
                ? strength >= 3
                  ? 'bg-emerald-400'
                  : strength === 2
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                : 'bg-slate-700/80'
            }`}
          />
        );
      })}
    </div>
  );
};
