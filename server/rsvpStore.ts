import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export type RsvpStatus = 'attending' | 'maybe' | 'declined';

export type RsvpInput = {
  name: string;
  contact?: string;
  status: RsvpStatus;
  guestCount?: number;
  note?: string;
};

export type RsvpRecord = {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  status: RsvpStatus;
  guestCount: number;
  note: string;
};

export type RsvpStore = {
  record: (input: RsvpInput) => Promise<RsvpRecord>;
  list: () => Promise<RsvpRecord[]>;
};

const cleanText = (value: string | undefined) => (value ?? '').trim();

export function createRsvpStore(filePath: string): RsvpStore {
  return {
    async record(input) {
      const record: RsvpRecord = {
        id: `rsvp_${randomUUID()}`,
        createdAt: new Date().toISOString(),
        name: cleanText(input.name),
        contact: cleanText(input.contact),
        status: input.status,
        guestCount: input.guestCount ?? 0,
        note: cleanText(input.note),
      };

      await mkdir(path.dirname(filePath), { recursive: true });
      await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');

      return record;
    },

    async list() {
      try {
        const contents = await readFile(filePath, 'utf8');

        return contents
          .split('\n')
          .filter(Boolean)
          .map((line) => JSON.parse(line) as RsvpRecord)
          .reverse();
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          return [];
        }

        throw error;
      }
    },
  };
}
