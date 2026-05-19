import { LockKeyhole, Sparkles } from 'lucide-react';
import { cinematicAssets } from '../data/event';

type ActivationGateProps = {
  active: boolean;
  audioError: string;
  onActivate: () => void;
};

export function ActivationGate({ active, audioError, onActivate }: ActivationGateProps) {
  return (
    <section className={`activation-gate ${active ? 'is-active' : 'is-exiting'}`} aria-hidden={!active}>
      <video
        className="gate-film"
        autoPlay
        loop
        muted
        playsInline
        poster={cinematicAssets.waterPoster}
        src={cinematicAssets.waterVideo}
      />
      <div className="gate-grade" />
      <div className="gate-editorial">
        <div className="gate-copy">
          <p className="chapter-kicker">Private birthday reveal</p>
          <h1>The room opens for Chloe.</h1>
          <p>
            A secret film, a hidden address, and one beautiful instruction: arrive early enough for the silence.
          </p>
        </div>
        <div className="invitation-seal" aria-hidden="true">
          <img src={cinematicAssets.editorialPortrait} alt="" />
          <span className="seal-ring seal-ring--outer" />
          <span className="seal-ring seal-ring--inner" />
          <span className="seal-mark">C</span>
        </div>
      </div>
      <div className="access-dock">
        <div>
          <span>Saturday 4 July</span>
          <strong>21:00 / London</strong>
        </div>
        <button className="link-node" type="button" onClick={onActivate}>
          <LockKeyhole aria-hidden="true" size={20} />
          <span>Unlock the invitation</span>
          <Sparkles aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="system-readout">
        <span>Surprise sealed</span>
        <span>Welcome film live</span>
        <span>Hannah RSVP ready</span>
      </div>
      {audioError ? <p className="audio-warning">{audioError}</p> : null}
    </section>
  );
}
