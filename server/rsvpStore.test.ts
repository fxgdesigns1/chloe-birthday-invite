import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRsvpStore } from './rsvpStore';

let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(path.join(tmpdir(), 'chloe-rsvp-'));
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

describe('createRsvpStore', () => {
  it('records RSVP responses as durable JSON lines with normalized fields', async () => {
    const filePath = path.join(workspace, 'rsvps.jsonl');
    const store = createRsvpStore(filePath);

    const saved = await store.record({
      name: '  Maya Jones  ',
      contact: '  maya@example.com ',
      status: 'attending',
      guestCount: 2,
      note: '  Bringing good energy. ',
    });

    expect(saved.id).toMatch(/^rsvp_/);
    expect(saved.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(saved).toMatchObject({
      name: 'Maya Jones',
      contact: 'maya@example.com',
      status: 'attending',
      guestCount: 2,
      note: 'Bringing good energy.',
    });

    const lines = (await readFile(filePath, 'utf8')).trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0])).toMatchObject(saved);
  });

  it('reads existing RSVP responses in newest-first order', async () => {
    const filePath = path.join(workspace, 'rsvps.jsonl');
    const store = createRsvpStore(filePath);

    const first = await store.record({
      name: 'Iris',
      contact: '',
      status: 'maybe',
      guestCount: 0,
      note: '',
    });
    const second = await store.record({
      name: 'Nia',
      contact: 'nia@example.com',
      status: 'attending',
      guestCount: 1,
      note: 'No dust.',
    });

    await expect(store.list()).resolves.toEqual([second, first]);
  });
});
