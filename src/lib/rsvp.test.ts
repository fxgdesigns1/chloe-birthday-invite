import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitRsvp } from './rsvp';

const payload = {
  name: 'Maya',
  contact: 'maya@example.com',
  status: 'attending' as const,
  guestCount: 1,
  note: 'Can’t wait',
};

describe('submitRsvp', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to a local confirmation when the public static site has no API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const response = await submitRsvp(payload);

    expect(response.rsvp.id).toMatch(/^local-/);
    expect(response.rsvp.name).toBe('Maya');
    expect(response.rsvp.createdAt).toBeTruthy();
  });
});
