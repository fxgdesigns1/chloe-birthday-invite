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
      <img className="gate-floral" src={cinematicAssets.floralBackdrop} alt="" />
      <div className="gate-grade" />
      <div className="petal-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="gate-editorial">
        <div className="gate-copy">
          <p className="chapter-kicker">Private birthday bloom</p>
          <h1>Chloe's message is ready.</h1>
          <p>
            A bright birthday opening, a secret welcome film, and one beautiful instruction: keep the surprise sealed.
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
          <span>Open Chloe's Message</span>
          <Sparkles aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="system-readout">
        <span>Birthday bloom</span>
        <span>Welcome film live</span>
        <span>Surprise sealed</span>
      </div>
      {audioError ? <p className="audio-warning">{audioError}</p> : null}
    </section>
  );
}
