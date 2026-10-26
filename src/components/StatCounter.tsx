import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  label: string;
  /** Years count up from a nearby start instead of from zero. */
  from?: number;
}

const DURATION_MS = 1200;

export default function StatCounter({ value, suffix = '', label, from = 0 }: Props) {
  // Server render shows the final number, so the fact is visible without JavaScript.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setDisplay(from);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(from + (value - from) * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, from]);

  return (
    <div ref={ref}>
      <p className="text-small text-text-muted">{label}</p>
      <p className="mt-1 font-display text-[2.75rem] leading-none tracking-[-0.02em] text-text tabular-nums sm:text-[3.5rem]">
        <span aria-hidden="true">
          {display}
          {suffix}
        </span>
        <span className="sr-only">
          {value}
          {suffix}
        </span>
      </p>
    </div>
  );
}
