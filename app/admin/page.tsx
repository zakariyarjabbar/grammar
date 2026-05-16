import { FileQuestion, Layers3, LibraryBig, NotebookText, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [
    { count: levelCount },
    { count: topicCount },
    { count: lessonCount },
    { count: questionCount },
    { count: testCount },
    { count: userCount }
  ] = await Promise.all([
    supabase.from("grammar_levels").select("*", { count: "exact", head: true }),
    supabase.from("grammar_topics").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("questions").select("*", { count: "exact", head: true }),
    supabase.from("questions").select("*", { count: "exact", head: true }).neq("question_scope", "practice"),
    supabase.from("profiles").select("*", { count: "exact", head: true })
  ]);

  return (
    <>
      <PageHeader
        description="Manage the version 1 grammar curriculum and review core content totals."
        eyebrow="Admin"
        title="Admin dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard icon={<Layers3 className="h-5 w-5" />} label="Levels" value={levelCount ?? 0} />
        <StatCard icon={<LibraryBig className="h-5 w-5" />} label="Topics" value={topicCount ?? 0} />
        <StatCard icon={<NotebookText className="h-5 w-5" />} label="Lessons" value={lessonCount ?? 0} />
        <StatCard icon={<FileQuestion className="h-5 w-5" />} label="Questions" value={questionCount ?? 0} />
        <StatCard icon={<FileQuestion className="h-5 w-5" />} label="Tests" value={testCount ?? 0} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Profiles" value={userCount ?? 0} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold text-ink">Quick actions</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/admin/lessons">Add lesson</ButtonLink>
            <ButtonLink href="/admin/questions" variant="secondary">Add question</ButtonLink>
            <ButtonLink href="/admin/topics" variant="secondary">Add topic</ButtonLink>
          </div>
          <div className="grid gap-4 text-base leading-7 text-muted md:grid-cols-2">
            <p>
              Use the admin pages to create grammar levels, topics, lessons, and questions. Published
              records become visible to learners immediately.
            </p>
            <p>
              Keep lesson content concise and attach questions to lessons when you want progress to
              update automatically after practice.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
