import { AlertTriangle, ClipboardCheck, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { LessonCard } from "@/components/learning/LessonCard";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { requireUser } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic, Lesson, Question, UserLessonProgress } from "@/types/database";

type TopicPageProps = {
  params: Promise<{
    levelSlug: string;
    topicSlug: string;
  }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { levelSlug, topicSlug } = await params;
  const { supabase, user } = await requireUser();
  const { data: level } = await supabase
    .from("grammar_levels")
    .select("*")
    .eq("slug", levelSlug)
    .in("slug", [...CORE_LEVEL_SLUGS])
    .eq("is_published", true)
    .single<GrammarLevel>();

  if (!level) {
    notFound();
  }

  const { data: topic } = await supabase
    .from("grammar_topics")
    .select("*")
    .eq("level_id", level.id)
    .eq("slug", topicSlug)
    .eq("is_published", true)
    .single<GrammarTopic>();

  if (!topic) {
    notFound();
  }

  const [{ data: lessons }, { data: questions }, { data: progress }, { data: mistakes }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("topic_id", topic.id)
      .eq("is_published", true)
      .order("lesson_order")
      .returns<Lesson[]>(),
    supabase
      .from("questions")
      .select("*")
      .eq("is_published", true)
      .order("question_order")
      .returns<Question[]>(),
    supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", user.id)
      .returns<UserLessonProgress[]>(),
    supabase
      .from("user_mistakes")
      .select("id, lesson_id")
      .eq("user_id", user.id)
      .eq("is_resolved", false)
      .returns<{ id: string; lesson_id: string | null }[]>()
  ]);

  const completedLessonIds = new Set(
    (progress ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_id)
  );
  const safeLessons = lessons ?? [];
  const lessonIds = new Set(safeLessons.map((lesson) => lesson.id));
  const completedCount = safeLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  const progressValue = safeLessons.length ? (completedCount / safeLessons.length) * 100 : 0;
  const topicQuestions = (questions ?? []).filter(
    (question) =>
      (question.lesson_id && lessonIds.has(question.lesson_id)) ||
      question.topic_id === topic.id
  );
  const topicMistakes = (mistakes ?? []).filter((mistake) => mistake.lesson_id && lessonIds.has(mistake.lesson_id));
  const firstLesson = safeLessons[0] ?? null;
  const firstTestQuestion = topicQuestions.find((question) => question.question_scope !== "practice");

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Learning Path", href: "/learn" },
          { label: level.title, href: `/learn/${level.slug}` },
          { label: topic.title }
        ]}
      />
      <PageHeader
        description={topic.description ?? "Work through the lessons, then practice the topic."}
        eyebrow={level.title}
        meta={
          <>
            <Badge tone="blue">{level.title}</Badge>
            <Badge tone="gray">{safeLessons.length} lessons</Badge>
            <Badge tone="gray">{topicQuestions.length} questions</Badge>
          </>
        }
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            {firstLesson ? (
              <ButtonLink href={`/practice/lesson/${firstLesson.id}`} variant="secondary">
                <PlayCircle className="h-4 w-4" />
                Practice
              </ButtonLink>
            ) : null}
            {firstTestQuestion?.lesson_id ? (
              <ButtonLink href={`/practice/lesson/${firstTestQuestion.lesson_id}`}>
                <ClipboardCheck className="h-4 w-4" />
                Topic test
              </ButtonLink>
            ) : null}
          </div>
        }
        title={topic.title}
      />

      {safeLessons.length ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-center">
              <div>
                <h2 className="text-xl font-semibold text-ink">Topic progress</h2>
                <p className="mt-2 text-base leading-7 text-body">
                  Complete each lesson, then use practice questions and mistakes to reinforce this topic.
                </p>
                <ProgressBar className="mt-4" label="Lessons completed" value={progressValue} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-lg border border-line bg-secondary p-4">
                  <p className="text-2xl font-semibold text-ink">{completedCount}/{safeLessons.length}</p>
                  <p className="text-sm text-muted">Completed</p>
                </div>
                <div className="rounded-lg border border-line bg-secondary p-4">
                  <p className="text-2xl font-semibold text-ink">{topicQuestions.length}</p>
                  <p className="text-sm text-muted">Questions</p>
                </div>
                <div className="rounded-lg border border-amber-100 bg-warningSoft p-4">
                  <p className="text-2xl font-semibold text-ink">{topicMistakes.length}</p>
                  <p className="text-sm text-amber-700">Mistakes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {topicMistakes.length ? (
            <div className="rounded-lg border border-amber-100 bg-warningSoft p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-warning" />
                <div>
                  <p className="font-semibold text-ink">Related mistakes available</p>
                  <p className="mt-1 text-sm leading-6 text-body">
                    Review unresolved mistakes from this topic before moving too far ahead.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {safeLessons.map((lesson) => {
            const completed = completedLessonIds.has(lesson.id);
            return (
              <LessonCard
                completed={completed}
                estimatedMinutes={lesson.estimated_minutes}
                href={`/lessons/${lesson.id}`}
                key={lesson.id}
                order={lesson.lesson_order}
                practiceHref={`/practice/lesson/${lesson.id}`}
                summary={lesson.summary}
                title={lesson.title}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          description="This topic has no published lessons yet."
          title="No lessons published"
        />
      )}
    </>
  );
}
