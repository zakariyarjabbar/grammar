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

create index if not exists questions_metadata_idx
on public.questions(difficulty, question_scope, question_type);
