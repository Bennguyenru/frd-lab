-- FRD Lab Hub: project boards (Trello-style), part of schema.sql.
-- Safe to run again. Needs the functions from schema.sql (is_admin, is_active, local_today).

create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null check (length(trim(title)) between 1 and 200),
  description text not null default '',
  start_date date,
  due_date date,
  assignment_id text references public.assignments(id) on delete set null,
  archived boolean not null default false,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id text not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('lead', 'member')),
  added_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.project_lists (
  id text primary key default gen_random_uuid()::text,
  project_id text not null references public.projects(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 80),
  position double precision not null default 0,
  is_done boolean not null default false
);

create table if not exists public.project_tasks (
  id text primary key default gen_random_uuid()::text,
  project_id text not null references public.projects(id) on delete cascade,
  list_id text references public.project_lists(id) on delete set null,
  parent_id text references public.project_tasks(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 300),
  description text not null default '',
  assignees uuid[] not null default '{}',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  start_date date,
  due_date date,
  done boolean not null default false,
  done_at timestamptz,
  position double precision not null default 0,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists project_tasks_project on public.project_tasks(project_id);
create index if not exists project_lists_project on public.project_lists(project_id);
create index if not exists project_members_user on public.project_members(user_id);

-- Who may see and change a project
create or replace function public.is_project_member(p text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_active() and exists (
    select 1 from public.project_members where project_id = p and user_id = auth.uid())
$$;

create or replace function public.can_manage_project(p text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or (public.is_active() and exists (
    select 1 from public.project_members where project_id = p and user_id = auth.uid() and role = 'lead'))
$$;

-- Server-side stamps and checks
create or replace function public.guard_project() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then new.created_by := auth.uid(); end if;
    new.created_at := now();
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  if new.start_date is not null and new.due_date is not null and new.due_date < new.start_date then
    raise exception 'The end date cannot be before the start date.';
  end if;
  if (new.start_date is not null and new.start_date not between date '2000-01-01' and date '2100-12-31')
     or (new.due_date is not null and new.due_date not between date '2000-01-01' and date '2100-12-31') then
    raise exception 'Use dates between the years 2000 and 2100.';
  end if;
  -- Only admins link a project to a classroom assignment.
  if auth.uid() is not null and not public.is_admin() and new.assignment_id is not null
     and (tg_op = 'INSERT' or new.assignment_id is distinct from old.assignment_id) then
    raise exception 'Only admins can link a project to a classroom assignment.';
  end if;
  return new;
end $$;
drop trigger if exists guard_project on public.projects;
create trigger guard_project before insert or update on public.projects
  for each row execute function public.guard_project();

-- The person who creates a project leads it.
create or replace function public.project_add_creator() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.created_by is not null then
    insert into public.project_members (project_id, user_id, role)
    values (new.id, new.created_by, 'lead')
    on conflict (project_id, user_id) do update set role = 'lead';
  end if;
  return new;
end $$;
drop trigger if exists project_add_creator on public.projects;
create trigger project_add_creator after insert on public.projects
  for each row execute function public.project_add_creator();

create or replace function public.guard_project_list() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then new.project_id := old.project_id; end if;
  return new;
end $$;
drop trigger if exists guard_project_list on public.project_lists;
create trigger guard_project_list before insert or update on public.project_lists
  for each row execute function public.guard_project_list();

-- Marking a list as "done" (or not) updates the cards already in it.
create or replace function public.sync_list_done() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.is_done is distinct from old.is_done then
    update public.project_tasks set done = new.is_done
    where list_id = new.id and parent_id is null and done is distinct from new.is_done;
  end if;
  return null;
end $$;
drop trigger if exists sync_list_done on public.project_lists;
create trigger sync_list_done after update of is_done on public.project_lists
  for each row execute function public.sync_list_done();

-- Only active lab accounts can join a project.
create or replace function public.guard_project_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then new.project_id := old.project_id; new.user_id := old.user_id; end if;
  if not exists (select 1 from public.profiles where id = new.user_id and role <> 'inactive') then
    raise exception 'Only active lab members can join a project.';
  end if;
  return new;
end $$;
drop trigger if exists guard_project_member on public.project_members;
create trigger guard_project_member before insert or update on public.project_members
  for each row execute function public.guard_project_member();

create or replace function public.guard_project_task() returns trigger
language plpgsql security definer set search_path = public as $$
declare lp text; ldone boolean; pp text; ppar text; outsiders int;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then new.created_by := auth.uid(); end if;
    new.created_at := now();
  else
    new.project_id := old.project_id;
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();

  -- A sub-task hangs under a main task of the same project; sub-tasks have no sub-tasks.
  if new.parent_id is not null then
    select project_id, parent_id into pp, ppar from public.project_tasks where id = new.parent_id;
    if pp is distinct from new.project_id then raise exception 'The main task belongs to another project.'; end if;
    if ppar is not null then raise exception 'A sub-task cannot have its own sub-tasks.'; end if;
    if new.parent_id = new.id then raise exception 'A task cannot be its own sub-task.'; end if;
    if tg_op = 'UPDATE' and exists (select 1 from public.project_tasks c where c.parent_id = new.id) then
      raise exception 'A task that has sub-tasks cannot become a sub-task.';
    end if;
    new.list_id := null;
  end if;

  -- Moving a card into a "done" list ticks it, moving it out unticks it.
  if new.list_id is not null then
    select project_id, is_done into lp, ldone from public.project_lists where id = new.list_id;
    if lp is distinct from new.project_id then raise exception 'That list belongs to another project.'; end if;
    if tg_op = 'INSERT' or new.list_id is distinct from old.list_id then new.done := ldone; end if;
  end if;

  if new.done and (tg_op = 'INSERT' or not old.done) then new.done_at := now(); end if;
  if not new.done then new.done_at := null; end if;

  if new.start_date is not null and new.due_date is not null and new.due_date < new.start_date then
    raise exception 'The due date cannot be before the start date.';
  end if;
  if (new.start_date is not null and new.start_date not between date '2000-01-01' and date '2100-12-31')
     or (new.due_date is not null and new.due_date not between date '2000-01-01' and date '2100-12-31') then
    raise exception 'Use dates between the years 2000 and 2100.';
  end if;

  select count(*) into outsiders from unnest(new.assignees) a
  where not exists (select 1 from public.project_members m where m.project_id = new.project_id and m.user_id = a);
  if outsiders > 0 then raise exception 'Only project members can be assigned to a task.'; end if;
  new.assignees := array(select distinct unnest(new.assignees));
  return new;
end $$;
drop trigger if exists guard_project_task on public.project_tasks;
create trigger guard_project_task before insert or update on public.project_tasks
  for each row execute function public.guard_project_task();

-- Removing someone from a project also takes them off its tasks.
create or replace function public.project_member_removed() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.project_tasks set assignees = array_remove(assignees, old.user_id)
  where project_id = old.project_id and old.user_id = any(assignees);
  return old;
end $$;
drop trigger if exists project_member_removed on public.project_members;
create trigger project_member_removed after delete on public.project_members
  for each row execute function public.project_member_removed();

-- Create a project in one step: default lists, members, and (optionally) one main task per member.
-- Runs with the caller's rights, so the access rules below still apply.
create or replace function public.create_project(
  p_title text, p_description text default '', p_start date default null, p_due date default null,
  p_assignment text default null, p_members uuid[] default '{}', p_task_per_member boolean default false,
  p_task_title text default null
) returns text
language plpgsql security invoker set search_path = public as $$
declare pid text; todo text; u uuid; i int := 0;
begin
  if not public.is_active() then raise exception 'Your account is not active in the lab.'; end if;
  if p_assignment is not null and not public.is_admin() then
    raise exception 'Only admins can turn a classroom assignment into a project.';
  end if;
  insert into public.projects (title, description, start_date, due_date, assignment_id)
  values (trim(p_title), coalesce(p_description, ''), p_start, p_due, p_assignment)
  returning id into pid;
  insert into public.project_lists (project_id, title, position, is_done) values
    (pid, 'To do', 1, false), (pid, 'In progress', 2, false), (pid, 'Review', 3, false), (pid, 'Done', 4, true);
  select id into todo from public.project_lists where project_id = pid and position = 1;
  insert into public.project_members (project_id, user_id, role)
  select pid, m, 'member' from unnest(coalesce(p_members, '{}')) m
  join public.profiles pr on pr.id = m and pr.role <> 'inactive'
  on conflict (project_id, user_id) do nothing;
  if p_task_per_member then
    foreach u in array coalesce(p_members, '{}') loop
      if exists (select 1 from public.project_members where project_id = pid and user_id = u) then
        i := i + 1;
        insert into public.project_tasks (project_id, list_id, title, assignees, start_date, due_date, position)
        select pid, todo, coalesce(nullif(trim(p_task_title), ''), trim(p_title)) || ': ' || coalesce(nullif(pr.full_name, ''), pr.email),
               array[u], p_start, p_due, i
        from public.profiles pr where pr.id = u;
      end if;
    end loop;
  end if;
  return pid;
end $$;
revoke execute on function public.create_project(text, text, date, date, text, uuid[], boolean, text) from public, anon;
grant execute on function public.create_project(text, text, date, date, text, uuid[], boolean, text) to authenticated;

-- Access rules
do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('projects', 'project_members', 'project_lists', 'project_tasks')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_lists enable row level security;
alter table public.project_tasks enable row level security;

-- Projects: admins see all; members see the projects they belong to (and ones they just created).
create policy projects_read on public.projects for select to authenticated
  using (public.is_admin() or public.is_project_member(id) or (public.is_active() and created_by = auth.uid()));
create policy projects_insert on public.projects for insert to authenticated
  with check (public.is_active());
create policy projects_update on public.projects for update to authenticated
  using (public.can_manage_project(id)) with check (public.can_manage_project(id));
create policy projects_delete on public.projects for delete to authenticated
  using (public.can_manage_project(id));

-- Members: visible to the project; leads and admins add, change and remove people.
create policy project_members_read on public.project_members for select to authenticated
  using (public.is_admin() or public.is_project_member(project_id));
create policy project_members_insert on public.project_members for insert to authenticated
  with check (public.can_manage_project(project_id));
create policy project_members_update on public.project_members for update to authenticated
  using (public.can_manage_project(project_id)) with check (public.can_manage_project(project_id));
create policy project_members_delete on public.project_members for delete to authenticated
  using (public.can_manage_project(project_id));

-- Lists: any project member adds or renames a list; leads and admins delete lists.
create policy project_lists_read on public.project_lists for select to authenticated
  using (public.is_admin() or public.is_project_member(project_id));
create policy project_lists_insert on public.project_lists for insert to authenticated
  with check (public.is_admin() or public.is_project_member(project_id));
create policy project_lists_update on public.project_lists for update to authenticated
  using (public.is_admin() or public.is_project_member(project_id))
  with check (public.is_admin() or public.is_project_member(project_id));
create policy project_lists_delete on public.project_lists for delete to authenticated
  using (public.can_manage_project(project_id));

-- Tasks: any project member adds, edits and moves tasks; the author, leads and admins delete them.
create policy project_tasks_read on public.project_tasks for select to authenticated
  using (public.is_admin() or public.is_project_member(project_id));
create policy project_tasks_insert on public.project_tasks for insert to authenticated
  with check (public.is_admin() or public.is_project_member(project_id));
create policy project_tasks_update on public.project_tasks for update to authenticated
  using (public.is_admin() or public.is_project_member(project_id))
  with check (public.is_admin() or public.is_project_member(project_id));
create policy project_tasks_delete on public.project_tasks for delete to authenticated
  using (public.can_manage_project(project_id) or (public.is_project_member(project_id) and created_by = auth.uid()));

-- Live updates
do $$
declare t text;
begin
  foreach t in array array['projects', 'project_members', 'project_lists', 'project_tasks'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object or undefined_object then null;
    end;
  end loop;
end $$;
