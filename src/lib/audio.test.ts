import { describe, expect, it } from 'vitest';
import { AMAPIANO_AMBIENCE } from './audio';

describe('amapiano-inspired ambience', () => {
  it('defines an original low-volume lounge groove instead of a copyrighted track', () => {
    expect(AMAPIANO_AMBIENCE.bpm).toBe(112);
    expect(AMAPIANO_AMBIENCE.disclaimer).toContain('original');
    expect(AMAPIANO_AMBIENCE.disclaimer).not.toContain('Kelvin Momo');
    expect(AMAPIANO_AMBIENCE.disclaimer).not.toContain('Fool Me');
  });

  it('includes soft log drum and shaker steps for a smooth party feel', () => {
    expect(AMAPIANO_AMBIENCE.logDrumSteps.length).toBeGreaterThanOrEqual(4);
    expect(AMAPIANO_AMBIENCE.shakerSteps.length).toBeGreaterThanOrEqual(8);
  });
});
