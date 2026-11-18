import React from 'react';
import { Bluetooth, BluetoothConnected, BluetoothOff, PhoneCall, Radio } from 'lucide-react';
import { AppScreen, BluetoothDeviceItem, CallStatus } from '../types/app';

interface TopAppBarProps {
  activeScreen: AppScreen;
  bluetoothEnabled: boolean;
  connectedDevice: BluetoothDeviceItem | null;
  callStatus: CallStatus;
  isTransmitting: boolean;
  onNavigate: (screen: AppScreen) => void;
}

const SCREEN_TITLES: Record<AppScreen, string> = {
  home: 'Bluetooth Voice Talk',
  devices: 'Bluetooth Devices',
  call: 'Normal Call',
  walkie: 'Walkie-Talkie',
  settings: 'Settings',
};

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeScreen,
  bluetoothEnabled,
  connectedDevice,
  callStatus,
  isTransmitting,
  onNavigate,
}) => {
  const isInActiveCall = callStatus === 'connected' || callStatus === 'ringing' || callStatus === 'dialing';

  return (
    <header className="sticky top-0 z-30 w-full max-w-full overflow-hidden h-14 bg-[#0D1017]/90 backdrop-blur-md border-b border-white/[0.07] px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <div className="lg:hidden w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center shrink-0">
          <Bluetooth className="w-4 h-4 text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <h1 className="font-display text-sm sm:text-base lg:text-lg font-semibold tracking-tight text-slate-100 truncate">
              {SCREEN_TITLES[activeScreen]}
            </h1>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-amber-300/90 shrink-0">
              DEMO
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
        {isInActiveCall && activeScreen !== 'call' && (
          <button
            type="button"
            onClick={() => onNavigate('call')}
            className="min-h-[36px] px-2.5 sm:px-3 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-500/25 transition-colors whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Return to Call</span>
            <span className="sm:hidden">Call</span>
          </button>
        )}

        {isTransmitting && activeScreen !== 'walkie' && (
          <button
            type="button"
            onClick={() => onNavigate('walkie')}
            className="min-h-[36px] px-2.5 sm:px-3 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 hover:bg-amber-500/25 transition-colors whitespace-nowrap shrink-0"
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">PTT Active</span>
            <span className="sm:hidden">PTT</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate('devices')}
          className="min-h-[40px] max-w-[128px] sm:max-w-[200px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 sm:gap-2 text-xs transition-colors whitespace-nowrap shrink-0 min-w-0"
          aria-label="Manage simulated Bluetooth connection"
        >
          {!bluetoothEnabled ? (
            <>
              <BluetoothOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400 truncate">BT Off</span>
            </>
          ) : connectedDevice ? (
            <>
              <BluetoothConnected className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-slate-200 truncate">
                {connectedDevice.name}
              </span>
            </>
          ) : (
            <>
              <Bluetooth className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-300 truncate">No Device</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
