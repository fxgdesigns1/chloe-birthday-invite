import { Composition } from 'remotion';
import { FloralBloomLoop } from './FloralBloomLoop';

export function RemotionRoot() {
  return (
    <Composition
      id="FloralBloomLoop"
      component={FloralBloomLoop}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
