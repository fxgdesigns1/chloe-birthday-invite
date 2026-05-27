import { useRef, useState } from 'react';
import { ActivationGate } from './components/ActivationGate';
import { HologramStage } from './components/HologramStage';
import { ParallaxExperience } from './components/ParallaxExperience';
import { unlockAmbientLoop, type AmbientController } from './lib/audio';

type Stage = 'activation' | 'hologram' | 'parallax';

export default function App() {
  const [stage, setStage] = useState<Stage>('activation');
  const [audioError, setAudioError] = useState('');
  const ambienceRef = useRef<AmbientController | null>(null);

  const activateTransmission = async () => {
    if (stage !== 'activation') {
      return;
    }

    setStage('hologram');

    try {
      ambienceRef.current = await unlockAmbientLoop();
    } catch (error) {
      console.warn('Birthday music unavailable', error);
      setAudioError('Music channel unavailable. Visual link remains active.');
    }
  };

  return (
    <main className={`app-shell app-shell--${stage}`}>
      {stage === 'activation' ? (
        <ActivationGate active audioError={audioError} onActivate={activateTransmission} />
      ) : null}
      {stage === 'hologram' ? <HologramStage active onComplete={() => setStage('parallax')} /> : null}
      {stage === 'parallax' ? <ParallaxExperience active /> : null}
    </main>
  );
}
