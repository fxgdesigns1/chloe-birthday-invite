import { FormEvent, useMemo, useState } from 'react';
import { MessageCircle, Send, UserRoundCheck } from 'lucide-react';
import { contactPayload, rsvpOptions } from '../data/event';
import { submitRsvp, type RsvpStatus } from '../lib/rsvp';

export function RsvpPanel() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<RsvpStatus>('attending');
  const [guestCount, setGuestCount] = useState(0);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const whatsappHref = useMemo(() => {
    const guestLine = name.trim() ? `My name is ${name.trim()}. ` : '';
    const contactLine = contact.trim() ? `My contact is ${contact.trim()}. ` : '';
    const noteLine = note.trim() ? `Note: ${note.trim()}. ` : '';
    const guestCountLine = guestCount > 0 ? `I am bringing ${guestCount} guest(s). ` : 'No extra guests. ';
    const responseLine = status === 'attending' ? 'I am attending.' : `My RSVP status is ${status}.`;
    const text = `Hi Hannah, please add me to Chloe's birthday guestlist. ${guestLine}${contactLine}${guestCountLine}${noteLine}${responseLine}`;

    return `https://wa.me/447944545322?text=${encodeURIComponent(text)}`;
  }, [contact, guestCount, name, note, status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await submitRsvp({
        name,
        contact,
        status,
        guestCount,
        note,
      });
      setMessage(`Locked: ${response.rsvp.name} is logged for Chloe's surprise.`);
      setName('');
      setContact('');
      setStatus('attending');
      setGuestCount(0);
      setNote('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rsvp-panel" onSubmit={handleSubmit}>
      <div className="panel-kicker">
        <UserRoundCheck aria-hidden="true" size={18} />
        <span>RSVP WITH HANNAH</span>
      </div>
      <p className="rsvp-intro">
        Submit here for the local guest log, then tap WhatsApp so {contactPayload.hostName} gets the names directly.
      </p>
      <div className="field-grid">
        <label>
          Name
          <input required value={name} maxLength={80} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Contact
          <input value={contact} maxLength={160} onChange={(event) => setContact(event.target.value)} />
        </label>
      </div>
      <fieldset className="segmented-control">
        <legend>Response</legend>
        {rsvpOptions.map((option) => (
          <label key={option.value}>
            <input
              checked={status === option.value}
              name="status"
              type="radio"
              value={option.value}
              onChange={() => setStatus(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <label>
        Guest Count
        <input
          min={0}
          max={6}
          type="number"
          value={guestCount}
          onChange={(event) => setGuestCount(Number(event.target.value))}
        />
      </label>
      <label>
        Note
        <textarea value={note} maxLength={280} rows={3} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button className="submit-rsvp" type="submit" disabled={isSubmitting}>
        <Send aria-hidden="true" size={18} />
        <span>{isSubmitting ? 'Logging' : 'Log RSVP'}</span>
      </button>
      <a className="whatsapp-rsvp" href={whatsappHref || contactPayload.whatsappUrl} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" size={19} />
        <span>Message Hannah on WhatsApp</span>
      </a>
      <p className="host-contact">Hannah: {contactPayload.displayPhone}</p>
      {message ? <p className="rsvp-message">{message}</p> : null}
    </form>
  );
}
