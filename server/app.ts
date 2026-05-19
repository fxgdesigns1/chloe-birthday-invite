import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { createRsvpStore } from './rsvpStore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rsvpPayloadSchema = z.object({
  name: z.string().trim().min(1).max(80),
  contact: z.string().trim().max(160).optional().default(''),
  status: z.enum(['attending', 'maybe', 'declined']),
  guestCount: z.coerce.number().int().min(0).max(6).optional().default(0),
  note: z.string().trim().max(280).optional().default(''),
});

export type CreateAppOptions = {
  rsvpFile?: string;
};

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const store = createRsvpStore(
    options.rsvpFile ?? path.resolve(__dirname, 'data', 'rsvps.jsonl'),
  );

  app.disable('x-powered-by');
  app.use(express.json({ limit: '24kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'chloe-hologram-v3',
    });
  });

  app.post('/api/rsvp', async (request, response, next) => {
    const parsed = rsvpPayloadSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: 'Invalid RSVP payload',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const rsvp = await store.record(parsed.data);
      response.status(201).json({ rsvp });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/rsvps', async (_request, response, next) => {
    try {
      response.json({ rsvps: await store.list() });
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error);
    response.status(500).json({
      error: 'RSVP service unavailable',
    });
  });

  return app;
}
