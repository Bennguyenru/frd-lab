-- FRD Lab Hub: database schema, roles and access rules for Supabase.
-- Run this whole file once in Supabase: SQL Editor > New query > paste > Run.
-- It is safe to run again after an update: tables are kept, functions and rules are replaced.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------
-- Profiles: one row per account. role = admin | member | inactive
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  student_id text not null default '',
  lab_role text not null default 'Member',
  topic text not null default '',
  role text not null default 'member' check (role in ('admin','member','inactive')),
  must_change_password boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists class_name text not null default '';

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and not must_change_password)
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','member') and not must_change_password)
$$;

create or replace function public.local_today() returns date
language sql stable as $$ select (now() at time zone 'Asia/Ho_Chi_Minh')::date $$;

-- Every new auth user gets a profile. Roles are never taken from sign-up data.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Temporary passwords: the server remembers which password hash it handed out and when.
-- A person with a temporary password can do nothing in the lab (is_active() is false) until they
-- choose their own password, and the temporary one stops counting after 72 hours.
create table if not exists public.temp_passwords (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  pw_hash text,
  issued_at timestamptz not null default now()
);
alter table public.temp_passwords enable row level security;   -- no policies: only server functions read it
revoke all on public.temp_passwords from anon, authenticated;

create or replace function public.track_temp_password() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.must_change_password then
    if auth.uid() is null then                               -- set by the Edge Function or the SQL editor
      insert into public.temp_passwords (user_id, pw_hash, issued_at)
      select new.id, u.encrypted_password, now() from auth.users u where u.id = new.id
      on conflict (user_id) do update set pw_hash = excluded.pw_hash, issued_at = excluded.issued_at;
    end if;
  else
    delete from public.temp_passwords where user_id = new.id;
  end if;
  return null;
end $$;

-- Members may edit their own name, student ID, lab role and topic, never their access role.
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
declare h text; t timestamptz;
begin
  if auth.uid() is null then return new; end if;            -- SQL editor or server function
  if not public.is_admin() then
    new.role := old.role;
    new.email := old.email;
    if new.must_change_password and not old.must_change_password then
      new.must_change_password := false;                     -- only admins hand out temporary passwords
    elsif old.must_change_password and not new.must_change_password then
      select pw_hash, issued_at into h, t from public.temp_passwords where user_id = old.id;
      if t is null or t < now() - interval '72 hours' then raise exception 'temp_expired'; end if;
      if (select encrypted_password from auth.users where id = old.id) is not distinct from h then
        raise exception 'pw_unchanged';
      end if;
    end if;
  elsif old.role = 'admin' and new.role <> 'admin'
        and (select count(*) from public.profiles where role = 'admin') <= 1 then
    raise exception 'The lab needs at least one admin. Make someone else admin first.';
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();
drop trigger if exists track_temp_password on public.profiles;
create trigger track_temp_password after insert or update of must_change_password on public.profiles
  for each row execute function public.track_temp_password();

-- People who were already waiting to change a temporary password get 72 hours from this update.
insert into public.temp_passwords (user_id, pw_hash, issued_at)
select p.id, u.encrypted_password, now()
from public.profiles p join auth.users u on u.id = p.id
where p.must_change_password
on conflict (user_id) do nothing;

-- Admin account actions (accounts created, passwords reset, roles changed). Admins read it; only the server writes.
create table if not exists public.admin_audit (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid references public.profiles(id) on delete set null,
  action text not null,
  target uuid references public.profiles(id) on delete set null,
  detail text not null default ''
);
alter table public.admin_audit enable row level security;
revoke insert, update, delete on public.admin_audit from anon, authenticated;

create or replace function public.audit_role_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role then
    insert into public.admin_audit (actor, action, target, detail)
    values (auth.uid(), 'role_change', new.id, old.role || ' -> ' || new.role);
  end if;
  return null;
end $$;
drop trigger if exists audit_role_change on public.profiles;
create trigger audit_role_change after update of role on public.profiles
  for each row execute function public.audit_role_change();

-- Run in the SQL editor to make an existing account an admin:  select make_admin('name@example.com');
create or replace function public.make_admin(user_email text) returns text
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set role = 'admin' where lower(email) = lower(user_email);
  if not found then
    return 'No account with that email yet. Create or invite the account first, then run this again.';
  end if;
  return 'Done: ' || user_email || ' is now an admin.';
end $$;
revoke execute on function public.make_admin(text) from public, anon, authenticated;

-- ------------------------------------------------------------------
-- Lab data
-- ------------------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  min_days int not null default 1 check (min_days between 0 and 7),
  open_days int[] not null default '{0,1,2,3,4,5}',
  direction text not null default '',
  goals text not null default '',
  notice text not null default '',
  notice_at timestamptz,
  notice_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;
-- Check-in only from the school network (public IP of the campus Wi-Fi).
alter table public.settings add column if not exists campus_only boolean not null default false;
alter table public.settings add column if not exists campus_nets text[] not null default '{}';
alter table public.settings add column if not exists campus_wifi text not null default 'Gre_Guest';

create table if not exists public.assignments (
  id text primary key default gen_random_uuid()::text,
  kind text not null default 'bt' check (kind in ('bt','tl','tlieu')),
  title text not null,
  description text not null default '',
  link text not null default '',
  due text not null default '',
  points numeric not null default 10,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  day date not null,
  start_time text not null default '',
  end_time text not null default '',
  place text not null default '',
  link text not null default '',
  agenda text not null default '',
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  meeting_id text not null references public.meetings(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  status text not null check (status in ('yes','no')),
  updated_at timestamptz not null default now(),
  primary key (meeting_id, user_id)
);

create table if not exists public.attendance (
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  day date not null,
  booked boolean not null default false,
  checked_in_at timestamptz,
  confirmed_by uuid references public.profiles(id) on delete set null,
  primary key (user_id, day)
);

create table if not exists public.topics (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  body text not null default '',
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id text primary key default gen_random_uuid()::text,
  thread text not null,
  body text not null,
  by_manager boolean not null default false,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.library (
  id text primary key default gen_random_uuid()::text,
  doi text not null default '',
  title text not null,
  authors text not null default '',
  year text not null default '',
  venue text not null default '',
  url text not null default '',
  tags text not null default '',
  note text not null default '',
  is_oa boolean not null default false,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.papers (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  stage text not null default 'Idea',
  venue text not null default '',
  coauthors text not null default '',
  deadline date,
  link text not null default '',
  note text not null default '',
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  week_start date not null,
  done text not null default '',
  next_steps text not null default '',
  issues text not null default '',
  progress int not null default 0 check (progress between 0 and 100),
  link text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);

create table if not exists public.report_feedback (
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  body text not null default '',
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);

create table if not exists public.submissions (
  assignment_id text not null references public.assignments(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null default '',
  link text not null default '',
  submitted_at timestamptz not null default now(),
  primary key (assignment_id, user_id)
);

create table if not exists public.grades (
  assignment_id text not null references public.assignments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score numeric,
  feedback text not null default '',
  graded_by uuid default auth.uid() references public.profiles(id) on delete set null,
  graded_at timestamptz not null default now(),
  primary key (assignment_id, user_id)
);

-- Phone numbers are private: only the member and admins can read them.
create table if not exists public.contacts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  phone text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.directions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  body text not null default '',
  updated_by uuid default auth.uid() references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------
-- Server-side guards
-- ------------------------------------------------------------------
-- The caller's public IP. Supabase sits behind Cloudflare, which sets cf-connecting-ip itself.
-- Checked on 2026-11-19: a request that carries its own CF-Connecting-IP header is refused by
-- Cloudflare (403, error 1000), while x-forwarded-for keeps any value the client sends, so only
-- cf-connecting-ip is trusted here.
create or replace function public.client_ip() returns inet
language plpgsql stable set search_path = public as $$
declare h json; v text;
begin
  begin h := nullif(current_setting('request.headers', true), '')::json; exception when others then return null; end;
  v := trim(h->>'cf-connecting-ip');
  begin return v::inet; exception when others then return null; end;
end $$;

-- True when check-in from anywhere is allowed, or the caller is on a listed school network.
create or replace function public.on_campus() returns boolean
language plpgsql stable security definer set search_path = public as $$
declare req boolean; nets text[]; ip inet := public.client_ip(); n text;
begin
  select campus_only, campus_nets into req, nets from public.settings where id = 1;
  if not coalesce(req, false) then return true; end if;
  if ip is null then return false; end if;
  foreach n in array coalesce(nets, '{}') loop
    begin
      if n::inet >>= ip then return true; end if;
    exception when others then null;
    end;
  end loop;
  return false;
end $$;

create or replace function public.campus_status() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'ip', host(public.client_ip()),
    'required', coalesce((select campus_only from public.settings where id = 1), false),
    'wifi', coalesce((select campus_wifi from public.settings where id = 1), ''),
    'ok', public.on_campus())
$$;
revoke execute on function public.campus_status() from public, anon;
grant execute on function public.campus_status() to authenticated;

-- Check-in time always comes from the server clock, members only check in for today,
-- and only managers can confirm attendance or change past days.
create or replace function public.guard_attendance() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;
  if public.is_admin() then
    if new.confirmed_by is not null then new.confirmed_by := auth.uid(); end if;
    if new.checked_in_at is not null and (tg_op = 'INSERT' or old.checked_in_at is null) then
      new.checked_in_at := now();
    end if;
    return new;
  end if;
  if new.user_id <> auth.uid() then raise exception 'You can only change your own attendance.'; end if;
  if tg_op = 'INSERT' then
    new.confirmed_by := null;
    if new.day < public.local_today() then raise exception 'Past days cannot be changed.'; end if;
    if new.checked_in_at is not null then
      if new.day <> public.local_today() then raise exception 'You can only check in for today.'; end if;
      if not public.on_campus() then raise exception 'off_campus'; end if;
      new.checked_in_at := now(); new.booked := true;
    end if;
  else
    new.user_id := old.user_id; new.day := old.day;
    new.confirmed_by := old.confirmed_by;
    if new.checked_in_at is distinct from old.checked_in_at then
      if new.checked_in_at is null then
        if old.confirmed_by is not null then raise exception 'An admin confirmed this day, so it cannot be undone here.'; end if;
      else
        if new.day <> public.local_today() then raise exception 'You can only check in for today.'; end if;
        if old.checked_in_at is null and not public.on_campus() then raise exception 'off_campus'; end if;
        new.checked_in_at := coalesce(old.checked_in_at, now()); new.booked := true;
      end if;
    end if;
    if new.booked is distinct from old.booked and new.day < public.local_today() then
      raise exception 'Past days cannot be changed.';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists guard_attendance on public.attendance;
create trigger guard_attendance before insert or update on public.attendance
  for each row execute function public.guard_attendance();

-- Authorship and timestamps are set by the server, not the browser.
create or replace function public.stamp_owner() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;
  if tg_op = 'INSERT' then
    if not public.is_admin() or new.created_by is null then new.created_by := auth.uid(); end if;
    new.created_at := now();
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  if tg_table_name = 'comments' then new.by_manager := public.is_admin(); end if;
  if tg_table_name = 'papers' then new.updated_at := now(); end if;
  return new;
end $$;

create or replace function public.stamp_user_row() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;
  if tg_table_name in ('reports','submissions') and not public.is_admin() then
    new.user_id := auth.uid();
  end if;
  if tg_table_name = 'reports' then new.updated_at := now(); end if;
  if tg_table_name = 'submissions' then
    if not public.is_admin() and exists (select 1 from public.grades g
        where g.assignment_id = new.assignment_id and g.user_id = new.user_id) then
      raise exception 'graded_locked';
    end if;
    new.submitted_at := now();
  end if;
  if tg_table_name = 'grades' then new.graded_by := auth.uid(); new.graded_at := now(); end if;
  if tg_table_name in ('report_feedback') then new.created_by := auth.uid(); new.updated_at := now(); end if;
  if tg_table_name = 'directions' then new.updated_by := auth.uid(); new.updated_at := now(); end if;
  if tg_table_name in ('rsvps','contacts') then new.updated_at := now(); end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['topics','comments','library','papers'] loop
    execute format('drop trigger if exists stamp_owner on public.%I', t);
    execute format('create trigger stamp_owner before insert or update on public.%I for each row execute function public.stamp_owner()', t);
  end loop;
  foreach t in array array['reports','submissions','grades','report_feedback','directions','rsvps','contacts'] loop
    execute format('drop trigger if exists stamp_user_row on public.%I', t);
    execute format('create trigger stamp_user_row before insert or update on public.%I for each row execute function public.stamp_user_row()', t);
  end loop;
end $$;

-- ------------------------------------------------------------------
-- Row level security
-- ------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('profiles','settings','assignments','meetings','rsvps','attendance','topics','comments',
                      'library','papers','reports','report_feedback','submissions','grades','directions','contacts',
                      'admin_audit','temp_passwords')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.assignments enable row level security;
alter table public.meetings enable row level security;
alter table public.rsvps enable row level security;
alter table public.attendance enable row level security;
alter table public.topics enable row level security;
alter table public.comments enable row level security;
alter table public.library enable row level security;
alter table public.papers enable row level security;
alter table public.reports enable row level security;
alter table public.report_feedback enable row level security;
alter table public.submissions enable row level security;
alter table public.grades enable row level security;
alter table public.directions enable row level security;
alter table public.contacts enable row level security;

-- profiles: active members see the roster; everyone sees their own row
create policy profiles_read on public.profiles for select to authenticated
  using (public.is_active() or id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- settings, assignments, meetings: everyone active reads, managers write
create policy settings_read on public.settings for select to authenticated using (public.is_active());
create policy settings_write on public.settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy assignments_read on public.assignments for select to authenticated using (public.is_active());
create policy assignments_insert on public.assignments for insert to authenticated with check (public.is_admin());
create policy assignments_update on public.assignments for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy assignments_delete on public.assignments for delete to authenticated using (public.is_admin());

create policy meetings_read on public.meetings for select to authenticated using (public.is_active());
create policy meetings_insert on public.meetings for insert to authenticated with check (public.is_admin());
create policy meetings_update on public.meetings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy meetings_delete on public.meetings for delete to authenticated using (public.is_admin());

-- rsvps and attendance: everyone active reads; members write their own rows, managers any
create policy rsvps_read on public.rsvps for select to authenticated using (public.is_active());
create policy rsvps_insert on public.rsvps for insert to authenticated with check (public.is_active() and user_id = auth.uid());
create policy rsvps_update on public.rsvps for update to authenticated
  using (public.is_active() and user_id = auth.uid()) with check (public.is_active() and user_id = auth.uid());
create policy rsvps_delete on public.rsvps for delete to authenticated using ((public.is_active() and user_id = auth.uid()) or public.is_admin());

create policy attendance_read on public.attendance for select to authenticated using (public.is_active());
create policy attendance_insert on public.attendance for insert to authenticated
  with check ((public.is_active() and user_id = auth.uid()) or public.is_admin());
create policy attendance_update on public.attendance for update to authenticated
  using ((public.is_active() and user_id = auth.uid()) or public.is_admin())
  with check ((public.is_active() and user_id = auth.uid()) or public.is_admin());
create policy attendance_delete on public.attendance for delete to authenticated using (public.is_admin());

-- shared content: everyone active reads; authors edit their own, managers moderate
do $$
declare t text;
begin
  foreach t in array array['topics','comments','library','papers'] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.is_active())', t||'_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_active() and (created_by = auth.uid() or public.is_admin()))', t||'_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (created_by = auth.uid() or public.is_admin()) with check (created_by = auth.uid() or public.is_admin())', t||'_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (created_by = auth.uid() or public.is_admin())', t||'_delete', t);
  end loop;
end $$;

-- private work: each member sees and writes their own; managers see everything
create policy reports_read on public.reports for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy reports_insert on public.reports for insert to authenticated with check (public.is_active() and user_id = auth.uid());
create policy reports_update on public.reports for update to authenticated
  using (public.is_active() and user_id = auth.uid()) with check (public.is_active() and user_id = auth.uid());

create policy submissions_read on public.submissions for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy submissions_insert on public.submissions for insert to authenticated with check (public.is_active() and user_id = auth.uid());
create policy submissions_update on public.submissions for update to authenticated
  using (public.is_active() and user_id = auth.uid()) with check (public.is_active() and user_id = auth.uid());

create policy contacts_read on public.contacts for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy contacts_insert on public.contacts for insert to authenticated
  with check ((public.is_active() and user_id = auth.uid()) or public.is_admin());
create policy contacts_update on public.contacts for update to authenticated
  using ((public.is_active() and user_id = auth.uid()) or public.is_admin())
  with check ((public.is_active() and user_id = auth.uid()) or public.is_admin());
create policy contacts_delete on public.contacts for delete to authenticated using (public.is_admin());

create policy admin_audit_read on public.admin_audit for select to authenticated using (public.is_admin());

-- manager feedback: members read their own, only managers write
do $$
declare t text;
begin
  foreach t in array array['grades','report_feedback','directions'] loop
    execute format('create policy %I on public.%I for select to authenticated using (user_id = auth.uid() or public.is_admin())', t||'_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin())', t||'_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t||'_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin())', t||'_delete', t);
  end loop;
end $$;

-- ------------------------------------------------------------------
-- Live updates (Supabase Realtime respects the rules above)
-- ------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles','settings','assignments','meetings','rsvps','attendance','topics','comments',
                           'library','papers','reports','report_feedback','submissions','grades','directions','contacts'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object or undefined_object then null;
    end;
  end loop;
end $$;
