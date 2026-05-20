export type RsvpStatus = 'attending' | 'maybe' | 'declined';

export type RsvpPayload = {
  name: string;
  contact: string;
  status: RsvpStatus;
  guestCount: number;
  note: string;
};

export type RsvpResponse = {
  rsvp: RsvpPayload & {
    id: string;
    createdAt: string;
  };
};

function createLocalRsvpResponse(payload: RsvpPayload): RsvpResponse {
  return {
    rsvp: {
      ...payload,
      id: `local-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResponse> {
  try {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as RsvpResponse | { error?: string };

    if (!response.ok) {
      throw new Error('error' in body && body.error ? body.error : 'Unable to submit RSVP.');
    }

    return body as RsvpResponse;
  } catch {
    return createLocalRsvpResponse(payload);
  }
}
