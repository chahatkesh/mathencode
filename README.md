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

Sign in at `/admin`. Demo requests live at `/admin/submissions`. Tutor applications live at `/admin/applications`. The previous private URLs redirect there and still require a signed-in admin.

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
- `/which-course` course selection
- `/diagnostic/[id]` course-specific or common placement tests
- `/privacy` privacy policy
- `/admin` sign in and dashboard

## Public design

The revamped MathEncode public site uses warm paper backgrounds, orange and charcoal branding, pastel course cards, Bricolage Grotesque display type, and Reddit Sans body type. The logo, live course catalog, student stories, and form/test workflows remain MathEncode’s.

Public styles are scoped beneath `.public-site` in the [public layout](./src/app/(main)/layout.tsx). The [shared public theme](./src/styles/public.css), [learning styles](./src/styles/public-learning.css), and [careers/privacy styles](./src/styles/public-careers.css) do not change the admin theme or root layout. Keep new public styles scoped the same way.

Licensed education assets are served locally from [public/assets/learning](./public/assets/learning). [sources.json](./public/assets/learning/sources.json) records their original URLs and the project owner’s reuse confirmation. These are illustrative photos, not MathEncode staff or testimonial portraits; original asset rights still apply.

For UI changes, check desktop (1440px), tablet (768px), and mobile (375px), including navigation, demo/country-selector dialogs, course selection, diagnostic phases, application forms, and a public-to-admin navigation. Mock form endpoints during browser checks to avoid creating real submissions.

Testimonial posters in [public/assets/videos](./public/assets/videos) are frames from the corresponding student videos, not stock portraits. Keep each poster paired with its original video. The videos still load only on playback.

Social previews share the public palette and locally hosted display font through [the OG renderer](./src/lib/og.tsx). Font licensing is recorded in [the OFL file](./src/assets/og/bricolage-grotesque-OFL.txt). SEO titles, descriptions, structured data, and image text must contain no em dashes; dynamic text is normalized at output boundaries without changing stored content.

Public form fields use a single contiguous focus border. Country selectors support search and arrow keys; pasting a full international number into the demo phone field selects its dial code. Run phone-input checks with `pnpm exec tsx --test src/lib/phone-input.test.ts`.
