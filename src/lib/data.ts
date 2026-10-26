// Every JSON file in src/data is checked here at build time, so a typo
// fails the build with a readable message instead of breaking a page.
import { z } from 'astro/zod';
import siteJson from '../data/site.json';
import recruitmentJson from '../data/recruitment.json';

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

export const site = siteSchema.parse(siteJson);
export const recruitment = recruitmentSchema.parse(recruitmentJson);

export type Recruitment = z.infer<typeof recruitmentSchema>;
