# Chloe Photo Orbit Invite Redesign Design

## Intent

Upgrade `chloe-hologram-v3` into a higher-impact birthday invite centered on Chloe's photos. The experience should feel like a private visual transmission: guests activate the invite, Chloe's images orbit and reveal the event, then the practical details stay clear enough that nobody misses the surprise timing.

The previous 3D terrain map idea is out of scope. The redesign will include a normal map/directions section that is visually polished, low-risk, and does not require Google Maps Platform billing or API keys.

## Architecture

Keep the existing React + Vite app, Express RSVP API, and stage-based client flow. The main client stages become:

1. `activation`: a refined portal/activation gate.
2. `photoOrbit`: a Three.js orbit of Chloe images replacing the missing-video hologram dependency.
3. `invite`: the revealed event interface with logistics, RSVP, photo moments, and map/directions.

The backend remains the lightweight Express RSVP service with JSONL persistence. No new paid map API or server-side map proxy is required.

## Visual System

The redesign uses Chloe's photos as the primary visual asset. The palette remains midnight, orange, cyan, and ivory, but the UI should feel more premium and less panel-heavy than the current build.

The first visual beat is a full-screen portal: a central Chloe image surrounded by rotating image shards, scanlines, and soft holographic rings. The post-reveal interface should be editorial and clear, with big image moments, restrained cards, strong type hierarchy, and a loud secrecy/arrival warning.

## Experience Flow

The guest taps the activation gate. Ambient audio may still unlock if available, but the invite must not depend on audio.

The photo orbit animates in Three.js. Images rotate around a central Chloe portrait, then expand outward to transition into the invite content.

The invite content appears in this order:

1. Chloe-first headline and surprise warning.
2. Date, arrival deadline, location, and dress code.
3. A polished map/directions block.
4. RSVP form.
5. Photo ribbon or memory section.

## Map And Directions

Use a normal, cost-safe maps experience:

- Display the venue inside a styled map card using an iframe embed or static preview that does not require a paid API key.
- Include the venue name, full address, and "Inside Black Kitchen" note beside or over the map.
- Include a prominent `Open Google Maps` button using a standard directions URL:
  `https://www.google.com/maps/dir/?api=1&destination=Sion%20Spaces%2C%20426-428%20Streatham%20High%20Road%2C%20London%20SW16%203PX`
- Show the arrival deadline as part of the map block: `Arrive by 21:45 or the surprise is at risk.`
- Use visual status language without live ETA: green/tick for "arrive before 21:45" messaging and orange/red warning for "late arrival ruins the surprise."

The map block should look integrated with the invite: dark glass frame, orange route accent, cyan pin glow, and clear action buttons. It should not require location permission, Google billing, Routes API, Map Tiles API, or a custom API key.

## RSVP

Keep the existing local RSVP flow and validation. Restyle the form so it feels like part of the private invite rather than a generic form. Preserve the same fields unless implementation reveals a small usability improvement.

## Error Handling

If any Chloe image fails to load, the photo orbit should still render with the remaining images and show a graceful fallback for the central image.

If the map iframe or preview fails to load, the venue address and `Open Google Maps` button must remain visible.

If RSVP submission fails, show the existing inline error style inside the RSVP section without blocking the rest of the invite.

## Testing

Extend the existing tests where behavior changes:

- Event data tests should include the Google Maps directions URL and arrival deadline text.
- Component-level tests can cover the map link target if the local test setup supports it.
- Existing RSVP server tests must continue to pass.

Manual/browser verification must cover:

- Activation to photo orbit to invite reveal.
- Desktop and mobile layout.
- Map section remains usable without API keys.
- RSVP form still submits to the local server.
