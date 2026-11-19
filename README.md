# FRD Lab Hub

Lab management site for **FRD Lab (Fintech R&D Lab), University of Greenwich Vietnam, Hanoi campus**.
Lab head: Dr. Nguyễn Thế Lâm Tùng.

Live site: https://bennguyenru.github.io/frd-lab/

## What it does

| Section | Members | Admins |
|---|---|---|
| Dashboard | Streak, XP, achievements, own work and activity | Lab overview, member progress, publication pipeline, announcement |
| Classroom | Read posts, submit work, see grades | Post assignments, discussions and materials; grade with feedback |
| Projects | Boards they belong to: add, edit and drag tasks, tick sub-tasks, see the timeline; create their own project | Every project; turn a classroom assignment into a project with one main task per member; manage members and lists |
| Meetings | Calendar, reply attending or absent | Schedule, edit and delete meetings |
| Attendance | Book lab days, check in for today (optionally only on the school Wi-Fi) | Weekly register, confirm attendance, export CSV |
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
* `supabase/schema.sql` creates the tables, rules and triggers. `supabase/projects.sql` adds the project boards (run it after schema.sql). Both are safe to run again after an update.
* `supabase/functions/admin-users` is an Edge Function that lets admins create accounts, send invites and reset passwords from the site, without exposing the secret key.
* `vendor/supabase.js` is supabase-js 2.119.0 (MIT licence, see `vendor/LICENSE-supabase-js.txt`).
* `app.js` holds the application code and `stack.js` the small-screen table labels; `index.html` holds the markup and styles.
* `fonts/` holds the Inter typeface (SIL Open Font License, see `fonts/LICENSE-Inter-OFL.txt`), served from this site so no third-party font service sees visitors.
* `DESIGN.md` documents the design tokens and components. Read it before changing the look.

## Accounts

Public sign-up is switched off. Admins add people from **Settings → Add an account**:

* **Add many members at once**: paste rows (full name, student ID, class, email, phone) copied from Excel or Google Sheets, check the list, then create all accounts. The site shows each temporary password once, with Copy and Download CSV.
* **Create with temporary password**: the site shows a one-time password (for example `Lab-7k2m-9qxp-4hwe`) to pass on. The person must choose their own at first sign-in. No email is needed.
* **Temporary passwords are enforced by the database**: until the person chooses their own password, the account can read and change nothing in the lab (not even an admin account). A temporary password stops working for the lab after 72 hours; issue a new one with **New password**.
* **Forgotten passwords**: an admin presses **New password** next to the person in Settings and passes the new temporary password on. No email is sent (the built-in Supabase mailer only reaches project team addresses and a few messages per hour).

Phone numbers are stored in a separate `contacts` table that only the member and the admins can read. Student ID and class are visible to the lab.

## Projects

Projects work like Trello boards. Each project has lists (To do, In progress, Review, Done by default), cards for main tasks, and sub-tasks inside each card.

* **Two ways to start**: in Classroom, open an assignment and press **Create project** to tick members and give each one their own main task; or press **New project** on the Projects page.
* **Board**: drag cards between lists, or open a card and change its list. Cards in a list marked "counts as done" are finished.
* **Timeline**: a Gantt chart from each task's start date to its due date, with sub-tasks under their main task, a today line and day or week zoom.
* **Task list**: every task and sub-task in one table, with a filter for your own tasks and CSV export.
* **Who can do what** (enforced in the database): admins see every project; members see only projects they belong to. The person who creates a project leads it. Leads and admins manage people and delete lists; every project member adds, edits and moves tasks; a task can be deleted by its author, a lead or an admin. Only project members can be assigned.

## Check-in only on the school Wi-Fi

A browser cannot read the Wi-Fi name, so the rule works on the school's public internet address instead.
In **Settings → Check-in network**, an admin who is connected to the school Wi-Fi presses **Add the network I am on now**, ticks the rule and saves.
From then on the database (`guard_attendance`, `on_campus()`) refuses a member's check-in unless the request comes from a listed address. The address is read from the `cf-connecting-ip` header that Cloudflare sets in front of Supabase, which a member cannot change.
Booking days still works from anywhere and admins can always confirm attendance. The school Wi-Fi goes out through **several public addresses** (four were seen in November 2026: 123.24.206.19, 123.24.205.138, 123.24.206.55, 222.252.96.153), so list all of them. When a member is blocked, the address is recorded and appears under **Blocked check-ins** in Settings: if several members were blocked from the same address on lab days, press **Allow**, then Save.

Every account created, temporary password issued and access change is written to an **Account activity** log (Settings, admins only). Nobody can edit or delete it from the site.

## Security notes

* `index.html` sets a Content-Security-Policy: scripts only from this site, network only to the Supabase project, Crossref and Unpaywall. **If you move to another Supabase project, update the project URL in that policy as well as in `config.js`.**
* CSV exports put an apostrophe in front of any cell that starts with `=`, `+`, `-` or `@`, so text typed by members cannot run as a spreadsheet formula.
* Graded work is locked: a member cannot change a submission after it has a grade (delete the grade to reopen it). Deactivated accounts cannot change anything.

To make someone admin from the Supabase SQL editor: `select make_admin('name@example.com');`

## Setting up a fresh copy

1. Create a Supabase project. In the SQL editor, run `supabase/schema.sql`.
2. Authentication → Sign In / Providers: turn off **Allow new users to sign up**.
3. Authentication → URL Configuration: set **Site URL** to your Pages address and add `https://<user>.github.io/<repo>/**` to Redirect URLs.
4. Edge Functions → Deploy a new function → Via editor: name it `admin-users`, paste `supabase/functions/admin-users/index.ts`, deploy, then turn off **Verify JWT with legacy secret** (the function checks the caller itself).
5. Put the Project URL and the **publishable** key in `config.js`. Never put a secret or service_role key there.
6. Invite the first admin (Authentication → Users → Add user → Send invitation), then run `select make_admin('their@email');`.
7. GitHub repository → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
