import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './app';

let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(path.join(tmpdir(), 'chloe-api-'));
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

describe('RSVP routes', () => {
  it('accepts a valid RSVP and writes it to the configured local log', async () => {
    const rsvpFile = path.join(workspace, 'rsvps.jsonl');
    const app = createApp({ rsvpFile });

    const response = await request(app)
      .post('/api/rsvp')
      .send({
        name: 'Keisha',
        contact: 'keisha@example.com',
        status: 'attending',
        guestCount: 1,
        note: 'Editorial only.',
      })
      .expect(201);

    expect(response.body.rsvp).toMatchObject({
      name: 'Keisha',
      contact: 'keisha@example.com',
      status: 'attending',
      guestCount: 1,
      note: 'Editorial only.',
    });

    const persisted = JSON.parse((await readFile(rsvpFile, 'utf8')).trim());
    expect(persisted.id).toEqual(response.body.rsvp.id);
  });

  it('rejects malformed RSVP payloads without writing a log entry', async () => {
    const rsvpFile = path.join(workspace, 'rsvps.jsonl');
    const app = createApp({ rsvpFile });

    const response = await request(app)
      .post('/api/rsvp')
      .send({
        name: '',
        contact: '',
        status: 'yes',
        guestCount: 14,
        note: '',
      })
      .expect(400);

    expect(response.body.error).toBe('Invalid RSVP payload');
    await expect(readFile(rsvpFile, 'utf8')).rejects.toThrow();
  });

  it('returns a lightweight health payload', async () => {
    const app = createApp({ rsvpFile: path.join(workspace, 'rsvps.jsonl') });

    const response = await request(app).get('/api/health').expect(200);

    expect(response.body).toEqual({
      ok: true,
      service: 'chloe-hologram-v3',
    });
  });
});
