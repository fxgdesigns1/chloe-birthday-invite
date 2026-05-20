type AudioContextConstructor = typeof AudioContext;

declare global {
  interface Window {
    webkitAudioContext?: AudioContextConstructor;
  }
}

export type AmbientController = {
  stop: () => void;
};

export const SOULFUL_HOUSE_AMBIENCE = {
  bpm: 122,
  masterLevel: 0.23,
  disclaimer: 'original louder-but-soft soulful house loop; no copyrighted track audio is used.',
  kickSteps: [0, 4, 8, 12],
  hatSteps: [2, 6, 10, 14],
  clapSteps: [4, 12],
  chordNotes: [65.41, 98, 130.81, 196, 261.63],
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
  const beatLength = 60 / SOULFUL_HOUSE_AMBIENCE.bpm;
  let step = 0;

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(SOULFUL_HOUSE_AMBIENCE.masterLevel, now + 2);

  filter.type = 'lowpass';
  filter.frequency.value = 980;
  filter.Q.value = 0.72;
  delay.delayTime.value = beatLength * 0.75;
  feedback.gain.value = 0.16;

  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(compressor);
  filter.connect(compressor);
  compressor.connect(master).connect(context.destination);

  const oscillators = SOULFUL_HOUSE_AMBIENCE.chordNotes.map((frequency, index) =>
    createOscillator(context, filter, frequency, index % 2 === 0 ? 'sine' : 'triangle'),
  );

  const sweep = window.setInterval(() => {
    const sweepTime = context.currentTime;
    filter.frequency.exponentialRampToValueAtTime(780 + Math.random() * 520, sweepTime + 1.3);
  }, 1600);

  const groove = window.setInterval(() => {
    const playAt = context.currentTime + 0.045;
    const currentStep = step % 16;

    if ((SOULFUL_HOUSE_AMBIENCE.kickSteps as readonly number[]).includes(currentStep)) {
      schedulePercussion(context, compressor, 58, playAt, 0.2, 0.14, 'sine');
    }

    if ((SOULFUL_HOUSE_AMBIENCE.hatSteps as readonly number[]).includes(currentStep)) {
      schedulePercussion(context, compressor, 8800, playAt, 0.052, 0.033, 'triangle');
    }

    if ((SOULFUL_HOUSE_AMBIENCE.clapSteps as readonly number[]).includes(currentStep)) {
      schedulePercussion(context, compressor, 210, playAt, 0.095, 0.04, 'square');
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
