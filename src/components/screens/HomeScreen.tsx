import React from 'react';
import {
  ArrowUpRight,
  BatteryCharging,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Clock,
  Headphones,
  Phone,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import {
  AppScreen,
  BluetoothDeviceItem,
  CallLogEntry,
  PeerContact,
} from '../../types/app';
import { SignalBars } from '../SignalBars';

interface HomeScreenProps {
  bluetoothEnabled: boolean;
  connectedDevice: BluetoothDeviceItem | null;
  peers: PeerContact[];
  callHistory: CallLogEntry[];
  preferredCodec: string;
  onNavigate: (screen: AppScreen) => void;
  onStartDemoCall: (peer: PeerContact) => void;
  onOpenWalkieWithPeer: (peer: PeerContact) => void;
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  bluetoothEnabled,
  connectedDevice,
  peers,
  callHistory,
  preferredCodec,
  onNavigate,
  onStartDemoCall,
  onOpenWalkieWithPeer,
}) => {
  return (
    <div className="space-y-6">
      {/* Prototype Clarity Notice */}
      <div className="rounded-2xl bg-[#131823] border border-amber-400/20 px-4 py-3 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <span className="font-semibold text-amber-300">Visual Prototype (DEMO):</span>{' '}
          All Bluetooth connections, nearby peers, normal calls, and Push-to-Talk sessions are simulated locally to preview the future Android app experience.
        </p>
      </div>

      {/* Top Grid: Active Device Hero + Quick Mode Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full min-w-0">
        {/* Active Simulated Device Card */}
        <section className="lg:col-span-7 min-w-0 rounded-3xl bg-gradient-to-br from-[#161C29] via-[#121722] to-[#0E121B] border border-white/[0.08] p-4 sm:p-6 flex flex-col justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
                <span className="truncate">Active Audio Route</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-amber-300 shrink-0">DEMO</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('devices')}
                className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Manage Devices</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  !bluetoothEnabled
                    ? 'bg-slate-800/70 border-slate-700 text-slate-500'
                    : connectedDevice
                      ? 'bg-blue-500/15 border-blue-400/30 text-blue-400'
                      : 'bg-amber-500/10 border-amber-400/25 text-amber-300'
                }`}
              >
                {!bluetoothEnabled ? (
                  <BluetoothOff className="w-6 h-6" />
                ) : connectedDevice ? (
                  <BluetoothConnected className="w-6 h-6" />
                ) : (
                  <Bluetooth className="w-6 h-6" />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-100 truncate">
                  {!bluetoothEnabled
                    ? 'Bluetooth Disabled'
                    : connectedDevice
                      ? connectedDevice.name
                      : 'No Device Connected'}
                </h2>
                <p className="text-sm text-slate-400 mt-0.5 truncate">
                  {!bluetoothEnabled
                    ? 'Enable simulated Bluetooth in Devices to route audio'
                    : connectedDevice
                      ? `${connectedDevice.model} · Connected (Demo)`
                      : 'Select a nearby Bluetooth audio device to begin'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.07] grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Codec</span>
              <span className="font-mono text-slate-200 font-medium mt-0.5 block">
                {connectedDevice ? connectedDevice.codec : preferredCodec}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Battery</span>
              <span className="font-mono text-slate-200 font-medium mt-0.5 flex items-center gap-1 tabular-nums">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {connectedDevice ? `${connectedDevice.battery}%` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Profile</span>
              <span className="font-mono text-slate-200 font-medium mt-0.5 block truncate">
                {connectedDevice ? connectedDevice.profile : 'Standby'}
              </span>
            </div>
          </div>
        </section>

        {/* Quick Mode Launchers */}
        <section className="lg:col-span-5 min-w-0 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('call')}
            className="group min-w-0 text-left rounded-3xl bg-[#141925] hover:bg-[#192030] border border-white/[0.08] hover:border-blue-400/35 p-4 sm:p-5 transition-all active:scale-[0.99] flex flex-col justify-between min-h-[132px]"
          >
            <div className="flex items-center justify-between w-full gap-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/25 transition-colors shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">DEMO</span>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-100 truncate">
                Normal Call
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                Full-duplex voice with mute & speaker
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('walkie')}
            className="group min-w-0 text-left rounded-3xl bg-[#141925] hover:bg-[#192030] border border-white/[0.08] hover:border-amber-400/35 p-4 sm:p-5 transition-all active:scale-[0.99] flex flex-col justify-between min-h-[132px]"
          >
            <div className="flex items-center justify-between w-full gap-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/15 border border-amber-400/25 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 transition-colors shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">DEMO</span>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-100 truncate">
                Walkie-Talkie
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                Instant Push-to-Talk nearby channels
              </p>
            </div>
          </button>
        </section>
      </div>

      {/* Bottom Grid: Nearby Peers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Nearby Peers (Demo) */}
        <section className="lg:col-span-7 min-w-0 rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-100">
                Nearby Peers
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated Bluetooth contacts ready for demo voice sessions
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 shrink-0 tabular-nums">
              {peers.length} in range · DEMO
            </span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-display font-semibold text-sm shrink-0 ${peer.accentColor}`}
                  >
                    {peer.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold text-slate-100 truncate">
                        {peer.name}
                      </span>
                      <span className="shrink-0">
                        <SignalBars strength={peer.signalStrength} rssi={peer.rssi} />
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {peer.deviceLabel} · {peer.distanceLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenWalkieWithPeer(peer)}
                    className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-400/30 text-slate-300 hover:text-amber-300 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
                    title={`Walkie-Talkie with ${peer.name} (Demo)`}
                    aria-label={`Open Walkie-Talkie with ${peer.name}`}
                  >
                    <Radio className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Walkie</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartDemoCall(peer)}
                    className="min-h-[44px] min-w-[44px] px-3 sm:px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
                    title={`Start Demo Call with ${peer.name}`}
                    aria-label={`Call ${peer.name} (Demo)`}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Demo Activity */}
        <section className="lg:col-span-5 min-w-0 rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-100">
                Recent Demo Activity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated session history
              </p>
            </div>
            <Headphones className="w-4 h-4 text-slate-500" />
          </div>

          {callHistory.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No simulated calls recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {callHistory.slice(0, 6).map((entry) => (
                <div
                  key={entry.id}
                  className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        entry.mode === 'Walkie-Talkie'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      {entry.mode === 'Walkie-Talkie' ? (
                        <Radio className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {entry.peerName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {entry.mode} · {entry.statusLabel}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono text-slate-300 tabular-nums">
                      {formatDuration(entry.durationSeconds)}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
