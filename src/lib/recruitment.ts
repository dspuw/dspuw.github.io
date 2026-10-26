import type { Recruitment } from './data';

/**
 * The banner text shown across the site. When recruitment is closed it uses
 * the chapter's wording for the cycle that just ended, so nobody retypes it.
 */
export function bannerMessage(r: Recruitment): string {
  if (r.status === 'open') {
    return `Recruitment for ${r.nextCycle.term} ${r.nextCycle.year} is open.`;
  }
  const { term, year } = r.lastCycle;
  if (term === 'Fall') {
    return `Sigma Upsilon's recruitment for Fall ${year} has concluded! Check back with us during Winter ${year + 1} for our next recruitment cycle.`;
  }
  return `Sigma Upsilon's recruitment for the ${year - 1} to ${year} academic year has concluded! Check back with us during Fall ${year} or Winter ${year + 1} for our next recruitment cycles.`;
}
