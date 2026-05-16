create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('user', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.question_type as enum (
    'multiple_choice',
    'fill_blank',
    'true_false',
    'sentence_correction'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.lesson_progress_status as enum ('not_started', 'in_progress', 'completed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'user',
  current_level_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grammar_levels (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  level_order integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_current_level_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_current_level_id_fkey
      foreign key (current_level_id) references public.grammar_levels(id) on delete set null;
  end if;
end $$;

create table if not exists public.grammar_topics (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.grammar_levels(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  topic_order integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (level_id, slug)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.grammar_topics(id) on delete cascade,
  title text not null,
  slug text not null,
  difficulty text not null default 'easy',
  summary text,
  explanation text not null,
  formula text,
  usage_when text,
  usage_when_not text,
  examples jsonb not null default '[]'::jsonb,
  common_mistakes jsonb not null default '[]'::jsonb,
  wrong_correct_examples jsonb not null default '[]'::jsonb,
  short_notes jsonb not null default '[]'::jsonb,
  mini_practice jsonb not null default '[]'::jsonb,
  lesson_order integer not null default 1,
  estimated_minutes integer not null default 8,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  topic_id uuid references public.grammar_topics(id) on delete cascade,
  question_type public.question_type not null,
  difficulty text not null default 'easy',
  question_scope text not null default 'practice',
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  wrong_answer_explanation text,
  question_order integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_lesson_or_topic_check check (lesson_id is not null or topic_id is not null)
);

alter table public.lessons
  add column if not exists difficulty text not null default 'easy',
  add column if not exists usage_when text,
  add column if not exists usage_when_not text,
  add column if not exists wrong_correct_examples jsonb not null default '[]'::jsonb,
  add column if not exists short_notes jsonb not null default '[]'::jsonb,
  add column if not exists mini_practice jsonb not null default '[]'::jsonb;

alter table public.questions
  add column if not exists difficulty text not null default 'easy',
  add column if not exists question_scope text not null default 'practice',
  add column if not exists wrong_answer_explanation text;

create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status public.lesson_progress_status not null default 'not_started',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.user_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  answer text not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  submitted_answer text not null,
  correct_answer text not null,
  is_resolved boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists grammar_levels_order_idx on public.grammar_levels(level_order);
create index if not exists grammar_topics_level_order_idx on public.grammar_topics(level_id, topic_order);
create index if not exists lessons_topic_order_idx on public.lessons(topic_id, lesson_order);
create index if not exists questions_lesson_order_idx on public.questions(lesson_id, question_order);
create index if not exists questions_metadata_idx on public.questions(difficulty, question_scope, question_type);
create index if not exists user_answers_user_idx on public.user_answers(user_id, created_at desc);
create index if not exists user_mistakes_user_idx on public.user_mistakes(user_id, is_resolved, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_grammar_levels_updated_at on public.grammar_levels;
create trigger set_grammar_levels_updated_at
before update on public.grammar_levels
for each row execute function public.set_updated_at();

drop trigger if exists set_grammar_topics_updated_at on public.grammar_topics;
create trigger set_grammar_topics_updated_at
before update on public.grammar_topics
for each row execute function public.set_updated_at();

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

drop trigger if exists set_questions_updated_at on public.questions;
create trigger set_questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

drop trigger if exists set_user_lesson_progress_updated_at on public.user_lesson_progress;
create trigger set_user_lesson_progress_updated_at
before update on public.user_lesson_progress
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_admin_role_change on public.profiles;
create trigger prevent_non_admin_role_change
before update on public.profiles
for each row execute function public.prevent_non_admin_role_change();

alter table public.profiles enable row level security;
alter table public.grammar_levels enable row level security;
alter table public.grammar_topics enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_answers enable row level security;
alter table public.user_mistakes enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles for insert to authenticated
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Published levels are readable" on public.grammar_levels;
create policy "Published levels are readable"
on public.grammar_levels for select to authenticated
using (is_published or public.is_admin());

drop policy if exists "Admins manage levels" on public.grammar_levels;
create policy "Admins manage levels"
on public.grammar_levels for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published topics are readable" on public.grammar_topics;
create policy "Published topics are readable"
on public.grammar_topics for select to authenticated
using (is_published or public.is_admin());

drop policy if exists "Admins manage topics" on public.grammar_topics;
create policy "Admins manage topics"
on public.grammar_topics for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published lessons are readable" on public.lessons;
create policy "Published lessons are readable"
on public.lessons for select to authenticated
using (is_published or public.is_admin());

drop policy if exists "Admins manage lessons" on public.lessons;
create policy "Admins manage lessons"
on public.lessons for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published questions are readable" on public.questions;
create policy "Published questions are readable"
on public.questions for select to authenticated
using (is_published or public.is_admin());

drop policy if exists "Admins manage questions" on public.questions;
create policy "Admins manage questions"
on public.questions for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users read own lesson progress" on public.user_lesson_progress;
create policy "Users read own lesson progress"
on public.user_lesson_progress for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users insert own lesson progress" on public.user_lesson_progress;
create policy "Users insert own lesson progress"
on public.user_lesson_progress for insert to authenticated
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users update own lesson progress" on public.user_lesson_progress;
create policy "Users update own lesson progress"
on public.user_lesson_progress for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users read own answers" on public.user_answers;
create policy "Users read own answers"
on public.user_answers for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users insert own answers" on public.user_answers;
create policy "Users insert own answers"
on public.user_answers for insert to authenticated
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users read own mistakes" on public.user_mistakes;
create policy "Users read own mistakes"
on public.user_mistakes for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users insert own mistakes" on public.user_mistakes;
create policy "Users insert own mistakes"
on public.user_mistakes for insert to authenticated
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users update own mistakes" on public.user_mistakes;
create policy "Users update own mistakes"
on public.user_mistakes for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
