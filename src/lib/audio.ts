type AudioContextConstructor = typeof AudioContext;

declare global {
  interface Window {
    webkitAudioContext?: AudioContextConstructor;
  }
}

export type AmbientController = {
  stop: () => void;
};

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

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.19, now + 2);

  filter.type = 'lowpass';
  filter.frequency.value = 620;
  filter.Q.value = 0.8;
  delay.delayTime.value = 0.38;
  feedback.gain.value = 0.22;

  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(compressor);
  filter.connect(compressor);
  compressor.connect(master).connect(context.destination);

  const oscillators = [
    createOscillator(context, filter, 55, 'sine'),
    createOscillator(context, filter, 82.41, 'triangle'),
    createOscillator(context, filter, 164.82, 'sine'),
  ];

  const sweep = window.setInterval(() => {
    const sweepTime = context.currentTime;
    filter.frequency.exponentialRampToValueAtTime(420 + Math.random() * 360, sweepTime + 1.4);
  }, 1800);

  return {
    stop: () => {
      window.clearInterval(sweep);
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
