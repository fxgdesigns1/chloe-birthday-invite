import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CalendarDays,
  Clock,
  EyeOff,
  MapPin,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import {
  celebrationTimeline,
  cinematicAssets,
  editorialChapters,
  eventPayload,
  mapPayload,
} from '../data/event';
import { RsvpPanel } from './RsvpPanel';

gsap.registerPlugin(ScrollTrigger);

type ParallaxExperienceProps = {
  active: boolean;
};

const logistics = [
  {
    icon: CalendarDays,
    label: 'Date',
    value: eventPayload.logistics.date,
  },
  {
    icon: Clock,
    label: 'Arrival',
    value: `${eventPayload.logistics.doors} doors / ${eventPayload.logistics.lockdown}`,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: eventPayload.logistics.location,
  },
  {
    icon: ShieldCheck,
    label: 'Dress Code',
    value: eventPayload.logistics.dressCode,
  },
];

export function ParallaxExperience({ active }: ParallaxExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!active || !rootRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65, ease: 'power2.out' });

      gsap.to('.water-film', {
        scale: 1.12,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.editorial-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 78%',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.chapter-media').forEach((element, index) => {
        gsap.to(element, {
          yPercent: index % 2 === 0 ? -7 : 6,
          rotateX: index % 2 === 0 ? 2 : -2,
          rotateY: index % 2 === 0 ? -2 : 2,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.tilt-plane').forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            '--tilt-blur': '9px',
            '--tilt-focus': '46%',
            rotateX: index % 2 === 0 ? 5 : -5,
            rotateY: index % 2 === 0 ? -4 : 4,
          },
          {
            '--tilt-blur': '2px',
            '--tilt-focus': '56%',
            rotateX: 0,
            rotateY: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              end: 'bottom 24%',
              scrub: true,
            },
          },
        );
      });
    }, rootRef);

    return () => context.revert();
  }, [active]);

  return (
    <section className={`parallax-experience ${active ? 'is-visible' : ''}`} ref={rootRef} aria-hidden={!active}>
      <div className="water-backdrop" aria-hidden="true">
        <video
          className="water-film"
          autoPlay
          loop
          muted
          playsInline
          poster={cinematicAssets.waterPoster}
          src={cinematicAssets.waterVideo}
        />
        <div className="water-grade" />
      </div>

      <section className="editorial-hero">
        <div className="hero-image hero-image--wide tilt-plane" aria-hidden="true">
          <img src={cinematicAssets.waterPortrait} alt="" />
          <span className="tilt-lens" />
        </div>
        <div className="hero-copy">
          <p className="chapter-kicker">
            <EyeOff aria-hidden="true" size={18} />
            Private reveal
          </p>
          <h1>{eventPayload.celebrant}</h1>
          <p>
            A secret birthday room, a welcome film, and a single rule: arrive before the hush, then let Chloe walk
            into the impossible.
          </p>
        </div>
        <div className="hero-image hero-image--portrait tilt-plane" aria-label="Chloe editorial portrait">
          <img src={cinematicAssets.editorialPortrait} alt="Chloe underwater editorial portrait" />
          <span className="tilt-lens" />
        </div>
      </section>

      <section className="chapter-index editorial-reveal" aria-label="Invitation chapters">
        {editorialChapters.map((chapter, index) => (
          <article className="chapter-tile" key={chapter.title}>
            <span>{chapter.eyebrow}</span>
            <strong>{chapter.title}</strong>
            <small>{String(index + 1).padStart(2, '0')}</small>
          </article>
        ))}
      </section>

      <div className="editorial-stack">
        <section className="feature-chapter editorial-reveal tilt-plane">
          <div className="chapter-copy">
            <p className="chapter-kicker">{editorialChapters[1].eyebrow}</p>
            <h2>{editorialChapters[1].title}</h2>
            <p>{editorialChapters[1].copy}</p>
          </div>
          <div className="chapter-media-frame">
            <img className="chapter-media" src={cinematicAssets.waterPortrait} alt="Chloe floating in water wearing orange" />
            <span className="tilt-lens" />
          </div>
        </section>

        <section className="logistics-run editorial-reveal" aria-label="Event logistics">
          {logistics.map(({ icon: Icon, label, value }, index) => (
            <article className="detail-tile" key={label}>
              <Icon aria-hidden="true" size={20} />
              <span>{label}</span>
              <p>{value}</p>
              <small>{String(index + 1).padStart(2, '0')}</small>
            </article>
          ))}
        </section>

        <section className="arrival-chapter editorial-reveal tilt-plane">
          <div className="chapter-media-frame chapter-media-frame--portrait">
            <img className="chapter-media" src={cinematicAssets.sourcePortrait} alt="Chloe smiling portrait" />
            <span className="tilt-lens" />
          </div>
          <div className="chapter-copy">
            <p className="chapter-kicker">{editorialChapters[2].eyebrow}</p>
            <h2>{editorialChapters[2].title}</h2>
            <p>{editorialChapters[2].copy}</p>
            <div className="timeline-list">
              {celebrationTimeline.map((item) => (
                <article className="timeline-card" key={item.time}>
                  <span>{item.time}</span>
                  <h3>{item.label}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="map-section editorial-reveal tilt-plane" aria-label="Venue directions">
          <div className="map-copy">
            <p className="chapter-kicker">{editorialChapters[3].eyebrow}</p>
            <h2>{mapPayload.venueName}</h2>
            <p>{mapPayload.address}</p>
            <strong>{mapPayload.locationNote}</strong>
            <span>{mapPayload.arrivalWarning}</span>
            <a className="directions-button" href={mapPayload.directionsUrl} target="_blank" rel="noreferrer">
              <Navigation aria-hidden="true" size={18} />
              <span>Open Google Maps</span>
            </a>
          </div>
          <div className="map-shell">
            <div className="map-frame">
              <div className="map-fallback" aria-hidden="true">
                <span className="route-line" />
                <span className="route-pin" />
                <span className="route-ring" />
              </div>
              <iframe
                title="Sion Spaces map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapPayload.embedUrl}
              />
            </div>
            <div className="map-glass-card" aria-hidden="true">
              <span>Streatham High Road</span>
              <strong>Inside Black Kitchen</strong>
              <small>21:45 silence window</small>
            </div>
          </div>
        </section>

        <section className="rsvp-chapter editorial-reveal" aria-label="RSVP chapter">
          <div className="chapter-copy">
            <p className="chapter-kicker">{editorialChapters[4].eyebrow}</p>
            <h2>{editorialChapters[4].title}</h2>
            <p>{editorialChapters[4].copy}</p>
          </div>
          <RsvpPanel />
        </section>
      </div>
    </section>
  );
}
