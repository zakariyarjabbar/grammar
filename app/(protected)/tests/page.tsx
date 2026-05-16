import { ClipboardCheck, FileQuestion, Layers3, LibraryBig } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic, Lesson, Question, QuestionScope } from "@/types/database";

const testScopes: { scope: QuestionScope; label: string; description: string; icon: typeof ClipboardCheck }[] = [
  {
    scope: "lesson_test",
    label: "Lesson tests",
    description: "Focused checks connected to individual lessons.",
    icon: FileQuestion
  },
  {
    scope: "topic_test",
    label: "Topic tests",
    description: "Broader checks across a grammar topic.",
    icon: LibraryBig
  },
  {
    scope: "level_test",
    label: "Level tests",
    description: "Review questions for a full curriculum level.",
    icon: Layers3
  },
  {
    scope: "mixed_test",
    label: "Mixed tests",
    description: "Combined questions for cumulative grammar review.",
    icon: ClipboardCheck
  }
];

export default async function TestsPage() {
  const { supabase } = await requireUser();
  const [{ data: levels }, { data: topics }, { data: questions }, { data: lessons }] = await Promise.all([
    supabase
      .from("grammar_levels")
      .select("*")
      .eq("is_published", true)
      .in("slug", [...CORE_LEVEL_SLUGS])
      .returns<GrammarLevel[]>(),
    supabase
      .from("grammar_topics")
      .select("*")
      .eq("is_published", true)
      .returns<GrammarTopic[]>(),
    supabase
      .from("questions")
      .select("*")
      .eq("is_published", true)
      .neq("question_scope", "practice")
      .order("question_order")
      .returns<Question[]>(),
    supabase.from("lessons").select("*").eq("is_published", true).returns<Lesson[]>()
  ]);

  const coreLevelIds = new Set((levels ?? []).map((level) => level.id));
  const coreTopicIds = new Set((topics ?? []).filter((topic) => coreLevelIds.has(topic.level_id)).map((topic) => topic.id));
  const safeLessons = (lessons ?? []).filter((lesson) => coreTopicIds.has(lesson.topic_id));
  const coreLessonIds = new Set(safeLessons.map((lesson) => lesson.id));
  const safeQuestions = (questions ?? []).filter(
    (question) =>
      (question.lesson_id && coreLessonIds.has(question.lesson_id)) ||
      (question.topic_id && coreTopicIds.has(question.topic_id))
  );
  const lessonById = new Map(safeLessons.map((lesson) => [lesson.id, lesson]));

  return (
    <>
      <PageHeader
        description="Test questions are part of the curriculum bank. Dedicated test sessions will appear here only when the existing question data supports them."
        eyebrow="Tests"
        action={<ButtonLink href="/practice" variant="secondary">Open Practice Library</ButtonLink>}
        title="Grammar Tests"
      />

      {safeQuestions.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {testScopes.map((item) => {
            const Icon = item.icon;
            const scopedQuestions = safeQuestions.filter((question) => question.question_scope === item.scope);
            const lessonsCovered = new Set(scopedQuestions.map((question) => question.lesson_id).filter(Boolean)).size;

            return (
              <Card key={item.scope}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primarySoft text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-ink">{item.label}</h2>
                        <p className="mt-1 text-sm leading-6 text-body">{item.description}</p>
                      </div>
                    </div>
                    <Badge tone={scopedQuestions.length ? "blue" : "gray"}>
                      {scopedQuestions.length} questions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {scopedQuestions.length ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-line bg-secondary p-4">
                          <p className="text-2xl font-semibold text-ink">{lessonsCovered}</p>
                          <p className="text-sm text-muted">Lessons covered</p>
                        </div>
                        <div className="rounded-lg border border-line bg-secondary p-4">
                          <p className="text-2xl font-semibold text-ink">
                            {scopedQuestions.filter((question) => question.difficulty === "hard").length}
                          </p>
                          <p className="text-sm text-muted">Hard questions</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {scopedQuestions.slice(0, 3).map((question) => (
                          <div className="rounded-lg border border-line bg-white p-3" key={question.id}>
                            <p className="text-sm font-semibold text-ink">{question.prompt}</p>
                            <p className="mt-1 text-xs text-muted">
                              {question.lesson_id ? lessonById.get(question.lesson_id)?.title ?? "Lesson test" : "Curriculum test"}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm leading-6 text-body">
                        These questions are available in the curriculum bank. Startable dedicated test sessions are intentionally not shown until that route is fully supported.
                      </p>
                    </div>
                  ) : (
                    <EmptyState
                      description={`No published ${item.label.toLowerCase()} are available yet.`}
                      title="Nothing published here"
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          action={<ButtonLink href="/practice">Start Practice</ButtonLink>}
          description="Published lesson, topic, level, and mixed test questions will appear here when admins add them."
          title="No tests available yet"
        />
      )}
    </>
  );
}
