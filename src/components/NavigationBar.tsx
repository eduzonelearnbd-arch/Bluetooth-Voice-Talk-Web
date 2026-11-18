import React from 'react';
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Home,
  Phone,
  Radio,
  Settings,
} from 'lucide-react';
import { AppScreen, BluetoothDeviceItem, CallStatus } from '../types/app';

interface NavigationBarProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  bluetoothEnabled: boolean;
  connectedDevice: BluetoothDeviceItem | null;
  callStatus: CallStatus;
}

const NAV_ITEMS: Array<{
  id: AppScreen;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'devices', label: 'Devices', icon: Bluetooth },
  { id: 'call', label: 'Call', icon: Phone },
  { id: 'walkie', label: 'Walkie', icon: Radio },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeScreen,
  onNavigate,
  bluetoothEnabled,
  connectedDevice,
  callStatus,
}) => {
  const isCallLive = callStatus === 'connected' || callStatus === 'ringing' || callStatus === 'dialing';

  return (
    <>
      {/* Mobile Android Bottom Navigation Bar (64px height, <=15% viewport cap) */}
      <nav
        aria-label="Primary app navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 w-full max-w-full overflow-hidden h-16 bg-[#0D1017]/95 backdrop-blur-lg border-t border-white/[0.08] px-1.5 sm:px-2 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-full w-full max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center min-h-[44px] w-full min-w-0 overflow-hidden rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-11 sm:w-12 h-7 rounded-full transition-colors duration-150 ${
                    active ? 'bg-blue-500/20' : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full px-0.5">
                  {item.label}
                </span>
                {item.id === 'call' && isCallLive && (
                  <span
                    className="absolute top-1.5 right-2 sm:right-4 w-2 h-2 rounded-full bg-emerald-400"
                    title="Active demo call"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Left Navigation Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-[#0D1017] border-r border-white/[0.07] p-5 justify-between min-h-screen sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-white/[0.07]">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center shrink-0">
              <Bluetooth className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-base text-slate-100 leading-tight truncate">
                Bluetooth Voice Talk
              </div>
              <div className="text-xs text-amber-300/90 font-mono mt-0.5">
                Android UI · DEMO
              </div>
            </div>
          </div>

          <nav aria-label="Desktop app sections" className="mt-6 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 ${
                    active
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-400/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3 whitespace-nowrap">
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'call' && isCallLive && (
                    <span className="text-[11px] font-mono text-emerald-400">LIVE</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/[0.07]">
          <button
            type="button"
            onClick={() => onNavigate('devices')}
            className="w-full text-left p-3.5 rounded-2xl bg-[#141923] hover:bg-[#181E2B] border border-white/[0.07] transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-400">Simulated Link</span>
              <span className="text-[11px] font-mono text-amber-300">DEMO</span>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              {!bluetoothEnabled ? (
                <BluetoothOff className="w-4 h-4 text-slate-500 shrink-0" />
              ) : connectedDevice ? (
                <BluetoothConnected className="w-4 h-4 text-blue-400 shrink-0" />
              ) : (
                <Bluetooth className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">
                  {!bluetoothEnabled
                    ? 'Adapter Disabled'
                    : connectedDevice
                      ? connectedDevice.name
                      : 'No Audio Device'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {!bluetoothEnabled
                    ? 'Tap to enable demo BT'
                    : connectedDevice
                      ? `${connectedDevice.codec} · ${connectedDevice.battery}% battery`
                      : 'Tap to pair or connect'}
                </p>
              </div>
            </div>
          </button>

          <p className="text-[11px] leading-relaxed text-slate-500 px-1">
            Visual prototype only. Simulated Bluetooth pairing, calls, and PTT audio do not transmit over real RF hardware.
          </p>
        </div>
      </aside>
    </>
  );
};
