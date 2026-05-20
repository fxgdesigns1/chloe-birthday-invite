import { describe, expect, it } from 'vitest';
import { SOULFUL_HOUSE_AMBIENCE } from './audio';

describe('soulful house ambience', () => {
  it('defines an original louder-but-soft house groove instead of a copyrighted track', () => {
    expect(SOULFUL_HOUSE_AMBIENCE.bpm).toBe(122);
    expect(SOULFUL_HOUSE_AMBIENCE.masterLevel).toBeGreaterThan(0.18);
    expect(SOULFUL_HOUSE_AMBIENCE.disclaimer).toContain('original');
    expect(SOULFUL_HOUSE_AMBIENCE.disclaimer).not.toContain('Kelvin Momo');
    expect(SOULFUL_HOUSE_AMBIENCE.disclaimer).not.toContain('Fool Me');
  });

  it('includes four-on-the-floor kick, offbeat hats, and warm chord notes', () => {
    expect(SOULFUL_HOUSE_AMBIENCE.kickSteps).toEqual([0, 4, 8, 12]);
    expect(SOULFUL_HOUSE_AMBIENCE.hatSteps.length).toBeGreaterThanOrEqual(4);
    expect(SOULFUL_HOUSE_AMBIENCE.chordNotes.length).toBeGreaterThanOrEqual(4);
  });
});
