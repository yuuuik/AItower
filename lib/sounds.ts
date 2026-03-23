// Simple Web Audio API sound effects — no external files needed

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function playTone(
  frequency: number,
  type: OscillatorType,
  duration: number,
  gainVal = 0.15,
  delay = 0
) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
    gain.gain.setValueAtTime(gainVal, ac.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration);
  } catch (_) {}
}

export const Sounds = {
  click() {
    playTone(440, 'sine', 0.08, 0.12);
  },
  drop() {
    playTone(220, 'square', 0.12, 0.1);
    playTone(280, 'square', 0.1, 0.08, 0.05);
  },
  win() {
    playTone(523, 'sine', 0.15, 0.15);
    playTone(659, 'sine', 0.15, 0.15, 0.15);
    playTone(784, 'sine', 0.2, 0.15, 0.3);
  },
  lose() {
    playTone(200, 'sawtooth', 0.2, 0.18);
    playTone(150, 'sawtooth', 0.25, 0.18, 0.18);
    playTone(100, 'sawtooth', 0.3, 0.18, 0.38);
  },
};
