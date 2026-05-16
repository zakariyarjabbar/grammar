# GrammarFlow

A version 1 English grammar learning platform built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, and Vercel-ready deployment.

## Features

- Supabase email/password authentication
- User profiles with `user` and `admin` roles
- Protected learner routes and protected admin routes
- Grammar levels, topics, lessons, and practice questions
- Three-level curriculum path: Beginner, Intermediate, and Advanced
- Lesson metadata for difficulty, usage guidance, wrong/correct examples, notes, and mini practice
- Question metadata for difficulty and scope: practice, lesson test, topic test, level test, mixed test, mistake focus, and final exam
- Answer checking for multiple choice, fill in the blank, true or false, and sentence correction
- Saved answer history, lesson progress, and unresolved mistakes
- Admin create/edit/delete screens for levels, topics, lessons, and questions
- Responsive public header, learner sidebar, mobile menu, and admin layouts

## Project Structure

- `app/` - App Router pages and layouts
- `components/` - reusable UI, auth, layout, and learning components
- `lib/actions/` - server actions for auth, admin CRUD, and practice
- `lib/supabase/` - Supabase server/browser client setup
- `types/` - TypeScript database types
- `supabase/schema.sql` - database tables, triggers, functions, indexes, and RLS
- `supabase/migrations/001_curriculum_metadata.sql` - update script for existing projects
- `supabase/seed.sql` - three-level academy curriculum path, detailed starter lessons, and practice questions

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project and enable email/password auth.

3. In the Supabase SQL editor, run:

```sql
-- First
-- supabase/schema.sql

-- Then
-- supabase/seed.sql
```

For an existing project that already ran the first schema, run this before the seed:

```sql
-- supabase/migrations/001_curriculum_metadata.sql
-- supabase/seed.sql
```

4. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

5. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

6. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Make an Admin

Register a user in the app first. Then run this in Supabase SQL, replacing the email:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

Admin routes are available under `/admin`.

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the same environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL.
5. Deploy.

## Useful Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

## Curriculum Seed

The seed creates the full academy path:

- Beginner
- Intermediate
- Advanced

It also adds the complete topic roadmap for each level. To keep the repo maintainable, the seed deeply populates the first 15 core lessons with full lesson content, examples, common mistakes, wrong/correct examples, short notes, mini practice, and 8 practice questions each. The admin system is ready to expand every topic into many lessons and question sets over time.

## Version 1 Notes

This version intentionally does not include XP, badges, streaks, placement tests, payments, AI tutor features, or advanced charts. The schema and route structure are designed so those can be added later without reshaping the core learning flow.
