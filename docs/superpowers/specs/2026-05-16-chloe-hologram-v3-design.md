# Chloe Hologram V3 Design

## Intent

Build a clean new full-stack invitation app in `chloe-hologram-v3` that opens with a dark activation node, unlocks Web Audio ambience, projects a custom orange hologram video treatment, then drops into a scroll-driven editorial event UI with a local RSVP log.

## Architecture

The client is a React + Vite + Tailwind app. Three.js and React Three Fiber own the hologram canvas, with a shader material consuming `/video/chloe_source.mp4`; if the source video is absent, the app displays an orange fallback transmission and still advances to the main interface. GSAP ScrollTrigger drives the post-hologram parallax layers.

The server is a lightweight Express app on port `4177`. It exposes health, RSVP POST, and RSVP list endpoints, storing responses as JSON lines under `server/data/rsvps.jsonl` so local responses are durable and inspectable.

## Visual System

The experience uses charcoal grid surfaces, neon orange hologram edges, restrained cyan accents, glass containers, large serif editorial headings, and cropped Chloe imagery. The first screen is the actual activation interface, not a landing page.

## Data Flow

Activation click starts an ambient Web Audio loop with a two-second exponential gain fade-in and moves the app into the hologram state. The hologram video end event triggers a GSAP breakdown overlay before revealing the scroll UI. RSVP form submissions POST to `/api/rsvp`, receive an ID and timestamp, and append immediately to the local JSONL log.

## Error Handling

Missing video assets trigger the fallback hologram state rather than a dead screen. RSVP validation rejects empty names, invalid statuses, and invalid guest counts with `400` responses. Client-side RSVP errors appear inside the RSVP panel without blocking the rest of the invite.

## Testing

Vitest covers the RSVP store, Express routes, and event payload constants. Build verification covers TypeScript and Vite bundling. Browser verification checks the local app renders, the activation node exists, and the UI advances.
