import React from 'react';
import {
  Bluetooth,
  Info,
  Mic,
  Radio,
  RotateCcw,
  Sliders,
  Volume2,
} from 'lucide-react';
import { AppSettings } from '../../types/app';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onResetDemo: () => void;
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onToggle,
}) => (
  <div className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-100">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 ${
        checked ? 'bg-blue-600 border-blue-400/50' : 'bg-slate-800 border-white/10'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-[3px] ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetDemo,
}) => {
  const codecs: Array<AppSettings['preferredCodec']> = ['LC3', 'Opus', 'SBC'];
  const powerModes: Array<AppSettings['txPower']> = ['Low', 'Balanced', 'High'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
      {/* Left Column: Audio & Walkie Preferences */}
      <div className="lg:col-span-7 min-w-0 space-y-6">
        <section className="rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-6 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-semibold text-slate-100">
                Audio & Voice Codec
              </h2>
              <p className="text-xs text-slate-400">Simulated Android HFP & LE Audio profile</p>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-white/[0.06]">
            <p className="text-xs font-medium text-slate-300 mb-2.5">
              Preferred Bluetooth Codec (Demo)
            </p>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#0C0F16] border border-white/[0.06]">
              {codecs.map((codec) => {
                const active = settings.preferredCodec === codec;
                return (
                  <button
                    key={codec}
                    type="button"
                    onClick={() => onUpdateSettings({ preferredCodec: codec })}
                    className={`min-h-[40px] rounded-lg text-xs font-mono font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {codec}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            <ToggleRow
              label="Adaptive Noise Suppression"
              description="Filter simulated wind and ambient street noise on voice calls"
              checked={settings.noiseSuppression}
              onToggle={() =>
                onUpdateSettings({ noiseSuppression: !settings.noiseSuppression })
              }
            />
            <ToggleRow
              label="Acoustic Echo Cancellation"
              description="Prevent feedback loop when speakerphone is active"
              checked={settings.echoCancellation}
              onToggle={() =>
                onUpdateSettings({ echoCancellation: !settings.echoCancellation })
              }
            />
            <ToggleRow
              label="Interactive UI Chimes"
              description="Play gentle Web Audio confirmation tones for demo calls and PTT"
              checked={settings.uiSoundEffects}
              onToggle={() =>
                onUpdateSettings({ uiSoundEffects: !settings.uiSoundEffects })
              }
            />
          </div>
        </section>

        <section className="rounded-3xl bg-[#121620] border border-white/[0.07] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-semibold text-slate-100">
                Walkie-Talkie Controls
              </h2>
              <p className="text-xs text-slate-400">Push-to-Talk behavior & microphone input</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            <ToggleRow
              label="Roger Beep Tone"
              description="Emit an end-of-transmission cue when releasing the PTT button"
              checked={settings.rogerBeepTone}
              onToggle={() =>
                onUpdateSettings({ rogerBeepTone: !settings.rogerBeepTone })
              }
            />
            <ToggleRow
              label="Default PTT Latch Mode"
              description="Tap once to start talking and tap again to end instead of holding"
              checked={settings.pttLatchMode}
              onToggle={() =>
                onUpdateSettings({ pttLatchMode: !settings.pttLatchMode })
              }
            />
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-200 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-slate-400" />
                Microphone Sensitivity (Demo)
              </span>
              <span className="font-mono text-blue-300 tabular-nums">
                {settings.micGain}%
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={settings.micGain}
              aria-label="Microphone sensitivity"
              onChange={(e) => onUpdateSettings({ micGain: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </section>
      </div>

      {/* Right Column: Bluetooth Discovery & Prototype Info */}
      <div className="lg:col-span-5 min-w-0 space-y-6">
        <section className="rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-6 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-semibold text-slate-100">
                Bluetooth Discovery
              </h2>
              <p className="text-xs text-slate-400">Simulated radio visibility & range</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            <ToggleRow
              label="Discoverable by Nearby Peers"
              description="Allow simulated nearby Android users to view your device status"
              checked={settings.discoverableMode}
              onToggle={() =>
                onUpdateSettings({ discoverableMode: !settings.discoverableMode })
              }
            />
            <ToggleRow
              label="Auto-Connect Last Headset"
              description="Automatically link your preferred demo headset on launch"
              checked={settings.autoReconnect}
              onToggle={() =>
                onUpdateSettings({ autoReconnect: !settings.autoReconnect })
              }
            />
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-2.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Transmit Power Profile (Demo)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#0C0F16] border border-white/[0.06]">
              {powerModes.map((mode) => {
                const active = settings.txPower === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onUpdateSettings({ txPower: mode })}
                    className={`min-h-[40px] rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-[#131823] border border-amber-400/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Info className="w-4 h-4 shrink-0" />
            <h2 className="font-display text-base font-semibold">
              About This Prototype (DEMO)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
            Bluetooth Voice Talk is a web-based interactive visual prototype demonstrating the planned UI and UX of a future Android application.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            All Bluetooth device scans, pairings, RSSI telemetry, voice calls, and Walkie-Talkie transmissions shown here are simulated demo interactions. Real Bluetooth RF voice calling is not active in this browser prototype.
          </p>

          <button
            type="button"
            onClick={onResetDemo}
            className="mt-5 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.1] text-slate-100 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>
        </section>
      </div>
    </div>
  );
};
