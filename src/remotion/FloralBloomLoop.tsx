import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const petals = [
  { x: 160, y: 126, w: 176, rotate: -18, delay: 0.02, opacity: 0.34 },
  { x: 1510, y: 96, w: 138, rotate: 28, delay: 0.18, opacity: 0.28 },
  { x: 1320, y: 744, w: 210, rotate: -34, delay: 0.34, opacity: 0.26 },
  { x: 286, y: 768, w: 150, rotate: 18, delay: 0.5, opacity: 0.24 },
  { x: 1018, y: 210, w: 124, rotate: 44, delay: 0.68, opacity: 0.2 },
] as const;

const loopProgress = (frame: number, durationInFrames: number, delay = 0) => {
  const normalized = (frame / durationInFrames + delay) % 1;
  return Math.sin(normalized * Math.PI * 2);
};

export function FloralBloomLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const pulse = loopProgress(frame, durationInFrames);
  const crossPulse = Math.cos((frame / durationInFrames) * Math.PI * 2);
  const easeIn = interpolate(frame, [0, 1.4 * fps], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffe5d6', overflow: 'hidden' }}>
      <Img
        src={staticFile('assets/media/floral/chloe-floral-bloom.png')}
        style={{
          position: 'absolute',
          inset: -44,
          width: 'calc(100% + 88px)',
          height: 'calc(100% + 88px)',
          objectFit: 'cover',
          filter: 'saturate(1.1) contrast(1.03) brightness(1.03)',
          transform: `translate3d(${pulse * 18}px, ${crossPulse * -10}px, 0) scale(${1.045 + easeIn * 0.012})`,
          transformOrigin: 'center',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.58), rgba(255,238,220,0.28) 31%, transparent 62%), radial-gradient(circle at 82% 76%, rgba(255,112,126,0.22), transparent 40%), linear-gradient(180deg, rgba(90,25,38,0.03), rgba(72,26,34,0.14))',
          opacity: 0.96 + pulse * 0.04,
        }}
      />

      {petals.map((petal) => {
        const drift = loopProgress(frame, durationInFrames, petal.delay);
        const lift = Math.cos(((frame / durationInFrames + petal.delay) % 1) * Math.PI * 2);

        return (
          <div
            key={`${petal.x}-${petal.y}`}
            style={{
              position: 'absolute',
              left: petal.x,
              top: petal.y,
              width: petal.w,
              aspectRatio: '1.52',
              borderRadius: '999px 999px 999px 180px',
              background:
                'radial-gradient(circle at 34% 32%, rgba(255,255,255,0.72), transparent 34%), linear-gradient(135deg, rgba(255,226,210,0.5), rgba(255,93,130,0.28))',
              boxShadow: '0 28px 80px rgba(255,104,98,0.14)',
              filter: 'blur(0.4px)',
              opacity: petal.opacity,
              transform: `translate3d(${drift * 15}px, ${lift * -12}px, 0) rotate(${petal.rotate + drift * 4}deg)`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(112deg, transparent 18%, rgba(255,255,255,0.2) 35%, transparent 52%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(93,27,35,0.1))',
          mixBlendMode: 'screen',
          opacity: 0.34 + crossPulse * 0.08,
          transform: `translate3d(${pulse * 22}px, 0, 0)`,
        }}
      />
    </AbsoluteFill>
  );
}
