import React, { useEffect } from 'react';
import {
  BluetoothConnected,
  Lock,
  LockOpen,
  Mic,
  Radio,
  Users,
  Volume2,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  BluetoothDeviceItem,
  PeerContact,
  WalkieChannel,
  WalkieTransmissionLog,
} from '../../types/app';
import { AudioWaveform } from '../AudioWaveform';

interface WalkieTalkieScreenProps {
  channels: WalkieChannel[];
  activeChannel: WalkieChannel;
  onSelectChannel: (channel: WalkieChannel) => void;
  activePeer: PeerContact;
  connectedDevice: BluetoothDeviceItem | null;
  bluetoothEnabled: boolean;
  isTransmitting: boolean;
  isReceivingReply: boolean;
  transmitSeconds: number;
  latchMode: boolean;
  onToggleLatchMode: () => void;
  onStartTransmit: () => void;
  onStopTransmit: () => void;
  transmissionLogs: WalkieTransmissionLog[];
}

export const WalkieTalkieScreen: React.FC<WalkieTalkieScreenProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  activePeer,
  connectedDevice,
  bluetoothEnabled,
  isTransmitting,
  isReceivingReply,
  transmitSeconds,
  latchMode,
  onToggleLatchMode,
  onStartTransmit,
  onStopTransmit,
  transmissionLogs,
}) => {
  // Spacebar push-to-talk support on desktop (when not latched)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON')) {
          return;
        }
        e.preventDefault();
        if (latchMode) {
          if (isTransmitting) onStopTransmit();
          else onStartTransmit();
        } else {
          onStartTransmit();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !latchMode) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON')) {
          return;
        }
        e.preventDefault();
        onStopTransmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [latchMode, isTransmitting, onStartTransmit, onStopTransmit]);

  const handlePttPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (latchMode) {
      if (isTransmitting) onStopTransmit();
      else onStartTransmit();
    } else {
      onStartTransmit();
    }
  };

  const handlePttPointerUp = () => {
    if (!latchMode && isTransmitting) {
      onStopTransmit();
    }
  };

  const waveformMode = isTransmitting
    ? 'transmitting'
    : isReceivingReply
      ? 'receiving'
      : 'idle';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
      {/* Main Push-to-Talk Console */}
      <section className="lg:col-span-7 xl:col-span-8 min-w-0 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#161B26] via-[#10141D] to-[#0B0E14] border border-white/[0.08] p-4 sm:p-8 flex flex-col items-center justify-between min-h-[540px] sm:min-h-[600px]">
        {/* Channel & Hardware Status Header */}
        <div className="w-full flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 min-w-0">
            <BluetoothConnected className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">
              {bluetoothEnabled && connectedDevice
                ? `${connectedDevice.name} · ${connectedDevice.codec}`
                : 'Handset Mic / Speaker'}
            </span>
          </div>
          <span className="font-mono text-amber-300 shrink-0">WALKIE DEMO</span>
        </div>

        {/* Active Channel Readout & Waveform */}
        <div className="w-full max-w-md text-center mt-4">
          <p className="font-mono text-xs text-slate-400 tracking-wide">
            {activeChannel.frequencyLabel} · {activeChannel.memberCount} peers
          </p>
          <h2 className="font-display text-2xl font-semibold text-slate-100 mt-1">
            {activeChannel.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Active Peer: <span className="text-slate-200 font-medium">{activePeer.name}</span> · {activePeer.distanceLabel}
          </p>

          <div className="mt-5">
            <AudioWaveform mode={waveformMode} bars={20} />
          </div>

          <div className="mt-3 h-6 flex items-center justify-center">
            {isTransmitting ? (
              <span className="text-sm font-medium text-amber-300 font-mono tabular-nums">
                Transmitting Audio (DEMO) · {transmitSeconds.toFixed(1)}s
              </span>
            ) : isReceivingReply ? (
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                <span>Receiving from {activePeer.name} (DEMO)...</span>
              </span>
            ) : (
              <span className="text-sm text-slate-400">
                {latchMode
                  ? 'Tap Push-to-Talk to lock open mic (Demo)'
                  : 'Press & hold Push-to-Talk to speak (Demo)'}
              </span>
            )}
          </div>
        </div>

        {/* Large Ergonomic Push-to-Talk (PTT) Button */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Concentric Expanding Transmission Rings */}
          {(isTransmitting || isReceivingReply) && (
            <>
              <motion.span
                aria-hidden="true"
                className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border-2 pointer-events-none ${
                  isTransmitting ? 'border-amber-400/50' : 'border-emerald-400/45'
                }`}
                initial={{ scale: 0.88, opacity: 0.7 }}
                animate={{ scale: 1.24, opacity: 0 }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                aria-hidden="true"
                className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border pointer-events-none ${
                  isTransmitting ? 'border-amber-400/35' : 'border-emerald-400/35'
                }`}
                initial={{ scale: 0.88, opacity: 0.5 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut', delay: 0.45 }}
              />
            </>
          )}

          <button
            type="button"
            onPointerDown={handlePttPointerDown}
            onPointerUp={handlePttPointerUp}
            onPointerLeave={handlePttPointerUp}
            onPointerCancel={handlePttPointerUp}
            aria-pressed={isTransmitting}
            aria-label="Push to Talk simulated microphone button"
            className={`relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full select-none touch-none flex flex-col items-center justify-center gap-2 border-4 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              isTransmitting
                ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200/70 text-slate-950 scale-[0.96] shadow-[0_0_50px_rgba(245,158,11,0.35)]'
                : isReceivingReply
                  ? 'bg-gradient-to-b from-emerald-500/25 to-emerald-700/25 border-emerald-400/50 text-emerald-200'
                  : 'bg-gradient-to-b from-[#202737] to-[#151A25] hover:from-[#262E41] hover:to-[#181E2B] border-white/15 text-slate-100 shadow-2xl active:scale-[0.96]'
            }`}
          >
            {isTransmitting ? (
              <Mic className="w-11 h-11" />
            ) : (
              <Radio className="w-11 h-11 text-amber-400" />
            )}
            <span className="font-display text-base font-bold tracking-wide uppercase">
              {isTransmitting ? 'Talking' : 'Push to Talk'}
            </span>
            <span
              className={`text-[11px] font-mono ${
                isTransmitting ? 'text-slate-900 font-semibold' : 'text-slate-400'
              }`}
            >
              {latchMode ? 'Tap Toggle' : 'Hold · Space'}
            </span>
          </button>
        </div>

        {/* Bottom Latch Control */}
        <div className="w-full max-w-md pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Hands-Free Latch Mode
          </div>
          <button
            type="button"
            onClick={onToggleLatchMode}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors ${
              latchMode
                ? 'bg-amber-500/15 border-amber-400/35 text-amber-300'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-300'
            }`}
          >
            {latchMode ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
            <span>{latchMode ? 'Latch Enabled' : 'Hold Mode'}</span>
          </button>
        </div>
      </section>

      {/* Side Panel: Channel Selector + Live PTT Feed */}
      <aside className="lg:col-span-5 xl:col-span-4 min-w-0 space-y-4">
        <div className="rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-display text-base font-semibold text-slate-100">
              Demo Channels
            </h3>
            <Users className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-2">
            {channels.map((ch) => {
              const selected = ch.id === activeChannel.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onSelectChannel(ch)}
                  className={`w-full min-h-[58px] p-3.5 rounded-2xl border text-left transition-colors ${
                    selected
                      ? 'bg-amber-500/12 border-amber-400/35'
                      : 'bg-[#171C28] hover:bg-[#1C2230] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-100 truncate">
                      {ch.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {ch.memberCount} peers
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {ch.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-[#121620] border border-white/[0.07] p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-display text-base font-semibold text-slate-100">
              Transmission Log
            </h3>
            <span className="text-[11px] font-mono text-amber-300">DEMO</span>
          </div>

          {transmissionLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Hold Push-to-Talk to simulate a voice burst and hear a demo peer reply.
            </p>
          ) : (
            <div className="divide-y divide-white/[0.06] max-h-64 overflow-y-auto pr-1">
              {transmissionLogs.map((log) => (
                <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {log.direction === 'outgoing' ? 'You transmitted' : `${log.sender} replied`}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {log.channelName} · {log.timestamp}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono shrink-0 tabular-nums ${
                      log.direction === 'outgoing' ? 'text-amber-300' : 'text-emerald-400'
                    }`}
                  >
                    {log.durationLabel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
