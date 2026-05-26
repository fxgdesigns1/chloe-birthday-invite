import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  cinematicAssets,
  contactPayload,
  editorialChapters,
  eventPayload,
  imageFragments,
  luxuryDirection,
  mapPayload,
  rsvpPayload,
} from './event';

describe('event payload', () => {
  it('preserves the Chloe surprise logistics exactly', () => {
    expect(eventPayload.headline).toBe('THE ROOM HOLDS ITS BREATH');
    expect(eventPayload.celebrant).toBe('CHLOE');
    expect(eventPayload.logistics).toEqual({
      date: 'Saturday, 4th July 2026',
      doors: '21:00',
      lockdown: '21:45 (Strict arrival policy)',
      location: 'Sion Spaces, 426-428 Streatham High Road, London, SW16 3PX (Located inside Black Kitchen)',
      dressCode: 'Smart Casual - High Fashion Editorial. No casual lounge/dusty clothing permitted.',
    });
  });

  it('references ten Chloe image fragments for the parallax background', () => {
    expect(imageFragments).toHaveLength(10);
    expect(imageFragments[0]).toBe('./assets/chloe_1.jpg');
    expect(imageFragments[9]).toBe('./assets/chloe_10.jpg');
  });

  it('exposes the cinematic media supplied for the invite', () => {
    expect(cinematicAssets.introVideo).toBe('./assets/media/intro/chloe-welcome.mp4');
    expect(cinematicAssets.introPoster).toBe('./assets/media/intro/chloe-welcome-preview.gif');
    expect(cinematicAssets.floralBackdrop).toBe('./assets/media/floral/chloe-floral-bloom.png');
    expect(cinematicAssets.waterVideo).toBe('./assets/media/water/chloe-floating-water.mp4');
    expect(cinematicAssets.waterPoster).toBe('./assets/media/water/chloe-floating-water-preview.gif');
    expect(cinematicAssets.waterPortrait).toBe('./assets/media/water/chloe-floating-portrait.jpg');
    expect(cinematicAssets.editorialPortrait).toBe('./assets/media/editorial/chloe-editorial-regal.jpg');
    expect(existsSync(join(process.cwd(), 'public/assets/media/floral/chloe-floral-bloom.png'))).toBe(true);
  });

  it('restores Hannah as the WhatsApp RSVP contact', () => {
    expect(contactPayload.hostName).toBe('Hannah');
    expect(contactPayload.displayPhone).toBe('07944545322');
    expect(contactPayload.whatsappUrl).toContain('https://wa.me/447944545322');
    expect(decodeURIComponent(contactPayload.whatsappUrl)).toContain("Chloe's birthday guestlist");
  });

  it('uses the direct Eventbrite checkout as the RSVP destination', () => {
    const rsvpSource = readFileSync(join(process.cwd(), 'src/components/RsvpPanel.tsx'), 'utf8');

    expect(rsvpPayload.eventId).toBe('1989983650668');
    expect(rsvpPayload.ticketUrl).toContain('chloe-secret-birthday-soiree-tickets-1989983650668');
    expect(rsvpSource).not.toContain('EBWidgets.createWidget');
    expect(rsvpSource).not.toContain('iframe');
    expect(rsvpSource).toContain('Open Eventbrite RSVP');
    expect(rsvpSource).not.toContain('submitRsvp');
    expect(rsvpSource).not.toContain('Message Hannah on WhatsApp');
  });

  it('keeps a no-key map directions URL for the venue', () => {
    expect(mapPayload.venueName).toBe('Sion Spaces');
    expect(mapPayload.directionsUrl).toContain('https://www.google.com/maps/dir/?api=1');
    expect(mapPayload.embedUrl).toContain('output=embed');
    expect(mapPayload.arrivalWarning).toBe('Be inside by 21:45. After that, the room goes quiet.');
  });

  it('defines a revolutionary editorial direction based on the supplied reference video', () => {
    expect(luxuryDirection).toEqual({
      mood: 'private luxury editorial reveal with museum-grade restraint',
      motion: 'floral bloom motion, cinematic parallax, and full-bleed birthday reveals',
      typography: 'high-contrast editorial display type with compact luxury interface labels',
    });
  });

  it('maps the invite into warm Chloe birthday chapters without placeholder copy', () => {
    expect(editorialChapters.map((chapter) => chapter.title)).toEqual([
      'A Welcome For Chloe',
      'Birthday Glow',
      'The Surprise Moment',
      'Where We Gather',
      'Save Your Place',
    ]);
    expect(editorialChapters[1].copy).toContain('This room is for Chloe');
    expect(editorialChapters[2].copy).toContain('love');
    expect(editorialChapters[3].copy).toContain('Black Kitchen');
    expect(editorialChapters.map((chapter) => `${chapter.title} ${chapter.copy}`).join(' ')).not.toContain('Water Room');
    expect(editorialChapters.map((chapter) => chapter.copy).join(' ')).not.toContain('tilt-shift');
    expect(editorialChapters.map((chapter) => chapter.copy).join(' ')).not.toContain('dress-code mood');
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.introVideo);
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.waterPortrait);
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.editorialPortrait);
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.sourcePortrait);
  });

  it('renders a touched-up animated floral atmosphere behind the opening stages', () => {
    const activationSource = readFileSync(join(process.cwd(), 'src/components/ActivationGate.tsx'), 'utf8');
    const hologramSource = readFileSync(join(process.cwd(), 'src/components/HologramStage.tsx'), 'utf8');
    const stylesSource = readFileSync(join(process.cwd(), 'src/styles.css'), 'utf8');

    expect(activationSource).toContain('floral-atmosphere');
    expect(hologramSource).toContain('floral-atmosphere');
    expect(stylesSource).toContain('@keyframes floral-drift');
    expect(stylesSource).toContain('@keyframes petal-drift');
    expect(stylesSource).toContain('prefers-reduced-motion: reduce');
  });

  it('removes the bottom memory gallery from the invitation page', () => {
    const parallaxSource = readFileSync(join(process.cwd(), 'src/components/ParallaxExperience.tsx'), 'utf8');

    expect(parallaxSource).not.toContain('memory-gallery');
    expect(parallaxSource).not.toContain('memory-strip');
  });

  it('keeps the venue map readable instead of decorative-only', () => {
    const parallaxSource = readFileSync(join(process.cwd(), 'src/components/ParallaxExperience.tsx'), 'utf8');

    expect(parallaxSource).toContain('map-venue-card');
    expect(parallaxSource).toContain('Sion Spaces, Streatham');
    expect(parallaxSource).not.toContain('route-line');
    expect(parallaxSource).not.toContain('route-pin');
  });
});
