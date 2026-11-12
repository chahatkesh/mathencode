# MathEncode

Small-group math classes, with about 4–5 students in each cohort. This repository is a single Next.js application: public pages, form APIs, and the admin area all run from one project.

## Scripts

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm start
pnpm lint
pnpm type-check
pnpm format
pnpm validate
pnpm create-admin
```

Copy `.env.example` to `.env.local` and set `MONGODB_URI`, `JWT_SECRET`, and `ADMIN_SETUP_SECRET` before starting the app or seeding an admin.

## Admin

Sign in at `/admin`. The overview shows clickable live counts for demo requests, unread requests, tutor applications, courses, diagnostic tests, and test results, with direct links to pending work and common actions. Counts come from the authenticated, uncached `/api/admin/dashboard` endpoint; unavailable data is never displayed as zero.

- `/admin/submissions`: searchable demo inbox, read/unread filters, contact actions, and CSV export. `?filter=unread` opens unread requests.
- `/admin/applications`: tutor pipeline, status filters, application details, and contact actions. `?status=pending` opens pending applications.
- `/admin/courses`: searchable course catalog and reusable create/edit forms.
- `/admin/tests`: course and common diagnostic editors, question ordering, and publish controls.
- `/admin/tests/submissions`: filterable results and individual answer review.

The previous private URLs redirect there and still require a signed-in admin. API authorization remains server-side. Course and test forms warn before reloading or closing with unsaved edits; failed saves retain the draft.

The admin uses Tailwind 3-compatible shadcn/ui components with Radix primitives in [src/components/ui](./src/components/ui). Shared page states, navigation, and inbox controls live in [src/components/admin](./src/components/admin). The [admin theme](./src/styles/admin.css) and [shell](./src/styles/admin-shell.css) are scoped to `.admin-site`; `admin-*` color tokens leave public-site colors unchanged. Dialog/select portals include their own admin scope. When adding registry components through [components.json](./components.json), adapt standard color classes to the existing `admin-*` tokens rather than overwriting the public palette.

Run focused admin utility checks with `pnpm exec tsx --test src/components/admin/*.test.ts`. For browser validation, use synthetic API fixtures for mutations to avoid creating or modifying real records. Check sidebar/drawer navigation, keyboard dialogs, filtering, save failures, and 375/768/1440px layouts.

Create the first admin with:

```bash
pnpm create-admin
```

For a non-interactive run (local or production), set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the environment as well. Running the command again for the same username does not create a second account.

## Routes

- `/` home
- `/career` open teaching roles
- `/career/[slug]` role details and teaching applications
- `/course/[id]` course details
- `/courses` course list and free diagnostic.
- `/premium` one-on-one mentorship requests
- `/diagnostic/[id]` course-specific or common placement tests
- `/privacy` privacy policy
- `/admin` sign in and dashboard

## Public design

The revamped MathEncode public site uses warm paper backgrounds, orange and charcoal branding, pastel course cards, Bricolage Grotesque display type, and Reddit Sans body type. The logo, live course catalog, student stories, and form/test workflows remain MathEncode’s.

Public styles are scoped beneath `.public-site` in the [public layout](<./src/app/(main)/layout.tsx>). The [shared public theme](./src/styles/public.css), [learning styles](./src/styles/public-learning.css), and [careers/privacy styles](./src/styles/public-careers.css) do not change the admin theme or root layout. Keep new public styles scoped the same way.

Licensed education assets are served locally from [public/assets/learning](./public/assets/learning). [sources.json](./public/assets/learning/sources.json) records their original URLs and the project owner’s reuse confirmation. These are illustrative photos, not MathEncode staff or testimonial portraits; original asset rights still apply.

For UI changes, check desktop (1440px), tablet (768px), and mobile (375px), including navigation, demo/country-selector dialogs, course selection, diagnostic phases, application forms, and a public-to-admin navigation. Mock form endpoints during browser checks to avoid creating real submissions.

Testimonial posters in [public/assets/videos](./public/assets/videos) are frames from the corresponding student videos, not stock portraits. Keep each poster paired with its original video. The videos still load only on playback.

Social previews share the public palette and locally hosted display font through [the OG renderer](./src/lib/og.tsx). Font licensing is recorded in [the OFL file](./src/assets/og/bricolage-grotesque-OFL.txt). SEO titles, descriptions, structured data, and image text must contain no em dashes; dynamic text is normalized at output boundaries without changing stored content.

Public form fields use a single contiguous focus border. Country selectors support search and arrow keys; pasting a full international number into the demo phone field selects its dial code. Run phone-input checks with `pnpm exec tsx --test src/lib/phone-input.test.ts`.
