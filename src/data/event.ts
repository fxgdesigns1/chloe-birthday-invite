export const eventPayload = {
  headline: 'THE ROOM HOLDS ITS BREATH',
  celebrant: 'CHLOE',
  logistics: {
    date: 'Saturday, 4th July 2026',
    doors: '21:00',
    lockdown: '21:45 (Strict arrival policy)',
    location: 'Sion Spaces, 426-428 Streatham High Road, London, SW16 3PX (Located inside Black Kitchen)',
    dressCode: 'Smart Casual - High Fashion Editorial. No casual lounge/dusty clothing permitted.',
  },
} as const;

export const imageFragments = Array.from(
  { length: 10 },
  (_, index) => `/assets/chloe_${index + 1}.jpg`,
);

export const cinematicAssets = {
  introVideo: '/assets/media/intro/chloe-welcome.mp4',
  introPoster: '/assets/media/intro/chloe-welcome-preview.gif',
  waterVideo: '/assets/media/water/chloe-floating-water.mp4',
  waterPoster: '/assets/media/water/chloe-floating-water-preview.gif',
  waterPortrait: '/assets/media/water/chloe-floating-portrait.jpg',
  editorialPortrait: '/assets/media/editorial/chloe-editorial-regal.jpg',
  sourcePortrait: '/assets/media/editorial/chloe-source-screenshot.jpg',
} as const;

export const contactPayload = {
  hostName: 'Hannah',
  displayPhone: '07944545322',
  whatsappUrl:
    "https://wa.me/447944545322?text=Hi%20Hannah%2C%20please%20add%20my%20guest%20names%20to%20Chloe's%20birthday%20guestlist.",
} as const;

const encodedVenue = 'Sion%20Spaces%2C%20426-428%20Streatham%20High%20Road%2C%20London%20SW16%203PX';

export const mapPayload = {
  venueName: 'Sion Spaces',
  address: '426-428 Streatham High Road, London, SW16 3PX',
  locationNote: 'Located inside Black Kitchen',
  arrivalWarning: 'Be inside by 21:45. After that, the room goes quiet.',
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodedVenue}`,
  embedUrl: `https://www.google.com/maps?q=${encodedVenue}&output=embed`,
} as const;

export const luxuryDirection = {
  mood: 'private luxury editorial reveal with museum-grade restraint',
  motion: 'tilt-shift scroll depth, cinematic parallax, and full-bleed chapter reveals',
  typography: 'high-contrast editorial display type with compact luxury interface labels',
} as const;

export const editorialChapters = [
  {
    eyebrow: 'Chapter I',
    title: 'The Whisper',
    copy: 'Chloe opens the invitation in a private welcome film. Watch it, keep it quiet, then step through.',
    asset: cinematicAssets.introVideo,
  },
  {
    eyebrow: 'Chapter II',
    title: 'The Water Room',
    copy: 'A tilt-shift water chapter turns cyan light, orange fabric, and slow motion into the dress-code mood.',
    asset: cinematicAssets.waterPortrait,
  },
  {
    eyebrow: 'Chapter III',
    title: 'The Arrival Lock',
    copy: 'The room holds its breath until Chloe arrives. No late entrances. No spoilers. Just the reveal.',
    asset: cinematicAssets.editorialPortrait,
  },
  {
    eyebrow: 'Chapter IV',
    title: 'The Hidden Address',
    copy: 'Sion Spaces, inside Black Kitchen. The map stays cinematic, but the route is one tap away.',
    asset: cinematicAssets.sourcePortrait,
  },
  {
    eyebrow: 'Final Chapter',
    title: 'The List',
    copy: 'RSVP with Hannah on WhatsApp. The guest list closes when the surprise timeline begins.',
    asset: cinematicAssets.sourcePortrait,
  },
] as const;

export const transmission = {
  videoSource: cinematicAssets.introVideo,
  posterSource: cinematicAssets.introPoster,
  secretLine:
    'A private welcome from Chloe, then the invite unlocks. Keep the room quiet until she walks in.',
} as const;

export const celebrationTimeline = [
  {
    time: '21:00',
    label: 'Doors',
    detail: 'Arrive clean, settle in, and keep the surprise sealed.',
  },
  {
    time: '21:45',
    label: 'Lock',
    detail: 'The door policy tightens. Once Chloe is en route, the reveal is protected.',
  },
  {
    time: '22:00',
    label: 'Reveal',
    detail: 'Lights, phones, voices, then the birthday moment lands.',
  },
  {
    time: 'Late',
    label: 'Afterglow',
    detail: 'High-fashion birthday energy. Smart casual, no lounge energy.',
  },
] as const;

export const rsvpOptions = [
  { value: 'attending', label: 'Attending' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'declined', label: 'Declined' },
] as const;
