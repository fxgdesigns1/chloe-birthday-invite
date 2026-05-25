import { useRef, useState } from 'react';
import {
  CalendarDays,
  Clock,
  EyeOff,
  ExternalLink,
  LockKeyhole,
  MapPin,
  Navigation,
  ShieldAlert,
  Sparkles,
  Ticket,
  UserRoundCheck,
} from 'lucide-react';

const assets = {
  introVideo: '/assets/media/intro/chloe-welcome.mp4',
  introPoster: '/assets/media/intro/chloe-welcome-preview.gif',
  waterVideo: '/assets/media/water/chloe-floating-water.mp4',
  waterPoster: '/assets/media/water/chloe-floating-water-preview.gif',
  waterPortrait: '/assets/media/water/chloe-floating-portrait.jpg',
  editorialPortrait: '/assets/media/editorial/chloe-editorial-regal.jpg',
};

const eventDetails = [
  {
    icon: CalendarDays,
    label: 'Date',
    value: 'Saturday, 4th July 2026',
  },
  {
    icon: Clock,
    label: 'Arrival Window',
    value: '21:00 doors / 21:45 strict arrival',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Sion Spaces, 426-428 Streatham High Road, London, SW16 3PX (inside Black Kitchen)',
  },
  {
    icon: UserRoundCheck,
    label: 'Dress Code',
    value: 'Smart casual. High-fashion editorial. No casual lounge or dusty clothing.',
  },
];

const timeline = [
  ['21:00', 'Doors Open', 'The room warms up, drinks land, and the surprise stays sealed.'],
  ['21:45', 'Lockdown', 'Strict arrival policy. Once Chloe is en route, the timeline closes.'],
  ['22:00', 'Signal Drop', 'The reveal hits. Cameras ready, voices low, energy high.'],
  ['Late', 'Turn Up', 'Birthday chaos, clean fits only, no lounge energy.'],
];

const mapDestination = 'Sion%20Spaces%2C%20426-428%20Streatham%20High%20Road%2C%20London%20SW16%203PX';
const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapDestination}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${mapDestination}&output=embed`;
const eventbriteRsvp = {
  eventId: '1989983650668',
  ticketUrl:
    'https://www.eventbrite.co.uk/e/chloe-secret-birthday-soiree-tickets-1989983650668?utm-campaign=social&utm-content=attendeeshare&utm-medium=discovery&utm-source=wa&utm-term=checkoutwidget',
} as const;

function EventbriteRsvp() {
  return (
    <section className="rsvp-panel reveal-panel" aria-label="RSVP on Eventbrite">
      <p className="panel-kicker">
        <Ticket aria-hidden="true" size={18} />
        <span>RSVP on Eventbrite</span>
      </p>
      <p className="rsvp-intro">
        Reserve your place for Chloe Secret Birthday Soiree through the live Eventbrite checkout.
      </p>
      <a className="eventbrite-rsvp" href={eventbriteRsvp.ticketUrl} target="_blank" rel="noreferrer">
        <ExternalLink aria-hidden="true" size={18} />
        <span>Open Eventbrite RSVP</span>
      </a>
      <p className="rsvp-message">Event ID: {eventbriteRsvp.eventId}</p>
    </section>
  );
}

function App() {
  const [stage, setStage] = useState<'gate' | 'intro' | 'invite'>('gate');
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  const openIntro = () => {
    if (isOpening) {
      return;
    }

    setIsOpening(true);
    window.setTimeout(() => {
      setStage('intro');
      setIsOpening(false);
      window.setTimeout(() => {
        void introVideoRef.current?.play();
      }, 120);
    }, 560);
  };

  const revealInvite = () => {
    if (isRevealing) {
      return;
    }

    setIsRevealing(true);
    window.setTimeout(() => {
      setStage('invite');
      setIsRevealing(false);
    }, 520);
  };

  return (
    <main className={`app-shell app-shell--${stage}`}>
      {stage !== 'gate' ? (
        <div className="water-backdrop" aria-hidden="true">
          <video autoPlay loop muted playsInline poster={assets.waterPoster} src={assets.waterVideo} />
          <div />
        </div>
      ) : null}

      {stage === 'gate' ? (
        <section
          className={`activation-gate${isOpening ? ' activation-gate--opening' : ''}`}
          aria-label="Private invitation gate"
        >
          <div className="gate-atmosphere" aria-hidden="true">
            <video autoPlay loop muted playsInline poster={assets.waterPoster} src={assets.waterVideo} />
            <div />
          </div>
          <div className="matrix-grid" />
          <div className="activation-node">
            <div className="node-ring node-ring--outer" />
            <div className="node-ring node-ring--inner" />
            <button className="link-node" type="button" onClick={openIntro} disabled={isOpening}>
              <LockKeyhole aria-hidden="true" size={24} />
              <span>{isOpening ? 'Opening' : "Open Chloe's Message"}</span>
              <Sparkles aria-hidden="true" size={20} />
            </button>
          </div>
          <div className="system-readout">
            <span>Private frequency</span>
            <span>Welcome video armed</span>
            <span>Surprise mode: silent</span>
          </div>
        </section>
      ) : null}

      {stage === 'intro' ? (
        <section
          className={`intro-stage${isRevealing ? ' intro-stage--leaving' : ''}`}
          aria-label="Chloe welcome video"
        >
          <div className="cinema-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="transmission-frame">
            <video
              ref={introVideoRef}
              playsInline
              poster={assets.introPoster}
              preload="auto"
              src={assets.introVideo}
              onEnded={() => setStage('invite')}
            />
            <div className="transmission-scan" aria-hidden="true" />
          </div>
          <div className="intro-caption">
            <span>Secret Transmission</span>
            <p>Chloe has sent the welcome. Now keep the surprise sealed until she walks in.</p>
            <button className="mini-action" type="button" onClick={revealInvite} disabled={isRevealing}>
              {isRevealing ? 'Revealing' : 'Reveal Invite'}
            </button>
          </div>
        </section>
      ) : null}

      {stage === 'invite' ? (
        <section className="invite-experience" aria-label="Chloe birthday invitation">
          <section className="invite-hero">
            <div className="hero-copy">
              <p className="panel-kicker">
                <EyeOff aria-hidden="true" size={18} />
                <span>Surprise transmission unlocked</span>
              </p>
              <h1>CHLOE is the moment.</h1>
              <p>
                A private birthday invitation built around one rule: arrive sharp, stay quiet, and let the reveal hit
                properly.
              </p>
            </div>
            <div className="portrait-cutout" aria-label="Chloe editorial portrait">
              <img src={assets.editorialPortrait} alt="Chloe underwater editorial portrait" />
            </div>
          </section>

          <div className="invite-stack">
            <section className="cinematic-panel reveal-panel">
              <div>
                <p className="panel-kicker">
                  <Sparkles aria-hidden="true" size={18} />
                  <span>Dress code energy</span>
                </p>
                <h2>Regal. Bright. Camera ready.</h2>
                <p>
                  The water film is the mood: cyan light, orange glow, elegant chaos. Keep the fit smart casual, but
                  bring main-character polish.
                </p>
              </div>
              <img src={assets.waterPortrait} alt="Chloe floating in water wearing orange" />
            </section>

            <section className="logistics-band reveal-panel" aria-label="Event logistics">
              {eventDetails.map(({ icon: Icon, label, value }) => (
                <article className="detail-card" key={label}>
                  <Icon aria-hidden="true" size={22} />
                  <div>
                    <span>{label}</span>
                    <p>{value}</p>
                  </div>
                </article>
              ))}
            </section>

            <div className="warning-strip reveal-panel">
              <ShieldAlert aria-hidden="true" size={22} />
              <span>Do not mention anything to Chloe. Arrive by 21:45 or the surprise is at risk.</span>
            </div>

            <section className="map-section reveal-panel" aria-label="Venue directions">
              <div className="map-copy">
                <p className="panel-kicker">
                  <MapPin aria-hidden="true" size={18} />
                  <span>Venue coordinates</span>
                </p>
                <h2>Sion Spaces</h2>
                <p>426-428 Streatham High Road, London, SW16 3PX</p>
                <strong>Located inside Black Kitchen</strong>
                <a className="directions-button" href={mapUrl} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" size={18} />
                  <span>Open Google Maps</span>
                </a>
              </div>
              <div className="map-frame">
                <div className="map-fallback" aria-hidden="true">
                  <span>Live venue map</span>
                  <strong>Sion Spaces, Streatham</strong>
                  <small>Open Google Maps for turn-by-turn directions</small>
                </div>
                <iframe
                  title="Sion Spaces map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                />
              </div>
            </section>

            <section className="timeline-band reveal-panel" aria-label="Celebration timeline">
              <div className="section-heading">
                <Sparkles aria-hidden="true" size={20} />
                <h2>Night Sequence</h2>
              </div>
              <div className="timeline-list">
                {timeline.map(([time, title, copy]) => (
                  <article className="timeline-card" key={time}>
                    <span>{time}</span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                ))}
              </div>
            </section>

            <EventbriteRsvp />

          </div>
        </section>
      ) : null}
    </main>
  );
}

export default App;
