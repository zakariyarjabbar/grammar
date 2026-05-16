import { ArrowRight, FileQuestion, Layers3, LibraryBig, NotebookText, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { requireAdmin } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic, Lesson, Question } from "@/types/database";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [
    { data: levels },
    { data: topics },
    { data: lessons },
    { data: questions },
    { count: userCount },
  ] = await Promise.all([
    supabase
      .from("grammar_levels")
      .select("*")
      .in("slug", [...CORE_LEVEL_SLUGS])
      .order("level_order")
      .returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").returns<GrammarTopic[]>(),
    supabase.from("lessons").select("*").returns<Lesson[]>(),
    supabase.from("questions").select("*").returns<Question[]>(),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);
  const coreLevelIds = new Set((levels ?? []).map((level) => level.id));
  const coreTopics = (topics ?? []).filter((topic) => coreLevelIds.has(topic.level_id));
  const coreTopicIds = new Set(coreTopics.map((topic) => topic.id));
  const coreLessons = (lessons ?? []).filter((lesson) => coreTopicIds.has(lesson.topic_id));
  const coreLessonIds = new Set(coreLessons.map((lesson) => lesson.id));
  const coreQuestions = (questions ?? []).filter(
    (question) =>
      (question.lesson_id && coreLessonIds.has(question.lesson_id)) ||
      (question.topic_id && coreTopicIds.has(question.topic_id))
  );
  const recentLessons = [...coreLessons]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);
  const recentQuestions = [...coreQuestions]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <>
      <PageHeader
        description="Manage the version 1 grammar curriculum and review core content totals."
        eyebrow="Admin"
        action={
          <ButtonLink href="/dashboard" variant="secondary">
            Back to app
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
        title="Admin dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard icon={<Layers3 className="h-5 w-5" />} label="Levels" value={(levels ?? []).length} />
        <StatCard icon={<LibraryBig className="h-5 w-5" />} label="Topics" value={coreTopics.length} />
        <StatCard icon={<NotebookText className="h-5 w-5" />} label="Lessons" value={coreLessons.length} />
        <StatCard icon={<FileQuestion className="h-5 w-5" />} label="Questions" value={coreQuestions.length} />
        <StatCard icon={<FileQuestion className="h-5 w-5" />} label="Tests" value={coreQuestions.filter((question) => question.question_scope !== "practice").length} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Profiles" value={userCount ?? 0} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold text-ink">Quick actions</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ButtonLink href="/admin/levels">Manage Levels</ButtonLink>
            <ButtonLink href="/admin/topics" variant="secondary">Add Topic</ButtonLink>
            <ButtonLink href="/admin/lessons" variant="secondary">Add Lesson</ButtonLink>
            <ButtonLink href="/admin/questions" variant="secondary">Add Question</ButtonLink>
          </div>
          <div className="grid gap-4 text-base leading-7 text-body md:grid-cols-2">
            <p>
              Use the admin pages to manage the three-level grammar path, topics, lessons, and questions.
              Published records become visible to learners immediately.
            </p>
            <p>
              Keep lesson content concise and attach questions to lessons when you want progress to
              update automatically after practice.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-ink">Recent lessons</h2>
            <p className="mt-1 text-sm text-body">Latest lesson records updated by admins.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(recentLessons ?? []).map((lesson) => (
              <div className="rounded-lg border border-line bg-secondary p-4" key={lesson.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-ink">{lesson.title}</p>
                  <Badge tone={lesson.is_published ? "green" : "gray"}>
                    {lesson.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{new Date(lesson.updated_at).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-ink">Recent questions</h2>
            <p className="mt-1 text-sm text-body">Latest practice and test content in the question bank.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(recentQuestions ?? []).map((question) => (
              <div className="rounded-lg border border-line bg-secondary p-4" key={question.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-ink">{question.prompt}</p>
                  <Badge tone={question.is_published ? "green" : "gray"}>
                    {question.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm capitalize text-muted">{question.question_scope.replaceAll("_", " ")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
