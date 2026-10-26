import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from '../lib/gallery';

interface Props {
  photos: GalleryPhoto[];
  categories: string[];
}

const ALL = 'All';

export default function Gallery({ photos, categories }: Props) {
  const [category, setCategory] = useState(ALL);
  const [open, setOpen] = useState<number | null>(null);
  const shown = category === ALL ? photos : photos.filter((photo) => photo.category === category);
  const filters = [ALL, ...categories.filter((name) => photos.some((photo) => photo.category === name))];

  return (
    <div>
      <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className={[
              'inline-flex min-h-11 items-center rounded-full border px-5 text-small font-semibold transition duration-200',
              category === name
                ? 'border-primary bg-primary text-on-primary'
                : 'border-border bg-bg text-text hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} photos
      </p>

      <ul className="mt-10 columns-1 gap-4 sm:columns-2 sm:gap-6 lg:columns-3">
        {shown.map((photo, index) => (
          <li key={photo.thumb.src} className="mb-4 break-inside-avoid sm:mb-6">
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group relative block w-full overflow-hidden rounded-card text-left"
              aria-label={`Open photo: ${photo.alt}`}
            >
              <img
                src={photo.thumb.src}
                srcSet={photo.thumb.srcSet}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-300 ease-out-soft group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-3 text-small font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.event}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Lightbox photos={shown} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

interface LightboxProps {
  photos: GalleryPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

function Lightbox({ photos, index, onChange, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const photo = photos[index];

  const step = useCallback(
    (delta: number) => onChange((index + delta + photos.length) % photos.length),
    [index, photos.length, onChange],
  );

  useEffect(() => {
    // Remember what had focus, lock page scroll, and put focus inside the lightbox.
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'Tab' && dialog.current) {
        // Keep Tab inside the lightbox.
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button')].filter((el) => el.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, step]);

  const control =
    'size-12 items-center justify-center rounded-full bg-white/10 text-white transition duration-200 hover:bg-white/20';

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-[#0b0910]/95 backdrop-blur-sm"
      onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
        <p className="text-small text-white/70">
          {index + 1} / {photos.length}
        </p>
        <button ref={closeButton} type="button" onClick={onClose} className={`${control} inline-flex`} aria-label="Close photo viewer">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onClick={(event) => event.target === event.currentTarget && onClose()}
      >
        <img
          key={photo.full.src}
          src={photo.full.src}
          srcSet={photo.full.srcSet}
          sizes="100vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          className="max-h-full w-auto max-w-full rounded-button object-contain"
        />
        <button type="button" onClick={() => step(-1)} className={`${control} absolute left-4 hidden sm:inline-flex`} aria-label="Previous photo">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <button type="button" onClick={() => step(1)} className={`${control} absolute right-4 hidden sm:inline-flex`} aria-label="Next photo">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-4 text-white sm:justify-center sm:px-6">
        <button type="button" onClick={() => step(-1)} className={`${control} inline-flex sm:hidden`} aria-label="Previous photo">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <div className="text-center">
          <p className="font-display text-[1.25rem]">{photo.event}</p>
          <p className="text-small text-white/60">{photo.category}</p>
        </div>
        <button type="button" onClick={() => step(1)} className={`${control} inline-flex sm:hidden`} aria-label="Next photo">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
