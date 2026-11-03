# MathEncode

Personalized math coaching for grades K–12. This repository is a single Next.js application: public pages, form APIs, and the admin area all run from one project.

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
- `/career` teaching applications
- `/course/[id]` course details
- `/admin` sign in and dashboard
