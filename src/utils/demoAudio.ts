// Subtle client-side Web Audio API UI feedback tones for interactive demo polish.
// Safe against browser autoplay restrictions: ignores errors if AudioContext cannot start.

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playTone(freq: number, durationMs: number, type: OscillatorType = 'sine', volume = 0.04, delayMs = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime + delayMs / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.02);
  } catch {
    // Ignore audio synthesis errors silently
  }
}

export const demoAudio = {
  pttPress(enabled: boolean) {
    if (!enabled) return;
    playTone(680, 65, 'triangle', 0.045, 0);
    playTone(920, 75, 'triangle', 0.045, 55);
  },
  pttRelease(enabled: boolean) {
    if (!enabled) return;
    playTone(1040, 60, 'sine', 0.04, 0);
    playTone(780, 80, 'sine', 0.04, 65);
  },
  callConnect(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 90, 'sine', 0.04, 0);
    playTone(659.25, 110, 'sine', 0.04, 85);
  },
  callHangup(enabled: boolean) {
    if (!enabled) return;
    playTone(480, 90, 'sine', 0.04, 0);
    playTone(340, 140, 'sine', 0.04, 80);
  },
  ringPulse(enabled: boolean) {
    if (!enabled) return;
    playTone(440, 180, 'sine', 0.025, 0);
    playTone(480, 180, 'sine', 0.025, 20);
  },
  btConnect(enabled: boolean) {
    if (!enabled) return;
    playTone(587.33, 80, 'sine', 0.035, 0);
    playTone(880, 120, 'sine', 0.035, 75);
  },
};
