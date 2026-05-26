import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BIRTHDAY_MUSIC_LOOP, createBirthdayMusicElement } from './audio';

describe('birthday background music', () => {
  it('uses the supplied instrumental MP3 instead of the generated Web Audio hum', () => {
    const audioSource = readFileSync(join(process.cwd(), 'src/lib/audio.ts'), 'utf8');

    expect(BIRTHDAY_MUSIC_LOOP.src).toBe('./assets/audio/ll-cool-j-loungin-instrumental.mp3');
    expect(BIRTHDAY_MUSIC_LOOP.title).toBe('LL Cool J - Loungin Who Do Ya Luv Instrumental');
    expect(BIRTHDAY_MUSIC_LOOP.volume).toBeGreaterThan(0.2);
    expect(BIRTHDAY_MUSIC_LOOP.volume).toBeLessThanOrEqual(0.65);
    expect(existsSync(join(process.cwd(), 'public/assets/audio/ll-cool-j-loungin-instrumental.mp3'))).toBe(true);
    expect(audioSource).not.toContain('createOscillator');
    expect(audioSource).not.toContain('AudioContext');
  });

  it('creates a looped background audio element with a controlled volume', () => {
    const fakeAudio = {
      dataset: {},
      loop: false,
      preload: '',
      src: '',
      volume: 1,
    };
    const fakeDocument = {
      createElement: () => fakeAudio,
    };

    const audio = createBirthdayMusicElement(fakeDocument as unknown as Pick<Document, 'createElement'>);

    expect(audio.src).toBe(BIRTHDAY_MUSIC_LOOP.src);
    expect(audio.loop).toBe(true);
    expect(audio.preload).toBe('auto');
    expect(audio.volume).toBe(BIRTHDAY_MUSIC_LOOP.volume);
    expect(audio.dataset.backgroundMusic).toBe('chloe-birthday-loop');
  });

  it('uses music-specific fallback copy if playback is blocked', () => {
    const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

    expect(appSource).toContain('Music channel unavailable. Visual link remains active.');
    expect(appSource).not.toContain('Ambient channel unavailable');
  });
});
