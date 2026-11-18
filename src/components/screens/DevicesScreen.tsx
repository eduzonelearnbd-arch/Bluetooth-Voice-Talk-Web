import React from 'react';
import {
  Battery,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Check,
  Headphones,
  Loader2,
  Radio,
  RefreshCw,
  Smartphone,
  Speaker,
  Trash2,
  Watch,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BluetoothDeviceItem, DeviceCategory } from '../../types/app';
import { SignalBars } from '../SignalBars';

interface DevicesScreenProps {
  bluetoothEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDeviceItem[];
  onToggleBluetooth: () => void;
  onStartScan: () => void;
  onConnectDevice: (deviceId: string) => void;
  onDisconnectDevice: (deviceId: string) => void;
  onForgetDevice: (deviceId: string) => void;
}

function getDeviceIcon(category: DeviceCategory) {
  switch (category) {
    case 'earbuds':
    case 'headphones':
      return Headphones;
    case 'watch':
      return Watch;
    case 'speaker':
      return Speaker;
    case 'phone':
      return Smartphone;
    default:
      return Bluetooth;
  }
}

function rssiToStrength(rssi: number): 1 | 2 | 3 | 4 {
  if (rssi >= -52) return 4;
  if (rssi >= -64) return 3;
  if (rssi >= -74) return 2;
  return 1;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({
  bluetoothEnabled,
  isScanning,
  devices,
  onToggleBluetooth,
  onStartScan,
  onConnectDevice,
  onDisconnectDevice,
  onForgetDevice,
}) => {
  const pairedDevices = devices.filter((d) => d.paired);
  const availableDevices = devices.filter((d) => !d.paired);
  const connectedDevice = devices.find((d) => d.connectionState === 'connected') || null;

  return (
    <div className="space-y-6">
      {/* Bluetooth Adapter Control Card */}
      <section className="rounded-3xl bg-[#141925] border border-white/[0.08] p-4 sm:p-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-colors ${
                bluetoothEnabled
                  ? 'bg-blue-500/15 border-blue-400/30 text-blue-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {bluetoothEnabled ? (
                <BluetoothConnected className="w-6 h-6" />
              ) : (
                <BluetoothOff className="w-6 h-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-display text-lg font-semibold text-slate-100 truncate">
                  Bluetooth Radio
                </h2>
                <span className="text-[11px] font-mono text-amber-300 shrink-0">DEMO</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                {bluetoothEnabled
                  ? connectedDevice
                    ? `Connected to ${connectedDevice.name} (${connectedDevice.profile} · Demo)`
                    : 'Ready to scan and pair simulated nearby devices'
                  : 'Simulated adapter is turned off. Enable to discover demo devices.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {bluetoothEnabled && (
              <button
                type="button"
                onClick={onStartScan}
                disabled={isScanning}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scanning Demo...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Scan Nearby</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              role="switch"
              aria-checked={bluetoothEnabled}
              aria-label="Toggle simulated Bluetooth"
              onClick={onToggleBluetooth}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 ${
                bluetoothEnabled
                  ? 'bg-blue-600 border-blue-400/50'
                  : 'bg-slate-800 border-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-[3px] ${
                  bluetoothEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Active Scanning Banner (only visible when actively scanning) */}
        {bluetoothEnabled && isScanning && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-white/[0.07] flex items-center gap-3 text-xs text-blue-300"
          >
            <Radio className="w-4 h-4 text-blue-400 animate-pulse shrink-0" />
            <span>
              Scanning 2.4 GHz BLE & Classic audio profiles (Simulated Demo)...
            </span>
          </motion.div>
        )}
      </section>

      {!bluetoothEnabled ? (
        <div className="rounded-3xl bg-[#11151E] border border-white/[0.06] py-14 px-6 text-center">
          <BluetoothOff className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-display text-lg font-medium text-slate-200 mt-3">
            Simulated Bluetooth is Off
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
            Toggle the Bluetooth switch above to test device scanning, pairing, and audio profile switching in this prototype.
          </p>
          <button
            type="button"
            onClick={onToggleBluetooth}
            className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Turn On Demo Bluetooth
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
          {/* Paired Devices */}
          <section className="min-w-0 rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-100">
                  Paired Devices
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saved demo headsets & audio nodes
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                {pairedDevices.length} saved
              </span>
            </div>

            {pairedDevices.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No paired demo devices. Pair one from Nearby Devices.
              </div>
            ) : (
              <div className="space-y-3">
                {pairedDevices.map((device) => {
                  const Icon = getDeviceIcon(device.category);
                  const isConnected = device.connectionState === 'connected';
                  const isConnecting = device.connectionState === 'connecting';

                  return (
                    <div
                      key={device.id}
                      className={`rounded-2xl p-3.5 sm:p-4 border transition-colors min-w-0 ${
                        isConnected
                          ? 'bg-blue-500/[0.08] border-blue-400/30'
                          : 'bg-[#171C28] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                              isConnected
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-white/[0.05] text-slate-300'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-100 truncate">
                                {device.name}
                              </h4>
                              {isConnected && (
                                <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                                  Connected · DEMO
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {device.model} · {device.codec}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <SignalBars strength={rssiToStrength(device.rssi)} rssi={device.rssi} />
                        </div>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono tabular-nums">
                          <span className="flex items-center gap-1">
                            <Battery className="w-3.5 h-3.5 text-emerald-400" />
                            {device.battery}%
                          </span>
                          <span>·</span>
                          <span>{device.profile}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onForgetDevice(device.id)}
                            className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                            title={`Forget ${device.name}`}
                            aria-label={`Forget ${device.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {isConnected ? (
                            <button
                              type="button"
                              onClick={() => onDisconnectDevice(device.id)}
                              className="min-h-[40px] px-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-100 text-xs font-medium transition-colors whitespace-nowrap"
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isConnecting}
                              onClick={() => onConnectDevice(device.id)}
                              className="min-h-[40px] px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                            >
                              {isConnecting ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Connecting...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Connect (Demo)</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Available Nearby Devices */}
          <section className="min-w-0 rounded-3xl bg-[#121620] border border-white/[0.07] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-100">
                  Available Nearby Devices
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulated Bluetooth discovery list (DEMO)
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                {availableDevices.length} found
              </span>
            </div>

            {availableDevices.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                All nearby demo devices are paired. Tap Scan Nearby to refresh.
              </div>
            ) : (
              <div className="space-y-3">
                {availableDevices.map((device) => {
                  const Icon = getDeviceIcon(device.category);
                  const isConnecting = device.connectionState === 'connecting';

                  return (
                    <div
                      key={device.id}
                      className="rounded-2xl p-3.5 sm:p-4 bg-[#171C28] border border-white/[0.06] flex items-center justify-between gap-3 min-w-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/[0.05] text-slate-300 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-100 truncate">
                              {device.name}
                            </h4>
                            <span className="shrink-0">
                              <SignalBars strength={rssiToStrength(device.rssi)} rssi={device.rssi} />
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {device.model} · {device.lastSeen}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isConnecting}
                        onClick={() => onConnectDevice(device.id)}
                        className="min-h-[44px] px-3 sm:px-4 rounded-xl bg-white/[0.07] hover:bg-blue-600 text-slate-100 hover:text-white border border-white/[0.08] hover:border-blue-500 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Pairing...</span>
                          </>
                        ) : (
                          <span>Pair</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
