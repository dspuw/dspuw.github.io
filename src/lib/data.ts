// Every JSON file in src/data is checked here at build time, so a typo
// fails the build with a readable message instead of breaking a page.
import { z } from 'astro/zod';
import siteJson from '../data/site.json';
import recruitmentJson from '../data/recruitment.json';
import homeJson from '../data/home.json';
import alumniCompaniesJson from '../data/alumni-companies.json';
import aboutJson from '../data/about.json';
import peopleJson from '../data/people.json';
import executiveBoardJson from '../data/executive-board.json';
import galleryJson from '../data/gallery.json';

const link = z.object({ label: z.string(), href: z.string() });

const siteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  socials: z.object({ instagram: z.url(), linkedin: z.url() }),
  // The main point of contact, shown on Home and Contact.
  email: z.email(),
  // Private members-only site. The footer link only shows once url is filled in.
  membersPortal: z.object({ label: z.string(), note: z.string(), url: z.union([z.url(), z.literal('')]) }),
  stats: z.array(
    z.object({ value: z.number(), suffix: z.string().optional(), label: z.string() }),
  ),
  nav: z.array(link.extend({ children: z.array(link).optional() })),
  footerLinks: z.array(link),
  landAcknowledgment: z.string(),
  contactPage: z.object({ heading: z.string(), text: z.string() }),
});

const term = z.enum(['Fall', 'Winter']);
const cycle = z.object({ term, year: z.number().int() });

const recruitmentSchema = z.object({
  status: z.enum(['open', 'closed']),
  lastCycle: cycle,
  nextCycle: cycle,
  page: z.object({
    hero: z.object({ title: z.string(), subtitle: z.string() }),
    intro: z.object({ heading: z.string(), paragraphs: z.array(z.string()) }),
    scheduleHeading: z.string(),
    scheduleEmpty: z.string(),
    eligibilityHeading: z.string(),
  }),
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
      // File name in src/assets/logos without .svg or .png, or null for a monogram placeholder.
      logo: z.string().nullable(),
      // A wordmark already spells the name; a mark (symbol only) is shown with the name beside it.
      type: z.enum(['wordmark', 'mark']).optional(),
      // Dark logos turn white in dark mode so they stay visible.
      invertInDark: z.boolean().optional(),
      // Optional fine-tuning so logos look balanced: "sm" for heavy logos, "lg" for compact ones.
      size: z.enum(['sm', 'md', 'lg']).optional(),
      // Very wide wordmarks get a little more room.
      wide: z.boolean().optional(),
    }),
  ),
});

export const alumniCompanies = alumniCompaniesSchema.parse(alumniCompaniesJson);
export const recruitment = recruitmentSchema.parse(recruitmentJson);

export type Recruitment = z.infer<typeof recruitmentSchema>;

const headed = z.object({ heading: z.string(), text: z.string() });

const aboutSchema = z.object({
  hero: z.object({ title: z.string() }),
  story: z.object({ eyebrow: z.string(), paragraphs: z.array(z.string()) }),
  purpose: z.object({ eyebrow: z.string(), items: z.array(headed) }),
  pillars: z.object({ eyebrow: z.string(), items: z.array(z.object({ name: z.string(), text: z.string() })) }),
});

export const about = aboutSchema.parse(aboutJson);

const peopleSchema = z
  .object({
    // Newest class first. Add a new pledge class to the top of this list.
    pledgeClasses: z.array(z.string()),
    people: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        pledgeClass: z.string(),
        // Change to "alumni" to move a graduating brother to the Alumni view.
        status: z.enum(['active', 'alumni']),
        major: z.string().nullable(),
        graduationYear: z.number().int().nullable(),
        // File name in src/assets/images/brothers, or null to show initials.
        headshot: z.string().nullable(),
        linkedin: z.url().nullable(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const ids = new Set<string>();
    for (const person of data.people) {
      if (!data.pledgeClasses.includes(person.pledgeClass)) {
        ctx.addIssue({ code: 'custom', message: `${person.name}: "${person.pledgeClass}" is not in pledgeClasses` });
      }
      if (ids.has(person.id)) ctx.addIssue({ code: 'custom', message: `Duplicate id "${person.id}"` });
      ids.add(person.id);
    }
  });

export const people = peopleSchema.parse(peopleJson);
export type Person = z.infer<typeof peopleSchema>['people'][number];

const executiveBoardSchema = z.object({
  schoolYear: z.string(),
  officers: z.array(
    z.object({
      name: z.string(),
      title: z.string(),
      // File name in src/assets/images/executive-board.
      headshot: z.string(),
      linkedin: z.url().nullable(),
      // A sentence or two about the role. Cards expand to show it once it is filled in.
      description: z.string().nullable(),
    }),
  ),
});

export const executiveBoard = executiveBoardSchema.parse(executiveBoardJson);

const gallerySchema = z
  .object({
    // The filter buttons, in this order.
    categories: z.array(z.string()),
    photos: z.array(
      z.object({
        // File name in src/assets/images/gallery.
        image: z.string(),
        // Describe what is in the photo for people using screen readers.
        alt: z.string().min(1),
        category: z.string(),
        event: z.string(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    for (const photo of data.photos) {
      if (!data.categories.includes(photo.category)) {
        ctx.addIssue({ code: 'custom', message: `${photo.image}: "${photo.category}" is not in categories` });
      }
    }
  });

export const gallery = gallerySchema.parse(galleryJson);
