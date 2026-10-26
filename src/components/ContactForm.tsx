import { useState, type SubmitEvent } from 'react';

interface Props {
  endpoint: string;
}

type Field = 'name' | 'email' | 'subject' | 'message';
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const value = (key: Field) => String(data.get(key) ?? '').trim();
  if (!value('name')) errors.name = 'Please enter your name.';
  if (!value('email')) errors.email = 'Please enter your email.';
  else if (!EMAIL.test(value('email'))) errors.email = 'Please enter a valid email address.';
  if (!value('subject')) errors.subject = 'Please add a subject.';
  if (!value('message')) errors.message = 'Please write a message.';
  return errors;
}

export default function ContactForm({ endpoint }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const connected = endpoint.startsWith('https://');

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    // Bots fill the hidden field; people never see it.
    if (data.get('company')) return;
    if (!connected) {
      setStatus('failed');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-card border border-white/15 bg-white/5 p-8">
        <p className="font-display text-h3 text-white">Thanks for reaching out!</p>
        <p className="mt-2 text-white/75">We got your message and will get back to you soon.</p>
      </div>
    );
  }

  const input =
    'mt-2 block min-h-12 w-full rounded-button border bg-white/5 px-4 text-white placeholder:text-white/40 transition duration-200 focus:border-accent focus:bg-white/10 focus:outline-none';

  const field = (name: Field, label: string, type = 'text', autoComplete?: string) => (
    <div>
      <label htmlFor={`contact-${name}`} className="text-small font-medium text-white/85">
        {label}
      </label>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={errors[name] ? 'true' : undefined}
        aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
        className={`${input} ${errors[name] ? 'border-[#f8a5a5]' : 'border-white/15'}`}
      />
      {errors[name] && (
        <p id={`contact-${name}-error`} className="mt-1.5 text-small text-[#f8a5a5]">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      {field('name', 'Name', 'text', 'name')}
      {field('email', 'Email', 'email', 'email')}
      <div className="sm:col-span-2">{field('subject', 'Subject')}</div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="text-small font-medium text-white/85">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${input} py-3 ${errors.message ? 'border-[#f8a5a5]' : 'border-white/15'}`}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-small text-[#f8a5a5]">
            {errors.message}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-12 items-center justify-center rounded-button bg-white px-6 text-small font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-accent-on-brand disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'failed' && (
          <p role="alert" className="text-small text-[#f8a5a5]">
            {connected
              ? 'Something went wrong. Please try again, or message us on Instagram.'
              : 'This form is not connected yet. Please message us on Instagram or LinkedIn for now.'}
          </p>
        )}
      </div>
    </form>
  );
}
