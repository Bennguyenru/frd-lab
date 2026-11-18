# FRD Lab Hub

Lab management site for **FRD Lab (Fintech R&D Lab), University of Greenwich Vietnam, Hanoi campus**.
Lab head: Dr. Nguyễn Thế Lâm Tùng.

Live site: https://bennguyenru.github.io/frd-lab/

## What it does

| Section | Members | Admins |
|---|---|---|
| Dashboard | Streak, XP, achievements, own work and activity | Lab overview, member progress, publication pipeline, announcement |
| Classroom | Read posts, submit work, see grades | Post assignments, discussions and materials; grade with feedback |
| Meetings | Calendar, reply attending or absent | Schedule, edit and delete meetings |
| Attendance | Book lab days, check in for today | Weekly register, confirm attendance, export CSV |
| Discussion | Open topics, reply | Moderate |
| Library | Add papers by DOI (Crossref), copy APA 7 references, export CSV | Same, plus moderation |
| Publications | Track own papers from idea to published | Move any paper between stages |
| Progress | Weekly report, read supervisor feedback | Read every report, give feedback and research direction, export CSV |
| Settings | Own profile and password | Lab settings, accounts and access (admin, member, inactive) |

## How it is built

* `index.html` is a single static page served by GitHub Pages.
* Accounts, data and access rules live in **Supabase** (project `aafopsdcikxsakyiscjn`).
  Every rule is enforced inside the database with row level security, so the browser code being public is not a risk:
  members can only read and write what the rules allow (for example, they cannot read other members' reports or change their own grades).
* `supabase/schema.sql` creates the tables, rules and triggers. It is safe to run again after an update.
* `supabase/functions/admin-users` is an Edge Function that lets admins create accounts, send invites and reset passwords from the site, without exposing the secret key.
* `vendor/supabase.js` is supabase-js 2.119.0 (MIT licence, see `vendor/LICENSE-supabase-js.txt`).

## Accounts

Public sign-up is switched off. Admins add people from **Settings → Add an account**:

* **Create with temporary password**: the site shows a one-time password to pass on. The person must choose their own at first sign-in. No email is needed.
* **Send invite email**: Supabase emails a link to choose a password. The built-in Supabase mailer sends only a few emails per hour, so set up custom SMTP (Authentication → Emails → SMTP settings) before inviting many people at once.

To make someone admin from the Supabase SQL editor: `select make_admin('name@example.com');`

## Setting up a fresh copy

1. Create a Supabase project. In the SQL editor, run `supabase/schema.sql`.
2. Authentication → Sign In / Providers: turn off **Allow new users to sign up**.
3. Authentication → URL Configuration: set **Site URL** to your Pages address and add `https://<user>.github.io/<repo>/**` to Redirect URLs.
4. Edge Functions → Deploy a new function → Via editor: name it `admin-users`, paste `supabase/functions/admin-users/index.ts`, deploy, then turn off **Verify JWT with legacy secret** (the function checks the caller itself).
5. Put the Project URL and the **publishable** key in `config.js`. Never put a secret or service_role key there.
6. Invite the first admin (Authentication → Users → Add user → Send invitation), then run `select make_admin('their@email');`.
7. GitHub repository → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
