type AudioContextConstructor = typeof AudioContext;

declare global {
  interface Window {
    webkitAudioContext?: AudioContextConstructor;
  }
}

export type AmbientController = {
  stop: () => void;
};

export const AMAPIANO_AMBIENCE = {
  bpm: 112,
  disclaimer: 'original low-volume amapiano-inspired lounge loop; no copyrighted track audio is used.',
  logDrumSteps: [0, 3, 7, 10, 14],
  shakerSteps: [1, 2, 5, 6, 9, 10, 13, 14],
  padNotes: [55, 82.41, 164.82],
} as const;

const createOscillator = (
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  type: OscillatorType,
) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.18;
  oscillator.connect(gain).connect(destination);
  oscillator.start();

  return oscillator;
};

const schedulePercussion = (
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  peak: number,
  type: OscillatorType,
) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(34, frequency * 0.42), startTime + duration);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.04);
};

export async function unlockAmbientLoop(): Promise<AmbientController> {
  const AudioCtor = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioCtor) {
    throw new Error('Web Audio API is not available in this browser.');
  }

  const context = new AudioCtor();

  if (context.state === 'suspended') {
    await context.resume();
  }

  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(2);
  const feedback = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const now = context.currentTime;
  const beatLength = 60 / AMAPIANO_AMBIENCE.bpm;
  let step = 0;

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.13, now + 2.4);

  filter.type = 'lowpass';
  filter.frequency.value = 740;
  filter.Q.value = 0.8;
  delay.delayTime.value = 0.42;
  feedback.gain.value = 0.18;

  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(compressor);
  filter.connect(compressor);
  compressor.connect(master).connect(context.destination);

  const oscillators = [
    createOscillator(context, filter, AMAPIANO_AMBIENCE.padNotes[0], 'sine'),
    createOscillator(context, filter, AMAPIANO_AMBIENCE.padNotes[1], 'triangle'),
    createOscillator(context, filter, AMAPIANO_AMBIENCE.padNotes[2], 'sine'),
  ];

  const sweep = window.setInterval(() => {
    const sweepTime = context.currentTime;
    filter.frequency.exponentialRampToValueAtTime(520 + Math.random() * 420, sweepTime + 1.4);
  }, 1800);

  const groove = window.setInterval(() => {
    const playAt = context.currentTime + 0.045;
    const currentStep = step % 16;

    if ((AMAPIANO_AMBIENCE.logDrumSteps as readonly number[]).includes(currentStep)) {
      schedulePercussion(context, compressor, currentStep === 0 ? 72 : 92, playAt, 0.32, 0.09, 'sine');
    }

    if ((AMAPIANO_AMBIENCE.shakerSteps as readonly number[]).includes(currentStep)) {
      schedulePercussion(context, compressor, 7200, playAt, 0.045, 0.018, 'triangle');
    }

    if (currentStep === 4 || currentStep === 12) {
      schedulePercussion(context, compressor, 184, playAt, 0.08, 0.026, 'square');
    }

    step += 1;
  }, beatLength * 250);

  return {
    stop: () => {
      window.clearInterval(sweep);
      window.clearInterval(groove);
      const fadeTime = context.currentTime;
      master.gain.cancelScheduledValues(fadeTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), fadeTime);
      master.gain.exponentialRampToValueAtTime(0.0001, fadeTime + 0.7);
      window.setTimeout(() => {
        oscillators.forEach((oscillator) => oscillator.stop());
        void context.close();
      }, 800);
    },
  };
}
