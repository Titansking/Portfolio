import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react';
import { sendContactMessage } from '../../services/api';
import { PROFILE } from '../../content/profile';
import { GITHUB_MARK } from '../../lib/techIcons';
import { Container, Section, SectionHead, Hairline } from '../ui/Section';
import { Reveal } from '../ui/Reveal';

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;

/* Email and phone carry custom glyphs, so this row type is looser than a plain
   list of icon components. */
const CHANNELS: {
  icon?: typeof Mail;
  glyph?: 'github' | 'linkedin';
  label: string;
  value: string;
  href: string | null;
}[] = [
  {
    icon: Mail,
    label: 'Email',
    value: PROFILE.email,
    href: PROFILE.emailHref,
  },
  { icon: Phone, label: 'Phone', value: PROFILE.phone, href: PROFILE.phoneHref },
  {
    glyph: 'github',
    label: 'GitHub',
    value: 'github.com/Titansking',
    href: PROFILE.github,
  },
  {
    glyph: 'linkedin',
    label: 'LinkedIn',
    value: 'in/ashwani-kumar',
    href: PROFILE.linkedin,
  },
  {
    icon: MapPin,
    label: 'Based in',
    value: PROFILE.location,
    href: null,
  },
];

const EMPTY = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const reduce = useReducedMotion();

  const validate = (values: typeof EMPTY): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Enter your name.';
    if (!values.email.trim()) next.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = 'Enter a valid email address, for example name@company.com';
    if (!values.message.trim()) next.message = 'Enter a message.';
    return next;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const field = name as Field;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error on the field being corrected, and drop a stale
    // form-level failure so the message never contradicts the input.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    if (status === 'failed') {
      setStatus('idle');
      setServerMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.getElementById(`field-${Object.keys(found)[0]}`);
      first?.focus();
      return;
    }

    setStatus('sending');
    setServerMessage('');

    const result = await sendContactMessage(values);

    if (result.success) {
      setStatus('sent');
      setServerMessage(result.message);
      setForm(EMPTY);
    } else {
      setStatus('failed');
      setServerMessage(result.message);
    }
  };

  const fieldClass = (field: Field) =>
    `portfolio-input disabled:opacity-60 ${errors[field] ? '!border-danger' : ''}`;

  return (
    <Section id="contact" className="border-t border-hairline">
      <Container>
        <Reveal>
          <SectionHead
            title={
              <>
                Open to a role,
                <br />
                or an <span className="text-accent">interesting problem.</span>
              </>
            }
          />
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Channels first on mobile, because a direct link beats a form for
              anyone who already knows what they want to say. */}
          <Reveal>
            <div>
              <h3 className="font-mono text-[0.75rem] tracking-[0.2em] text-ink-mute uppercase">
                Direct
              </h3>
              <Hairline className="mt-4" />
              <ul>
                {CHANNELS.map(({ icon: Icon, glyph, label, value, href }) => {
                  const inner = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline text-accent">
                        {glyph === 'github' ? (
                          <svg
                            viewBox="0 0 24 24"
                            width={17}
                            height={17}
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d={GITHUB_MARK.path} />
                          </svg>
                        ) : glyph === 'linkedin' ? (
                          <span aria-hidden="true" className="font-display text-sm font-bold tracking-tight">
                            in
                          </span>
                        ) : Icon ? (
                          <Icon size={17} />
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-ink-mute">{label}</span>
                        <span className="mt-0.5 block truncate font-display text-[0.9375rem] font-medium text-ink">
                          {value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={label} className="border-b border-hairline">
                      {href ? (
                        <a
                          href={href}
                          /* Every contact row opens externally, so say so rather
                             than letting the user discover it after the click. */
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="flex min-h-11 cursor-pointer items-center gap-4 py-4 no-underline transition-opacity duration-200 hover:opacity-70"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex min-h-11 items-center gap-4 py-4">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                I read everything that comes in and reply myself, usually within a
                day or two.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={reduce ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    role="status"
                    className="flex items-start gap-3 rounded-[10px] border border-accent/30 bg-accent-wash p-4"
                  >
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-accent" />
                    <p className="flex-1 text-[0.9375rem] text-ink-soft">
                      {serverMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setServerMessage('');
                      }}
                      className="cursor-pointer text-sm font-medium text-accent underline underline-offset-4 hover:no-underline"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : null}

                {status === 'failed' ? (
                  <motion.div
                    key="failed"
                    initial={reduce ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    role="alert"
                    className="flex items-start gap-3 rounded-[10px] border border-danger/40 bg-danger-wash p-4"
                  >
                    <AlertCircle size={19} className="mt-0.5 shrink-0 text-danger" />
                    <p className="text-[0.9375rem] text-ink-soft">{serverMessage}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex flex-col gap-2">
                <label htmlFor="field-name" className="text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id="field-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Priya Nair"
                  disabled={status === 'sending'}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  className={fieldClass('name')}
                />
                {errors.name ? (
                  <p id="error-name" className="text-sm text-danger">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="field-email" className="text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="priya@company.com"
                  disabled={status === 'sending'}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  className={fieldClass('email')}
                />
                {errors.email ? (
                  <p id="error-email" className="text-sm text-danger">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="field-message" className="text-sm font-medium text-ink">
                  Message
                </label>
                <textarea
                  id="field-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about the role or the problem."
                  disabled={status === 'sending'}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  className={`${fieldClass('message')} resize-y`}
                />
                {errors.message ? (
                  <p id="error-message" className="text-sm text-danger">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-accent btn-accent-hover btn-accent-active mt-1 self-start disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === 'sending' ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <Send size={17} />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
