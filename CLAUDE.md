# DSP UW Website

## What this project is
Rebuild dspuw.net, the website for the Sigma Upsilon Chapter of Delta Sigma Pi at the University of Washington, as a clean, modern, fast static site hosted on GitHub Pages. The current site runs on Squarespace. The goal is a site that looks professional to recruiters and alumni, feels welcoming to freshmen, and is easy for a future VP of Technology to maintain.

## Who it is for
1. Prospective members, mostly UW freshmen and sophomores interested in business, economics, and informatics. They are the priority and most will visit on a phone.
2. Current brothers looking for the brothers directory, events, and chapter info.
3. Alumni and recruiters learning about the chapter.

## Facts about the chapter
* Delta Sigma Pi is a professional coed business fraternity.
* Sigma Upsilon was founded in 2012 and installed as a chapter in May 2013.
* The chapter has over 75 brothers across Business, Economics, and Informatics majors.
* The chapter recruits every Fall and Winter quarter.
* Social links are Instagram (dspuw) and the LinkedIn company page (dspuw).

Do not invent other facts, numbers, names, or events. If something is missing, use a clearly labeled placeholder and list it in the pull request description.

## Reference material
Everything about how the current site looks and reads lives in the reference folder. Read it before proposing anything.
* reference/pages has the saved pages and text from the current site.
* reference/screenshots has desktop and phone screenshots of the key pages.
* Original photos go in src/assets/images and the logo goes in src/assets/brand.

Keep the existing wording unless I say otherwise. Copy the About text and the Land Acknowledgment exactly as they appear in the reference, and never retype or rewrite them. The Land Acknowledgment stays in the footer of every page.

## Pages
Same structure as today.
1. Home
2. About
3. Recruitment, including the recruitment schedule
4. Brothers, with three views called Deltasigs, Executive Board, and Alumni
5. Gallery
6. Contact

Also add a 404 page.

## Design direction
Clean, modern, professional, and welcoming. It should feel like a strong student organization or a well designed nonprofit, not a bank and not a startup template.
* Palette comes from the logo. Use one primary brand color, one accent used sparingly, and a neutral gray scale. If the logo uses royal blue and gold, lean into those. Define every color as a design token in one place.
* Typography uses at most two font families. Use a clean modern sans serif for body text and a confident display style for headings, with generous line height and a clear size scale.
* Layout uses a 12 column grid, a maximum content width around 1200 pixels, an 8 pixel spacing scale, and lots of whitespace. Sections should breathe.
* Components share one visual language. Use rounded corners around 12 to 16 pixels, soft shadows, and one consistent style for buttons (primary, secondary, text link) and cards.
* Photography uses real chapter photos with consistent crop ratios. No stock photos and no gray placeholder boxes in the final version.
* Motion is subtle. Use fade and slide on scroll plus hover states on cards and buttons, all under 300 milliseconds, and turn motion off for visitors who prefer reduced motion.
* Avoid auto advancing carousels, walls of text, heavy gradients, emoji used as icons, lorem ipsum, and anything that looks like a generic AI template.
* Support light and dark mode with a toggle that remembers the visitor's choice.

Sites I like for inspiration (Owen adds links here before the first session)
*
*

## UX requirements
* Every page has one clear purpose and one primary call to action. The main call to action across the site is the recruitment page.
* Mobile first. Design for a 390 pixel wide phone, then scale up. Tap targets are at least 44 pixels.
* The navbar is sticky, shrinks on scroll, and has a clean mobile menu. The current page is clearly marked.
* A recruitment status banner is driven by one value in a data file, either open or closed. When closed, show a short message in this style. For Fall, "Sigma Upsilon's recruitment for Fall [YEAR] has concluded! Check back with us during Winter [YEAR] for our next recruitment cycle." For Winter, "Sigma Upsilon's recruitment for the [YEAR] to [YEAR] academic year has concluded! Check back with us during Fall [YEAR] or Winter [YEAR] for our next recruitment cycles."
* Pages feel instant. Images are lazy loaded and served in modern formats.
* Accessible by default. Good color contrast, full keyboard navigation, visible focus states, alt text on every image, and semantic HTML.

## Interactive features
Keep it tasteful. Interaction should help people find things, not decorate the page.
1. A brothers directory with search, filters for pledge class and major, and a profile card showing a headshot and LinkedIn link.
2. Executive Board cards with the role and a short description that expand on hover or tap.
3. An Alumni view that can be filtered by graduation year.
4. A gallery with a masonry layout, category filters, and a full screen lightbox that supports swipe and keyboard controls.
5. A recruitment page with a timeline of the current cycle, an FAQ accordion, and a countdown to the next event when one is scheduled.
6. Animated counters for verified facts only, which are the founding year, the 75 plus brothers, and the three majors.
7. A contact form with inline validation and a friendly success message.

## Data model
Everything that changes lives in JSON files under src/data so a non developer can update the site without touching components.
* people.json holds every brother with name, major, pledge class, graduation year, headshot path, LinkedIn URL, and a status of active or alumni. Moving a graduating senior to the Alumni view means changing one field.
* executive board has its own file with the school year and each officer's name, title, and headshot.
* recruitment.json holds the status, cycle name, dates, and schedule.
* gallery.json holds the image path, alt text, category, and event name.
* site.json holds the social links and the contact form endpoint.

## Public repo safety
This repository is public.
* Never commit passwords, API keys, calendar subscription links, or anything private.
* Only include names, headshots, and LinkedIn links for people who already appear on the current public site.
* Never add anything about recruitment candidates, interview scores, or internal chapter processes.
* Do not add the chapter or executive calendar links without asking me first.

## Tech rules
* Use Astro with TypeScript and Tailwind CSS. Use React components only for interactive pieces such as the filters and the lightbox.
* Output is fully static with no server code.
* Run npm run build before every pull request and make sure it passes.
* Deploy with a GitHub Actions workflow inside .github/workflows that builds the site and publishes it to GitHub Pages.
* The repo is named after the organization plus .github.io, so the site lives at the root with no base path. Do not set up the custom domain dspuw.net until I say so.
* The contact form uses Formspree or Web3Forms with the endpoint stored in site.json, a hidden spam trap field, and submissions going to a shared chapter email.
* Optimize images at build time and give files meaningful names.

## Workflow
1. Start every session by reading this file and the reference folder.
2. Before writing code for a new page, post a short plan and wait for my approval.
3. Work on a branch and open a pull request for each page or feature, with a short description of what changed and any placeholders left.
4. Run the build. If possible, render the page at 390 and 1280 pixel widths, compare it with the reference screenshots, and list the differences honestly.
5. Do not merge into main yourself.

## Build order
1. Design tokens, layout shell, navbar, footer, and the deploy workflow.
2. Home.
3. About and Recruitment.
4. Brothers with Deltasigs, Executive Board, and Alumni.
5. Gallery and Contact.
6. Polish pass for accessibility and performance, the 404 page, and the README.

## Handoff
The README must explain in plain language, for a future VP of Technology who may not code, how to run the site, how to edit each data file, and the quarterly checklist below.
* Fall quarter. Update the Executive Board, update the recruitment info before the cycle, mark recruitment as concluded after it ends, and add the new pledge class after initiation using headshots and LinkedIn links collected by the pledge parents.
* Winter quarter. Same steps as Fall.
* Spring quarter. Move graduating seniors from the Deltasigs view to the Alumni view.

## Done means
The build passes, every page works at phone width, the site is keyboard accessible with good contrast, there are no console errors, no unlabeled placeholders remain, and Lighthouse scores for accessibility and performance are in the 90s.
