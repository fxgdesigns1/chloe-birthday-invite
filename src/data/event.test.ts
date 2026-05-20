import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  cinematicAssets,
  contactPayload,
  editorialChapters,
  eventPayload,
  imageFragments,
  luxuryDirection,
  mapPayload,
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
    expect(cinematicAssets.waterVideo).toBe('./assets/media/water/chloe-floating-water.mp4');
    expect(cinematicAssets.waterPoster).toBe('./assets/media/water/chloe-floating-water-preview.gif');
    expect(cinematicAssets.waterPortrait).toBe('./assets/media/water/chloe-floating-portrait.jpg');
    expect(cinematicAssets.editorialPortrait).toBe('./assets/media/editorial/chloe-editorial-regal.jpg');
  });

  it('restores Hannah as the WhatsApp RSVP contact', () => {
    expect(contactPayload.hostName).toBe('Hannah');
    expect(contactPayload.displayPhone).toBe('07944545322');
    expect(contactPayload.whatsappUrl).toContain('https://wa.me/447944545322');
    expect(decodeURIComponent(contactPayload.whatsappUrl)).toContain("Chloe's birthday guestlist");
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
      motion: 'tilt-shift scroll depth, cinematic parallax, and full-bleed chapter reveals',
      typography: 'high-contrast editorial display type with compact luxury interface labels',
    });
  });

  it('maps the invite into premium editorial chapters with sharper titles', () => {
    expect(editorialChapters.map((chapter) => chapter.title)).toEqual([
      'The Whisper',
      'The Water Room',
      'The Arrival Lock',
      'The Hidden Address',
      'The List',
    ]);
    expect(editorialChapters[1].copy).toContain('tilt-shift');
    expect(editorialChapters[3].copy).toContain('Black Kitchen');
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.introVideo);
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.waterPortrait);
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.editorialPortrait);
    expect(editorialChapters.map((chapter) => chapter.asset)).toContain(cinematicAssets.sourcePortrait);
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
