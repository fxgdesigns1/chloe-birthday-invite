import { ExternalLink, Ticket } from 'lucide-react';
import { rsvpPayload } from '../data/event';

export function RsvpPanel() {
  return (
    <section className="rsvp-panel" aria-label="RSVP on Eventbrite">
      <div className="panel-kicker">
        <Ticket aria-hidden="true" size={18} />
        <span>RSVP ON EVENTBRITE</span>
      </div>
      <p className="rsvp-intro">
        Reserve your place for Chloe Secret Birthday Soiree through the live Eventbrite checkout.
      </p>
      <a className="eventbrite-rsvp" href={rsvpPayload.ticketUrl} target="_blank" rel="noreferrer">
        <ExternalLink aria-hidden="true" size={18} />
        <span>Open Eventbrite RSVP</span>
      </a>
      <p className="rsvp-message">Event ID: {rsvpPayload.eventId}</p>
    </section>
  );
}
