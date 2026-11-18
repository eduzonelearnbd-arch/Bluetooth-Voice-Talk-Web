export type AppScreen = 'home' | 'devices' | 'call' | 'walkie' | 'settings';

export type DeviceCategory = 'earbuds' | 'headphones' | 'phone' | 'speaker' | 'watch';

export type DeviceConnectionState = 'disconnected' | 'connecting' | 'connected';

export interface BluetoothDeviceItem {
  id: string;
  name: string;
  model: string;
  category: DeviceCategory;
  paired: boolean;
  connectionState: DeviceConnectionState;
  battery: number;
  rssi: number;
  profile: string;
  codec: 'LC3' | 'Opus' | 'SBC';
  lastSeen: string;
}

export interface PeerContact {
  id: string;
  name: string;
  initials: string;
  deviceLabel: string;
  distanceLabel: string;
  signalStrength: 1 | 2 | 3 | 4;
  rssi: number;
  availability: 'Nearby' | 'Standby' | 'In Range';
  accentColor: string;
}

export type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected' | 'ended';

export interface CallLogEntry {
  id: string;
  peerId: string;
  peerName: string;
  mode: 'Normal Call' | 'Walkie-Talkie';
  durationSeconds: number;
  timestamp: string;
  statusLabel: string;
}

export interface WalkieChannel {
  id: string;
  name: string;
  frequencyLabel: string;
  memberCount: number;
  description: string;
}

export interface WalkieTransmissionLog {
  id: string;
  sender: 'You' | string;
  channelName: string;
  durationLabel: string;
  timestamp: string;
  direction: 'outgoing' | 'incoming';
}

export interface AppSettings {
  preferredCodec: 'LC3' | 'Opus' | 'SBC';
  noiseSuppression: boolean;
  echoCancellation: boolean;
  uiSoundEffects: boolean;
  rogerBeepTone: boolean;
  pttLatchMode: boolean;
  micGain: number;
  discoverableMode: boolean;
  autoReconnect: boolean;
  txPower: 'Low' | 'Balanced' | 'High';
}
