import { useEffect, useState } from 'react';

interface Props {
  /** ISO date-time of the next event. */
  target: string;
  title: string;
}

function remaining(target: number) {
  const ms = Math.max(target - Date.now(), 0);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
  };
}

export default function Countdown({ target, title }: Props) {
  const time = new Date(target).getTime();
  const [left, setLeft] = useState(() => remaining(time));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(remaining(time)), 30_000);
    return () => window.clearInterval(id);
  }, [time]);

  const parts = [
    ['days', left.days],
    ['hours', left.hours],
    ['minutes', left.minutes],
  ] as const;

  return (
    <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
      <p className="text-small text-text-muted">Next up: {title}</p>
      <dl className="mt-4 flex gap-8">
        {parts.map(([label, value]) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="font-display text-[2.5rem] leading-none tabular-nums">{value}</dd>
            <p aria-hidden="true" className="mt-1 text-small text-text-muted capitalize">
              {label}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
}
