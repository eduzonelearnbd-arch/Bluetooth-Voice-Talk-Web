import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  DEFAULT_SETTINGS,
  DISCOVERABLE_EXTRA_DEVICES,
  INITIAL_CALL_HISTORY,
  INITIAL_DEVICES,
  INITIAL_PEERS,
  WALKIE_CHANNELS,
} from './data/mockDemoData';
import {
  AppScreen,
  AppSettings,
  BluetoothDeviceItem,
  CallLogEntry,
  CallStatus,
  PeerContact,
  WalkieChannel,
  WalkieTransmissionLog,
} from './types/app';
import { demoAudio } from './utils/demoAudio';
import { TopAppBar } from './components/TopAppBar';
import { NavigationBar } from './components/NavigationBar';
import { IncomingCallBanner } from './components/IncomingCallBanner';
import { HomeScreen } from './components/screens/HomeScreen';
import { DevicesScreen } from './components/screens/DevicesScreen';
import { CallScreen } from './components/screens/CallScreen';
import { WalkieTalkieScreen } from './components/screens/WalkieTalkieScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [devices, setDevices] = useState<BluetoothDeviceItem[]>(INITIAL_DEVICES);
  const [peers] = useState<PeerContact[]>(INITIAL_PEERS);
  const [selectedPeer, setSelectedPeer] = useState<PeerContact>(INITIAL_PEERS[0]);
  const [callHistory, setCallHistory] = useState<CallLogEntry[]>(INITIAL_CALL_HISTORY);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Normal Call state
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(false);
  const [incomingPeer, setIncomingPeer] = useState<PeerContact | null>(null);

  // Walkie-Talkie state
  const [activeChannel, setActiveChannel] = useState<WalkieChannel>(WALKIE_CHANNELS[0]);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [isReceivingReply, setIsReceivingReply] = useState<boolean>(false);
  const [transmitSeconds, setTransmitSeconds] = useState<number>(0);
  const [transmissionLogs, setTransmissionLogs] = useState<WalkieTransmissionLog[]>([]);

  // Subtle status toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Timers refs for clean cancellation
  const callTimersRef = useRef<number[]>([]);
  const scanTimerRef = useRef<number | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const transmitStartRef = useRef<number | null>(null);

  const connectedDevice =
    bluetoothEnabled
      ? devices.find((d) => d.connectionState === 'connected') || null
      : null;

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const clearCallTimers = useCallback(() => {
    callTimersRef.current.forEach((id) => window.clearTimeout(id));
    callTimersRef.current = [];
  }, []);

  // Call duration ticker
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = window.setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [callStatus]);

  // Walkie-Talkie transmit timer
  useEffect(() => {
    if (!isTransmitting) return;
    const interval = window.setInterval(() => {
      if (transmitStartRef.current) {
        setTransmitSeconds((Date.now() - transmitStartRef.current) / 1000);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [isTransmitting]);

  // Cleanup all pending timers on unmount
  useEffect(() => {
    return () => {
      clearCallTimers();
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [clearCallTimers]);

  // Bluetooth Handlers
  const handleToggleBluetooth = useCallback(() => {
    setBluetoothEnabled((prev) => {
      const next = !prev;
      if (!next) {
        setIsScanning(false);
        setDevices((curr) =>
          curr.map((d) => ({ ...d, connectionState: 'disconnected' }))
        );
        showToast('Simulated Bluetooth turned off (Demo)');
      } else {
        showToast('Simulated Bluetooth enabled (Demo)');
      }
      return next;
    });
  }, [showToast]);

  const handleStartScan = useCallback(() => {
    if (!bluetoothEnabled || isScanning) return;
    setIsScanning(true);
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);

    scanTimerRef.current = window.setTimeout(() => {
      setDevices((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const newOnes = DISCOVERABLE_EXTRA_DEVICES.filter((d) => !existingIds.has(d.id));
        return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
      });
      setIsScanning(false);
      showToast('Simulated scan complete · Nearby demo devices updated');
    }, 1600);
  }, [bluetoothEnabled, isScanning, showToast]);

  const handleConnectDevice = useCallback(
    (deviceId: string) => {
      if (!bluetoothEnabled) return;
      setDevices((prev) =>
        prev.map((d) =>
          d.id === deviceId
            ? { ...d, connectionState: 'connecting' }
            : d.connectionState === 'connected'
              ? { ...d, connectionState: 'disconnected' }
              : d
        )
      );

      window.setTimeout(() => {
        let connectedName = '';
        setDevices((prev) =>
          prev.map((d) => {
            if (d.id === deviceId) {
              connectedName = d.name;
              return {
                ...d,
                paired: true,
                connectionState: 'connected',
                lastSeen: 'Active now · Demo',
              };
            }
            return { ...d, connectionState: 'disconnected' };
          })
        );
        demoAudio.btConnect(settings.uiSoundEffects);
        if (connectedName) {
          showToast(`Connected to ${connectedName} (Demo)`);
        }
      }, 850);
    },
    [bluetoothEnabled, settings.uiSoundEffects, showToast]
  );

  const handleDisconnectDevice = useCallback(
    (deviceId: string) => {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === deviceId
            ? { ...d, connectionState: 'disconnected', lastSeen: 'Disconnected · Demo' }
            : d
        )
      );
      showToast('Disconnected demo audio device');
    },
    [showToast]
  );

  const handleForgetDevice = useCallback(
    (deviceId: string) => {
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      showToast('Removed paired demo device');
    },
    [showToast]
  );

  // Normal Call Handlers
  const startDemoCallWithPeer = useCallback(
    (peer: PeerContact) => {
      clearCallTimers();
      setSelectedPeer(peer);
      setCallDuration(0);
      setIsMuted(false);
      setCallStatus('dialing');
      setActiveScreen('call');

      const t1 = window.setTimeout(() => {
        setCallStatus('ringing');
        demoAudio.ringPulse(settings.uiSoundEffects);
      }, 750);

      const t2 = window.setTimeout(() => {
        setCallStatus('connected');
        demoAudio.callConnect(settings.uiSoundEffects);
        showToast(`Voice call connected with ${peer.name} (Demo)`);
      }, 2200);

      callTimersRef.current = [t1, t2];
    },
    [clearCallTimers, settings.uiSoundEffects, showToast]
  );

  const handleStartCall = useCallback(() => {
    startDemoCallWithPeer(selectedPeer);
  }, [selectedPeer, startDemoCallWithPeer]);

  const handleEndCall = useCallback(() => {
    clearCallTimers();
    const finalDuration = callDuration;
    const wasConnected = callStatus === 'connected';
    setCallStatus('ended');
    demoAudio.callHangup(settings.uiSoundEffects);

    setCallHistory((prev) => [
      {
        id: `log-${Date.now()}`,
        peerId: selectedPeer.id,
        peerName: selectedPeer.name,
        mode: 'Normal Call',
        durationSeconds: finalDuration,
        timestamp: nowTimeLabel(),
        statusLabel: wasConnected ? 'Completed · Demo' : 'Cancelled · Demo',
      },
      ...prev,
    ]);

    showToast('Simulated call disconnected (Demo)');
  }, [callDuration, callStatus, clearCallTimers, selectedPeer, settings.uiSoundEffects, showToast]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      showToast(next ? 'Microphone muted (Demo)' : 'Microphone unmuted (Demo)');
      return next;
    });
  }, [showToast]);

  const handleToggleSpeaker = useCallback(() => {
    setIsSpeakerOn((prev) => {
      const next = !prev;
      showToast(next ? 'Speakerphone enabled (Demo)' : 'Audio routed to headset/earpiece (Demo)');
      return next;
    });
  }, [showToast]);

  const handleSimulateIncoming = useCallback(() => {
    const candidate = peers.find((p) => p.id !== selectedPeer.id) || peers[0];
    setIncomingPeer(candidate);
    demoAudio.ringPulse(settings.uiSoundEffects);
  }, [peers, selectedPeer.id, settings.uiSoundEffects]);

  const handleAcceptIncoming = useCallback(() => {
    if (!incomingPeer) return;
    const peer = incomingPeer;
    setIncomingPeer(null);
    clearCallTimers();
    setSelectedPeer(peer);
    setCallDuration(0);
    setIsMuted(false);
    setCallStatus('connected');
    setActiveScreen('call');
    demoAudio.callConnect(settings.uiSoundEffects);
    showToast(`Answered simulated call from ${peer.name} (Demo)`);
  }, [clearCallTimers, incomingPeer, settings.uiSoundEffects, showToast]);

  const handleDeclineIncoming = useCallback(() => {
    if (!incomingPeer) return;
    const peer = incomingPeer;
    setIncomingPeer(null);
    demoAudio.callHangup(settings.uiSoundEffects);
    setCallHistory((prev) => [
      {
        id: `log-${Date.now()}`,
        peerId: peer.id,
        peerName: peer.name,
        mode: 'Normal Call',
        durationSeconds: 0,
        timestamp: nowTimeLabel(),
        statusLabel: 'Declined · Demo',
      },
      ...prev,
    ]);
    showToast(`Declined simulated call from ${peer.name}`);
  }, [incomingPeer, settings.uiSoundEffects, showToast]);

  // Walkie-Talkie Handlers
  const handleStartTransmit = useCallback(() => {
    if (isTransmitting) return;
    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current);
      setIsReceivingReply(false);
    }
    transmitStartRef.current = Date.now();
    setTransmitSeconds(0);
    setIsTransmitting(true);
    demoAudio.pttPress(settings.uiSoundEffects);
  }, [isTransmitting, settings.uiSoundEffects]);

  const handleStopTransmit = useCallback(() => {
    if (!isTransmitting) return;
    const elapsedSec = transmitStartRef.current
      ? Math.max(0.4, (Date.now() - transmitStartRef.current) / 1000)
      : 0.6;
    transmitStartRef.current = null;
    setIsTransmitting(false);
    setTransmitSeconds(0);

    if (settings.rogerBeepTone) {
      demoAudio.pttRelease(settings.uiSoundEffects);
    }

    const durationLabel = `${elapsedSec.toFixed(1)}s`;
    setTransmissionLogs((prev) => [
      {
        id: `ptt-${Date.now()}`,
        sender: 'You',
        channelName: activeChannel.name,
        durationLabel,
        timestamp: nowTimeLabel(),
        direction: 'outgoing',
      },
      ...prev.slice(0, 14),
    ]);

    setCallHistory((prev) => [
      {
        id: `log-ptt-${Date.now()}`,
        peerId: selectedPeer.id,
        peerName: selectedPeer.name,
        mode: 'Walkie-Talkie',
        durationSeconds: Math.max(1, Math.round(elapsedSec)),
        timestamp: nowTimeLabel(),
        statusLabel: 'PTT Burst · Demo',
      },
      ...prev,
    ]);

    // Trigger simulated peer reply
    replyTimerRef.current = window.setTimeout(() => {
      setIsReceivingReply(true);
      demoAudio.pttPress(settings.uiSoundEffects);

      replyTimerRef.current = window.setTimeout(() => {
        setIsReceivingReply(false);
        if (settings.rogerBeepTone) {
          demoAudio.pttRelease(settings.uiSoundEffects);
        }
        setTransmissionLogs((prev) => [
          {
            id: `ptt-reply-${Date.now()}`,
            sender: selectedPeer.name,
            channelName: activeChannel.name,
            durationLabel: '1.8s',
            timestamp: nowTimeLabel(),
            direction: 'incoming',
          },
          ...prev.slice(0, 14),
        ]);
      }, 1800);
    }, 650);
  }, [
    activeChannel.name,
    isTransmitting,
    selectedPeer.id,
    selectedPeer.name,
    settings.rogerBeepTone,
    settings.uiSoundEffects,
  ]);

  const handleOpenWalkieWithPeer = useCallback(
    (peer: PeerContact) => {
      setSelectedPeer(peer);
      setActiveScreen('walkie');
    },
    []
  );

  // Settings Handlers
  const handleUpdateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleResetDemo = useCallback(() => {
    clearCallTimers();
    setBluetoothEnabled(true);
    setIsScanning(false);
    setDevices(INITIAL_DEVICES);
    setSelectedPeer(INITIAL_PEERS[0]);
    setCallHistory(INITIAL_CALL_HISTORY);
    setSettings(DEFAULT_SETTINGS);
    setCallStatus('idle');
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIncomingPeer(null);
    setActiveChannel(WALKIE_CHANNELS[0]);
    setIsTransmitting(false);
    setIsReceivingReply(false);
    setTransmissionLogs([]);
    showToast('Demo prototype state reset');
  }, [clearCallTimers, showToast]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#090B10] text-[#F3F5F8] flex flex-col lg:flex-row">
      <NavigationBar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        bluetoothEnabled={bluetoothEnabled}
        connectedDevice={connectedDevice}
        callStatus={callStatus}
      />

      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        <TopAppBar
          activeScreen={activeScreen}
          bluetoothEnabled={bluetoothEnabled}
          connectedDevice={connectedDevice}
          callStatus={callStatus}
          isTransmitting={isTransmitting}
          onNavigate={setActiveScreen}
        />

        <main className="flex-1 w-full min-w-0 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-w-0"
            >
              {activeScreen === 'home' && (
                <HomeScreen
                  bluetoothEnabled={bluetoothEnabled}
                  connectedDevice={connectedDevice}
                  peers={peers}
                  callHistory={callHistory}
                  preferredCodec={settings.preferredCodec}
                  onNavigate={setActiveScreen}
                  onStartDemoCall={startDemoCallWithPeer}
                  onOpenWalkieWithPeer={handleOpenWalkieWithPeer}
                />
              )}

              {activeScreen === 'devices' && (
                <DevicesScreen
                  bluetoothEnabled={bluetoothEnabled}
                  isScanning={isScanning}
                  devices={devices}
                  onToggleBluetooth={handleToggleBluetooth}
                  onStartScan={handleStartScan}
                  onConnectDevice={handleConnectDevice}
                  onDisconnectDevice={handleDisconnectDevice}
                  onForgetDevice={handleForgetDevice}
                />
              )}

              {activeScreen === 'call' && (
                <CallScreen
                  peers={peers}
                  selectedPeer={selectedPeer}
                  onSelectPeer={setSelectedPeer}
                  connectedDevice={connectedDevice}
                  bluetoothEnabled={bluetoothEnabled}
                  callStatus={callStatus}
                  callDuration={callDuration}
                  isMuted={isMuted}
                  isSpeakerOn={isSpeakerOn}
                  onStartCall={handleStartCall}
                  onEndCall={handleEndCall}
                  onToggleMute={handleToggleMute}
                  onToggleSpeaker={handleToggleSpeaker}
                  onSimulateIncoming={handleSimulateIncoming}
                />
              )}

              {activeScreen === 'walkie' && (
                <WalkieTalkieScreen
                  channels={WALKIE_CHANNELS}
                  activeChannel={activeChannel}
                  onSelectChannel={setActiveChannel}
                  activePeer={selectedPeer}
                  connectedDevice={connectedDevice}
                  bluetoothEnabled={bluetoothEnabled}
                  isTransmitting={isTransmitting}
                  isReceivingReply={isReceivingReply}
                  transmitSeconds={transmitSeconds}
                  latchMode={settings.pttLatchMode}
                  onToggleLatchMode={() =>
                    handleUpdateSettings({ pttLatchMode: !settings.pttLatchMode })
                  }
                  onStartTransmit={handleStartTransmit}
                  onStopTransmit={handleStopTransmit}
                  transmissionLogs={transmissionLogs}
                />
              )}

              {activeScreen === 'settings' && (
                <SettingsScreen
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onResetDemo={handleResetDemo}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Simulated Incoming Call Overlay */}
      <IncomingCallBanner
        incomingPeer={incomingPeer}
        onAccept={handleAcceptIncoming}
        onDecline={handleDeclineIncoming}
      />

      {/* Non-blocking Android-style Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2130]/95 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-slate-100 shadow-2xl whitespace-nowrap max-w-[calc(100vw-2rem)] truncate"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
