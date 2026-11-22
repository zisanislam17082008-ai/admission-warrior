
-- Admission Warrior Database Schema

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'student',
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  kind text,
  description text,
  video_url text,
  file_path text,
  visibility text default 'all',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Automatically create profile after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role, status)
  values (new.id, new.email, 'student', 'pending')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.contents enable row level security;

-- Remove old policies before recreating
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Approved users can view content" on public.contents;
drop policy if exists "Main admin can insert content" on public.contents;

-- Profile policies
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- Content viewing policy
create policy "Approved users can view content"
on public.contents
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.status = 'approved'
  )
  and (
    visibility = 'all'
    or created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'main_admin'
    )
  )
);

-- Only Main Admin can upload content
create policy "Main admin can insert content"
on public.contents
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'main_admin'
    and p.status = 'approved'
  )
);

-- Private storage bucket
insert into storage.buckets (id, name, public)
values ('study-content', 'study-content', false)
on conflict (id) do update set public = false;

-- Storage policies
drop policy if exists "Main admin can upload study files" on storage.objects;
drop policy if exists "Approved users can read visible study files" on storage.objects;

create policy "Main admin can upload study files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'study-content'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'main_admin'
    and p.status = 'approved'
  )
);

create policy "Approved users can read visible study files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'study-content'
  and exists (
    select 1
    from public.contents c
    join public.profiles p on p.id = auth.uid()
    where c.file_path = name
    and p.status = 'approved'
    and (
      c.visibility = 'all'
      or c.created_by = auth.uid()
      or p.role = 'main_admin'
    )
  )
);
