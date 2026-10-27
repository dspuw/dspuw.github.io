# dspuw.github.io

The website for the Sigma Upsilon Chapter of Delta Sigma Pi at the University of Washington, live at **https://dspuw.com** (also reachable at https://dspuw.github.io).

This guide is for the VP of Technology. You don't need to know how to code. Almost everything that changes from quarter to quarter lives in a few text files in `src/data`, and the site rebuilds itself when you save a change on GitHub.

---

## How the site works

- **Built with:** Astro, a tool that turns the files in this repository into a plain, fast website.
- **Hosting:** GitHub Pages hosts the site for free.
- **Publishing:** whenever a change lands on the `main` branch, GitHub runs the workflow in `.github/workflows/deploy.yml`. That workflow builds the site and publishes it, which takes about two minutes. You can watch it on the **Actions** tab of the repository.
- **Mistakes are caught:** if a data file has a mistake, such as a missing comma or a wrong field, the build stops and the live site stays as it was. The Actions tab shows a red X and a message that says which file and which field to fix.

## Editing the site on GitHub (no installs needed)

1. Open the repository on github.com and go to the file, for example `src/data/recruitment.json`.
2. Click the pencil icon (**Edit this file**).
3. Make your change. Keep the quotes, commas and brackets exactly as they are around the text you change.
4. Click **Commit changes**, choose **Create a new branch and start a pull request**, and give it a short name.
5. Open the pull request. GitHub runs the build. A green check means the change works.
6. Click **Merge**. The live site updates a couple of minutes later.

To add an image, such as a headshot, go to its folder (for example `src/assets/images/brothers`), click **Add file → Upload files**, and upload it in the same pull request.

## Running the site on your own computer (optional)

You need [Node.js](https://nodejs.org) version 22 or newer.

```bash
npm install        # once, to download what the site needs
npm run dev        # opens a live preview at http://localhost:4321
npm run build      # checks every data file and builds the final site into dist/
```

Always run `npm run build` before opening a pull request. It must finish with no errors.

---

## The data files

All of these live in `src/data`. A few rules apply to every file:

- Text goes inside "double quotes".
- Items in a list are separated by commas, and there is no comma after the last item.
- Use `null` (no quotes) when something is unknown.

### `site.json` — links and site-wide text

- **`socials`:** the Instagram and LinkedIn links.
- **`email`:** the chapter's main point of contact, shown on the Home and Contact pages.
  - There is no contact form right now. If you want one later, get a free access key from [Web3Forms](https://web3forms.com) that delivers to the chapter email, and ask a developer (or Claude) to add the form back.
- **`membersPortal`:** the members-only RateMyBrofessor link. It shows as a Members button in the top bar, in the phone menu, and under the Brothers tabs.
  - Put the site's address in `url`. Leave it as `""` to hide the link.
  - The link is public, but RateMyBrofessor has its own login, so only approved UW emails can get in. Access is managed on that site, not here.
- **`stats`:** the numbers on the home page (founded 2012, 75+ brothers). Only change these if the facts change.
- **`nav` and `footerLinks`:** the menu links.
- **`landAcknowledgment`:** shown in the footer of every page. Do not reword it.

### `recruitment.json` — recruitment status, schedule and FAQ

- **`status`:** `"open"` or `"closed"`. This one word controls the purple banner at the top of every page.
  - When it is `"closed"`, the banner says the last cycle has concluded and names the next one.
- **`lastCycle` and `nextCycle`:** the term (`"Fall"` or `"Winter"`) and the year. The banner wording is built from these.
- **`events`:** the recruitment schedule. Each event looks like this:

  ```json
  {
    "id": "info-night",
    "title": "Info Night",
    "start": "2027-01-06T18:30:00-08:00",
    "end": "2027-01-06T20:00:00-08:00",
    "room": "PACCAR Hall 192",
    "address": "4277 NE Stevens Way, Seattle, WA 98195",
    "description": null
  }
  ```

  Notes on events:
  - `start` and `end` use the format year-month-day, then `T`, then the 24-hour time. End with `-08:00` in winter or `-07:00` in summer, which is Seattle time.
  - When recruitment is open, the page shows a countdown to the next upcoming event.
  - With no events, the page shows a "coming soon" message.
- **`contacts` and `email`:** who to contact about recruitment.
- **`eligibility`:** the application rules.
- **`faq`:** a list of `{ "question": "...", "answer": "..." }`. The FAQ section stays hidden while this is empty.

### `people.json` — every brother and alum

- **`pledgeClasses`:** every class, **newest first**. Add a new class to the top of this list.
- **`people`:** one entry per person:

  ```json
  {
    "id": "jane-doe",
    "name": "Jane Doe",
    "pledgeClass": "Alpha Gamma",
    "status": "active",
    "major": null,
    "graduationYear": null,
    "headshot": "jane-doe.jpg",
    "linkedin": "https://www.linkedin.com/in/janedoe/"
  }
  ```

  - **`id`:** the name in lowercase with dashes. It must be unique.
  - **`status`:** `"active"` shows the person on Deltasigs, and `"alumni"` moves them to Alumni. **That is the only change needed when someone graduates.**
  - **`headshot`:** the file name of the photo in `src/assets/images/brothers`.
    - Use the person's name as the file name, for example `jane-doe.jpg`.
    - A portrait photo works best, and the site crops it to 4:5.
    - Use `null` to show initials instead.
  - **`linkedin`:** the full LinkedIn URL, or `null`.
  - **`major` and `graduationYear`:** optional, so leave them as `null` if unknown. Once anyone has one filled in, a Major filter and a Graduation Year filter appear on the directory automatically. `graduationYear` is a number with no quotes, for example `2027`.

### `executive-board.json` — this year's officers

- **`schoolYear`:** for example `"2026 - 2027"`.
- **`officers`:** listed in the order they appear on the page. Each one has:
  - `name` and `title`.
  - `headshot`: a file in `src/assets/images/executive-board`.
  - `linkedin`: the full LinkedIn URL.
  - `description`: one or two sentences about the role, or `null`. When it is filled in, the card shows an "About the role" panel on hover or tap.

### `gallery.json` — gallery photos

- **`categories`:** the filter buttons, in order.
- **`photos`:** one entry per photo, with these fields:
  - `image`: a file in `src/assets/images/gallery`. Use a descriptive name like `fall-2027-retreat-group.jpg`.
  - `alt`: a sentence describing the photo for people who use screen readers. It is required.
  - `category`: must match one of the categories.
  - `event`: the event name, shown in the full-screen viewer.

### Other page text

- `home.json` holds the home page.
- `about.json` holds the About page. Keep the official About text word for word.
- `alumni-companies.json` holds the "Our Alumni" logos on the home page.
  - Logo files go in `src/assets/logos` as SVG or PNG with a transparent background. Use `"logo": null` to show initials instead.
  - Optional: `"size": "sm"` or `"lg"` evens out a logo that looks too heavy or too small, and `"wide": true` gives very wide wordmarks more room.
  - **Never** commit the alumni spreadsheet itself. It contains private contact details. Only company names belong here.

### Photos

- Upload photos as normal JPG or PNG files. The site makes small, modern copies (AVIF and WebP) automatically when it builds.
- Use real chapter photos and give each file a meaningful name.
- Only add names, headshots and LinkedIn links of people who agreed to be on the public site.

---

## Quarterly checklist

### Fall quarter

1. **Executive Board:** update `executive-board.json` with the new officers and school year. Add their headshots to `src/assets/images/executive-board`.
2. **Before recruitment:** in `recruitment.json`:
   - Set `nextCycle` to Fall of this year.
   - Add the `events`.
   - Update `contacts` if they changed.
   - Set `status` to `"open"`.
3. **After recruitment ends:**
   - Set `status` to `"closed"`.
   - Set `lastCycle` to Fall of this year.
   - Set `nextCycle` to Winter of next year.
   - Clear `events` to `[]`.
4. **After initiation:**
   - Add the new pledge class to the top of `pledgeClasses` in `people.json`.
   - Add one entry per new brother, using the headshots and LinkedIn links collected by the pledge parents.
   - Upload the headshots to `src/assets/images/brothers`.

### Winter quarter

Same steps as Fall. After recruitment ends, set `lastCycle` to Winter of this year and `nextCycle` to Fall of this year.

### Spring quarter

1. **Graduating seniors:** change each one's `status` from `"active"` to `"alumni"` in `people.json`. They move from Deltasigs to Alumni automatically.
2. Optionally, add `graduationYear` for them.

---

## Where things live

| What | Where |
| --- | --- |
| Data files | `src/data` |
| Pages | `src/pages` (one file per page; `brothers/` holds the three Brothers views) |
| Reusable pieces (navbar, footer, cards, gallery) | `src/components` |
| Colors, fonts and spacing (design tokens) | `src/styles/global.css` |
| Photos | `src/assets/images` |
| Logo | `src/assets/brand` |
| Deploy workflow | `.github/workflows/deploy.yml` |
| Saved copy of the old Squarespace site | `reference/` |

The site uses the custom domain `dspuw.com`. It is set in the repo's Settings > Pages, and its DNS records point to GitHub Pages. Renew the domain every year with whichever registrar it was bought from.
