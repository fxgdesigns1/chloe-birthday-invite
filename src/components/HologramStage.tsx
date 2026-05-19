import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { AlertTriangle, Play, SkipForward } from 'lucide-react';
import { cinematicAssets, transmission } from '../data/event';

type HologramStageProps = {
  active: boolean;
  onComplete: () => void;
};

export function HologramStage({ active, onComplete }: HologramStageProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);

  const completeTransmission = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;

    const breakdown = breakdownRef.current;
    const shell = shellRef.current;

    if (!breakdown || !shell) {
      onComplete();
      return;
    }

    const lines = breakdown.querySelectorAll('.break-line');
    gsap
      .timeline({ onComplete })
      .set(breakdown, { autoAlpha: 1 })
      .fromTo(
        lines,
        { scaleX: 0, xPercent: -80, opacity: 0 },
        {
          scaleX: 1,
          xPercent: 0,
          opacity: 1,
          duration: 0.32,
          stagger: 0.025,
          ease: 'power4.out',
        },
      )
      .to(shell, { opacity: 0, duration: 0.28, ease: 'steps(8)' }, '-=0.08')
      .to(lines, { xPercent: 120, opacity: 0, duration: 0.26, stagger: 0.018, ease: 'power2.in' }, '<');
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    completedRef.current = false;
    setVideoFailed(false);
    setNeedsManualPlay(false);
    gsap.fromTo(shellRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42, ease: 'power2.out' });

    const playPromise = videoRef.current?.play();
    playPromise?.catch(() => setNeedsManualPlay(true));

    return () => {
      gsap.killTweensOf(shellRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (!active || !videoFailed) {
      return undefined;
    }

    const fallbackTimer = window.setTimeout(completeTransmission, 6500);

    return () => window.clearTimeout(fallbackTimer);
  }, [active, completeTransmission, videoFailed]);

  return (
    <section className={`hologram-stage ${active ? 'is-active' : ''}`} ref={shellRef} aria-hidden={!active}>
      <video
        className="stage-water"
        autoPlay
        loop
        muted
        playsInline
        poster={cinematicAssets.waterPoster}
        src={cinematicAssets.waterVideo}
      />
      <div className="stage-grade" />
      <div className="premiere-layout">
        <div className="premiere-copy">
          <p className="chapter-kicker">Chapter I / The Whisper</p>
          <h2>Chloe appears before the address does.</h2>
          <p>{transmission.secretLine}</p>
          <div className="transmission-actions">
            {needsManualPlay ? (
              <button
                className="mini-action"
                type="button"
                onClick={() => {
                  setNeedsManualPlay(false);
                  void videoRef.current?.play();
                }}
              >
                <Play aria-hidden="true" size={16} />
                <span>Play Chloe</span>
              </button>
            ) : null}
            <button className="mini-action" type="button" onClick={completeTransmission}>
              <SkipForward aria-hidden="true" size={16} />
              <span>Reveal the room</span>
            </button>
          </div>
        </div>
        <div className="premiere-card">
          <div className="cinema-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="transmission-frame">
            <video
              ref={videoRef}
              className="welcome-transmission"
              playsInline
              poster={transmission.posterSource}
              preload="auto"
              src={transmission.videoSource}
              onEnded={completeTransmission}
              onError={() => setVideoFailed(true)}
            />
            <div className="transmission-scan" aria-hidden="true" />
          </div>
          <div className="film-caption">
            <span>Chloe / private film</span>
            <span>Keep it quiet</span>
          </div>
        </div>
      </div>
      {videoFailed ? (
        <div className="video-fallback" role="status">
          <AlertTriangle aria-hidden="true" size={18} />
          <span>Welcome video unavailable. The invite reveal is still ready.</span>
        </div>
      ) : null}
      <div className="breakdown" ref={breakdownRef} aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <span className="break-line" key={index} />
        ))}
      </div>
    </section>
  );
}
