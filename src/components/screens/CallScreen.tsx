import React from 'react';
import {
  BluetoothConnected,
  Mic,
  MicOff,
  Phone,
  PhoneIncoming,
  PhoneOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BluetoothDeviceItem, CallStatus, PeerContact } from '../../types/app';
import { AudioWaveform } from '../AudioWaveform';
import { SignalBars } from '../SignalBars';

interface CallScreenProps {
  peers: PeerContact[];
  selectedPeer: PeerContact;
  onSelectPeer: (peer: PeerContact) => void;
  connectedDevice: BluetoothDeviceItem | null;
  bluetoothEnabled: boolean;
  callStatus: CallStatus;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onSimulateIncoming: () => void;
}

function formatCallTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  peers,
  selectedPeer,
  onSelectPeer,
  connectedDevice,
  bluetoothEnabled,
  callStatus,
  callDuration,
  isMuted,
  isSpeakerOn,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
  onSimulateIncoming,
}) => {
  const isLive = callStatus === 'connected' || callStatus === 'dialing' || callStatus === 'ringing';

  const statusText =
    callStatus === 'idle'
      ? 'Ready to Call · DEMO'
      : callStatus === 'dialing'
        ? 'Dialing via Bluetooth (Demo)...'
        : callStatus === 'ringing'
          ? 'Ringing Peer (Demo)...'
          : callStatus === 'connected'
            ? isMuted
              ? 'Connected (Muted) · DEMO'
              : 'Voice Connected · DEMO'
            : 'Call Ended · DEMO';

  const waveformMode =
    callStatus === 'connected'
      ? isMuted
        ? 'muted'
        : 'connected'
      : callStatus === 'ringing' || callStatus === 'dialing'
        ? 'receiving'
        : 'idle';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
      {/* Main Android Call Canvas */}
      <section className="lg:col-span-7 xl:col-span-8 min-w-0 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#151B28] via-[#10141E] to-[#0C0F16] border border-white/[0.08] p-4 sm:p-8 flex flex-col items-center justify-between min-h-[520px] sm:min-h-[580px]">
        {/* Top Call Metadata Row */}
        <div className="w-full flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 min-w-0">
            <BluetoothConnected className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">
              {bluetoothEnabled && connectedDevice
                ? `${connectedDevice.name} · ${connectedDevice.codec}`
                : 'Handset Audio Route'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SignalBars strength={selectedPeer.signalStrength} rssi={selectedPeer.rssi} />
            <span className="font-mono text-amber-300">DEMO CALL</span>
          </div>
        </div>

        {/* Center Peer Avatar + Status + Timer + Waveform */}
        <div className="my-auto py-6 flex flex-col items-center text-center w-full max-w-sm">
          <div className="relative">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br border-2 flex items-center justify-center font-display text-3xl sm:text-4xl font-semibold shadow-2xl transition-transform duration-300 ${
                selectedPeer.accentColor
              } ${callStatus === 'connected' ? 'scale-105' : ''}`}
            >
              {selectedPeer.initials}
            </div>
            {callStatus === 'connected' && (
              <span
                className="absolute -bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-400 border-4 border-[#10141E]"
                aria-hidden="true"
              />
            )}
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 mt-5">
            {selectedPeer.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {selectedPeer.deviceLabel} · {selectedPeer.distanceLabel}
          </p>

          <div className="mt-4 space-y-1">
            <p
              className={`text-sm font-medium ${
                callStatus === 'connected'
                  ? 'text-emerald-400'
                  : callStatus === 'ended'
                    ? 'text-rose-400'
                    : callStatus === 'dialing' || callStatus === 'ringing'
                      ? 'text-blue-300'
                      : 'text-slate-400'
              }`}
            >
              {statusText}
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-100 tabular-nums tracking-tight">
              {formatCallTimer(callDuration)}
            </p>
          </div>

          <div className="w-full mt-5">
            <AudioWaveform mode={waveformMode} bars={18} />
          </div>
        </div>

        {/* Primary Android Call Control Dock (Call, Mute, Speaker, Disconnect) */}
        <div className="w-full max-w-md pt-4 border-t border-white/[0.07]">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {/* Call / Dial Button */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={onStartCall}
                disabled={isLive}
                aria-label="Start simulated demo call"
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  isLive
                    ? 'bg-emerald-500/20 text-emerald-300/50 border border-emerald-400/20 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                }`}
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="text-[11px] sm:text-xs font-medium text-slate-300 truncate max-w-full">
                {callStatus === 'ended' ? 'Redial' : 'Call'}
              </span>
            </div>

            {/* Mute Button */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={onToggleMute}
                aria-pressed={isMuted}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  isMuted
                    ? 'bg-white text-slate-950 border-white'
                    : 'bg-white/[0.07] hover:bg-white/[0.12] text-slate-100 border-white/[0.1]'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
              <span className="text-[11px] sm:text-xs font-medium text-slate-300 truncate max-w-full">
                {isMuted ? 'Muted' : 'Mute'}
              </span>
            </div>

            {/* Speaker Button */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={onToggleSpeaker}
                aria-pressed={isSpeakerOn}
                aria-label={isSpeakerOn ? 'Turn off speakerphone' : 'Turn on speakerphone'}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  isSpeakerOn
                    ? 'bg-blue-500 text-white border-blue-400'
                    : 'bg-white/[0.07] hover:bg-white/[0.12] text-slate-100 border-white/[0.1]'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
              <span className="text-[11px] sm:text-xs font-medium text-slate-300 truncate max-w-full">
                {isSpeakerOn ? 'Speaker On' : 'Speaker'}
              </span>
            </div>

            {/* Disconnect Button */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={onEndCall}
                disabled={!isLive}
                aria-label="Disconnect simulated call"
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-rose-400 ${
                  isLive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                    : 'bg-rose-500/15 text-rose-300/40 border border-rose-400/15 cursor-not-allowed'
                }`}
              >
                <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="text-[11px] sm:text-xs font-medium text-slate-300 truncate max-w-full">Disconnect</span>
            </div>
          </div>
        </div>
      </section>

      {/* Side Panel: Peer Picker & Incoming Call Demo Trigger */}
      <aside className="lg:col-span-5 xl:col-span-4 min-w-0 space-y-4">
        <div className="rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-5">
          <h3 className="font-display text-base font-semibold text-slate-100">
            Select Demo Peer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">
            Choose a simulated nearby contact to call
          </p>

          <div className="space-y-2">
            {peers.map((peer) => {
              const selected = peer.id === selectedPeer.id;
              return (
                <button
                  key={peer.id}
                  type="button"
                  disabled={isLive}
                  onClick={() => onSelectPeer(peer)}
                  className={`w-full min-h-[56px] p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors disabled:opacity-60 ${
                    selected
                      ? 'bg-blue-500/15 border-blue-400/35'
                      : 'bg-[#171C28] hover:bg-[#1C2230] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br border flex items-center justify-center font-display text-xs font-semibold shrink-0 ${peer.accentColor}`}
                    >
                      {peer.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {peer.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{peer.distanceLabel}</p>
                    </div>
                  </div>
                  <SignalBars strength={peer.signalStrength} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-[#121620] border border-white/[0.07] p-5">
          <h3 className="font-display text-base font-semibold text-slate-100">
            Test Incoming Call
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Preview the Android incoming Bluetooth voice call overlay with Answer and Decline actions.
          </p>
          <button
            type="button"
            disabled={isLive}
            onClick={onSimulateIncoming}
            className="mt-4 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.11] disabled:opacity-50 border border-white/[0.08] text-slate-100 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneIncoming className="w-4 h-4 text-emerald-400" />
            <span>Simulate Incoming Call (Demo)</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
