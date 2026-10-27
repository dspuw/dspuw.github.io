import { useMemo, useState } from 'react';
import type { CardImage } from '../lib/headshots';

export interface DirectoryPerson {
  id: string;
  name: string;
  pledgeClass: string;
  major: string | null;
  graduationYear: number | null;
  linkedin: string | null;
  /** Null when the old site had no photo; the card shows initials instead. */
  image: CardImage | null;
}

interface Props {
  people: DirectoryPerson[];
  /** Newest first; sets the order of the class groups and the filter. */
  pledgeClasses: string[];
  /** "brother" or "alum", used in counts and messages. */
  noun: { one: string; many: string };
}

const ALL = 'all';

// Lets "andre" find "André" and ignores case.
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const selectClass =
  'min-h-11 w-full appearance-none rounded-button border border-border bg-bg bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 pl-4 text-small text-text transition duration-200 hover:border-primary focus:border-primary sm:w-auto';

// Chevron for the selects, drawn in the muted text color.
const chevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%237a7486'%3E%3Cpath d='M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z'/%3E%3C/svg%3E\")",
};

export default function BrotherDirectory({ people, pledgeClasses, noun }: Props) {
  const [query, setQuery] = useState('');
  const [pledgeClass, setPledgeClass] = useState(ALL);
  const [major, setMajor] = useState(ALL);
  const [year, setYear] = useState(ALL);

  // Filters only appear once the data has something to filter by.
  const classes = pledgeClasses.filter((name) => people.some((person) => person.pledgeClass === name));
  const majors = [...new Set(people.flatMap((person) => (person.major ? [person.major] : [])))].sort();
  const years = [...new Set(people.flatMap((person) => (person.graduationYear ? [person.graduationYear] : [])))].sort(
    (a, b) => b - a,
  );

  const results = useMemo(() => {
    const words = fold(query).split(/\s+/).filter(Boolean);
    return people.filter(
      (person) =>
        words.every((word) => fold(person.name).includes(word)) &&
        (pledgeClass === ALL || person.pledgeClass === pledgeClass) &&
        (major === ALL || person.major === major) &&
        (year === ALL || String(person.graduationYear) === year),
    );
  }, [people, query, pledgeClass, major, year]);

  const groups = classes
    .map((name) => ({ name, members: results.filter((person) => person.pledgeClass === name) }))
    .filter((group) => group.members.length > 0);

  const filtered = query !== '' || pledgeClass !== ALL || major !== ALL || year !== ALL;
  const reset = () => {
    setQuery('');
    setPledgeClass(ALL);
    setMajor(ALL);
    setYear(ALL);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative sm:min-w-72 sm:flex-1 lg:max-w-sm">
          <label htmlFor="directory-search" className="sr-only">
            Search by name
          </label>
          <svg
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-muted"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3.5 3.5" />
          </svg>
          <input
            id="directory-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name"
            autoComplete="off"
            className="min-h-11 w-full rounded-button border border-border bg-bg pr-4 pl-11 text-small text-text transition duration-200 placeholder:text-text-muted hover:border-primary focus:border-primary"
          />
        </div>

        <label className="sr-only" htmlFor="directory-class">
          Pledge class
        </label>
        <select
          id="directory-class"
          value={pledgeClass}
          onChange={(event) => setPledgeClass(event.target.value)}
          className={selectClass}
          style={chevron}
        >
          <option value={ALL}>All pledge classes</option>
          {classes.map((name) => (
            <option key={name} value={name}>
              {name} Class
            </option>
          ))}
        </select>

        {majors.length > 0 && (
          <>
            <label className="sr-only" htmlFor="directory-major">
              Major
            </label>
            <select
              id="directory-major"
              value={major}
              onChange={(event) => setMajor(event.target.value)}
              className={selectClass}
              style={chevron}
            >
              <option value={ALL}>All majors</option>
              {majors.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </>
        )}

        {years.length > 0 && (
          <>
            <label className="sr-only" htmlFor="directory-year">
              Graduation year
            </label>
            <select
              id="directory-year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className={selectClass}
              style={chevron}
            >
              <option value={ALL}>All graduation years</option>
              {years.map((value) => (
                <option key={value} value={String(value)}>
                  Class of {value}
                </option>
              ))}
            </select>
          </>
        )}

        <p className="text-small text-text-muted sm:ml-auto" aria-live="polite">
          {results.length === people.length
            ? `${people.length} ${noun.many}`
            : `Showing ${results.length} of ${people.length} ${noun.many}`}
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="mt-12 rounded-card bg-surface px-6 py-16 text-center">
          <p className="font-display text-h3">No {noun.many} match your search.</p>
          <p className="mt-2 text-text-muted">Try another name or clear the filters.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center rounded-button bg-primary px-6 text-small font-medium text-on-primary transition duration-200 hover:bg-primary-hover"
          >
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.name} aria-labelledby={`class-${group.name}`} className="mt-14 first:mt-12">
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
              <h2 id={`class-${group.name}`} className="text-[1.75rem] leading-tight sm:text-[2rem]">
                {group.name} Class
              </h2>
              <p className="text-small text-text-muted">
                {group.members.length} {group.members.length === 1 ? noun.one : noun.many}
              </p>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
              {group.members.map((person) => (
                <li key={person.id}>
                  <PersonCard person={person} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {filtered && groups.length > 0 && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-button text-small font-semibold text-primary underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function PersonCard({ person }: { person: DirectoryPerson }) {
  const details = [person.major, person.graduationYear ? `Class of ${person.graduationYear}` : null].filter(Boolean);
  const body = (
    <>
      <div className="relative overflow-hidden rounded-card bg-surface">
        {person.image ? (
          <img
            src={person.image.src}
            srcSet={person.image.srcSet}
            sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            width={person.image.width}
            height={person.image.height}
            alt={`Headshot of ${person.name}`}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 ease-out-soft group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-primary-soft" aria-hidden="true">
            <span className="font-display text-[2.5rem] text-primary">{initials(person.name)}</span>
          </div>
        )}
        {person.linkedin && (
          <span
            className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-bg/90 text-text shadow-soft backdrop-blur-sm transition duration-200 group-hover:bg-primary group-hover:text-on-primary"
            aria-hidden="true"
          >
            <LinkedInIcon />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-[1.1875rem] leading-snug font-semibold tracking-[-0.02em] text-text transition-colors duration-200 group-hover:text-primary">
        {person.name}
      </p>
      <p className="mt-0.5 text-small text-text-muted">{details.length > 0 ? details.join(' · ') : `${person.pledgeClass} Class`}</p>
    </>
  );

  if (!person.linkedin) return <div>{body}</div>;
  return (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-card"
      aria-label={`${person.name} on LinkedIn (opens in a new tab)`}
    >
      {body}
    </a>
  );
}

function initials(name: string) {
  const parts = name.split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function LinkedInIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="9" width="4" height="12" rx="0.5" />
      <circle cx="5" cy="5" r="2" />
      <path d="M10 9h3.8v1.7c.6-1 1.9-2 3.9-2 3.2 0 4.3 2 4.3 5.3V21h-4v-6.2c0-1.6-.4-2.7-1.9-2.7s-2.1 1.1-2.1 2.7V21h-4Z" />
    </svg>
  );
}
