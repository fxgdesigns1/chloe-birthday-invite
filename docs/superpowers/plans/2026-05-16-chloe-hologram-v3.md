# Chloe Hologram V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new full-stack holographic invitation app for Chloe with WebGL transmission, GSAP parallax, Web Audio ambience, and local RSVP logging.

**Architecture:** React owns the UX state machine and visual layers, React Three Fiber owns the shader hologram, and Express owns local RSVP persistence. The app degrades gracefully when the requested video file is not present.

**Tech Stack:** React, Vite, Tailwind CSS v4, Three.js, React Three Fiber, GSAP ScrollTrigger, Web Audio API, Node.js, Express, Vitest, Supertest.

---

### Task 1: Scaffold And Tests

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `server/rsvpStore.test.ts`
- Create: `server/routes.test.ts`
- Create: `src/data/event.test.ts`

- [ ] Write tests for RSVP persistence, route validation, and event payload constants.
- [ ] Run `npm test` and verify the expected module-not-found failures before implementation.

### Task 2: Backend RSVP API

**Files:**
- Create: `server/rsvpStore.ts`
- Create: `server/app.ts`
- Create: `server/index.ts`

- [ ] Implement Zod validation for RSVP payloads.
- [ ] Append valid RSVP entries to `server/data/rsvps.jsonl`.
- [ ] Expose `GET /api/health`, `POST /api/rsvp`, and `GET /api/rsvps`.
- [ ] Run `npm test` and verify backend tests pass.

### Task 3: Client State And Assets

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/data/event.ts`
- Create: `src/lib/audio.ts`
- Create: `src/lib/rsvp.ts`
- Create: `src/styles.css`

- [ ] Implement the activation to hologram to parallax state machine.
- [ ] Add Web Audio ambience with exponential two-second gain ramp.
- [ ] Add RSVP submit client.

### Task 4: Hologram And Parallax UI

**Files:**
- Create: `src/components/ActivationGate.tsx`
- Create: `src/components/HologramStage.tsx`
- Create: `src/components/ParallaxExperience.tsx`
- Create: `src/components/RsvpPanel.tsx`
- Create: `src/components/hologram/HologramMesh.tsx`
- Create: `src/components/hologram/shaders.ts`

- [ ] Implement shader vertex distortion, luminance alpha discard, neon orange edges, scanlines, and Fresnel glow.
- [ ] Implement GSAP breakdown and ScrollTrigger parallax.
- [ ] Render copied Chloe images at 0.3x background parallax.

### Task 5: Verification And Server

**Files:**
- Modify as needed based on test/build results.

- [ ] Run `npm install`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Start `npm run dev` and verify local browser rendering.
