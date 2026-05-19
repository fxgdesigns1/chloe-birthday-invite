export const eventPayload = {
  headline: 'THE SURPRISE TURN UP',
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
  arrivalWarning: 'Arrive by 21:45 or the surprise is at risk.',
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodedVenue}`,
  embedUrl: `https://www.google.com/maps?q=${encodedVenue}&output=embed`,
} as const;

export const luxuryDirection = {
  mood: 'private luxury editorial reveal',
  motion: 'full-bleed cinematic chapters with restrained, expensive transitions',
  typography: 'oversized serif titles with minimal interface chrome',
} as const;

export const editorialChapters = [
  {
    eyebrow: 'Chapter I',
    title: 'The Private Welcome',
    copy: 'A personal message from Chloe opens the night, framed like a private film premiere.',
    asset: cinematicAssets.introVideo,
  },
  {
    eyebrow: 'Chapter II',
    title: 'The Water Arrival',
    copy: 'Cyan water, orange light, and a floating editorial portrait set the dress-code mood.',
    asset: cinematicAssets.waterPortrait,
  },
  {
    eyebrow: 'Chapter III',
    title: 'The Reveal',
    copy: 'The room stays quiet until Chloe arrives. Then the whole night turns cinematic.',
    asset: cinematicAssets.editorialPortrait,
  },
  {
    eyebrow: 'Chapter IV',
    title: 'The Coordinates',
    copy: 'Sion Spaces, inside Black Kitchen. Arrive before 21:45 so the surprise lands cleanly.',
    asset: cinematicAssets.sourcePortrait,
  },
  {
    eyebrow: 'Final Chapter',
    title: 'The RSVP',
    copy: 'Names go to Hannah on WhatsApp, with a local guest log as backup.',
    asset: cinematicAssets.sourcePortrait,
  },
] as const;

export const transmission = {
  videoSource: cinematicAssets.introVideo,
  posterSource: cinematicAssets.introPoster,
  secretLine:
    'Chloe has sent the welcome. Now keep the surprise sealed until she walks in.',
} as const;

export const celebrationTimeline = [
  {
    time: '21:00',
    label: 'Doors Open',
    detail: 'The room warms up, drinks land, and the surprise stays sealed.',
  },
  {
    time: '21:45',
    label: 'Lockdown',
    detail: 'Strict arrival policy. Once Chloe is en route, the timeline closes.',
  },
  {
    time: '22:00',
    label: 'Signal Drop',
    detail: 'The reveal hits. Cameras ready, voices low, energy high.',
  },
  {
    time: 'Late',
    label: 'Turn Up',
    detail: 'High-fashion birthday chaos, clean fits only, no lounge energy.',
  },
] as const;

export const rsvpOptions = [
  { value: 'attending', label: 'Attending' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'declined', label: 'Declined' },
] as const;
