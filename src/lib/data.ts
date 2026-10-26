// Every JSON file in src/data is checked here at build time, so a typo
// fails the build with a readable message instead of breaking a page.
import { z } from 'astro/zod';
import siteJson from '../data/site.json';
import recruitmentJson from '../data/recruitment.json';
import homeJson from '../data/home.json';
import alumniCompaniesJson from '../data/alumni-companies.json';

const link = z.object({ label: z.string(), href: z.string() });

const siteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  socials: z.object({ instagram: z.url(), linkedin: z.url() }),
  formEndpoint: z.string(),
  stats: z.array(
    z.object({ value: z.number(), suffix: z.string().optional(), label: z.string() }),
  ),
  nav: z.array(link.extend({ children: z.array(link).optional() })),
  footerLinks: z.array(link),
  landAcknowledgment: z.string(),
});

const term = z.enum(['Fall', 'Winter']);
const cycle = z.object({ term, year: z.number().int() });

const recruitmentSchema = z.object({
  status: z.enum(['open', 'closed']),
  lastCycle: cycle,
  nextCycle: cycle,
  contacts: z.array(z.object({ name: z.string(), title: z.string() })),
  email: z.email(),
  eligibility: z.array(z.string()),
  events: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      start: z.string(),
      end: z.string().nullable(),
      room: z.string().nullable(),
      address: z.string().nullable(),
      description: z.string().nullable(),
    }),
  ),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
});

const block = z.object({ heading: z.string(), text: z.string(), link: link });

const homeSchema = z.object({
  hero: z.object({ title: z.string(), subtitle: z.string(), tagline: z.string() }),
  about: z.object({ heading: z.string(), paragraphs: z.array(z.string()), link: link }),
  whoWeAre: block,
  joinUs: block,
  contact: z.object({ heading: z.string(), text: z.string() }),
});

export const site = siteSchema.parse(siteJson);
export const home = homeSchema.parse(homeJson);

const alumniCompaniesSchema = z.object({
  heading: z.string(),
  intro: z.string(),
  link: link,
  companies: z.array(
    z.object({
      name: z.string(),
      // File name in src/assets/logos without .svg, or null for a monogram placeholder.
      logo: z.string().nullable(),
      // A wordmark already spells the name; a mark (symbol only) is shown with the name beside it.
      type: z.enum(['wordmark', 'mark']).optional(),
      // Dark logos turn white in dark mode so they stay visible.
      invertInDark: z.boolean().optional(),
    }),
  ),
});

export const alumniCompanies = alumniCompaniesSchema.parse(alumniCompaniesJson);
export const recruitment = recruitmentSchema.parse(recruitmentJson);

export type Recruitment = z.infer<typeof recruitmentSchema>;
