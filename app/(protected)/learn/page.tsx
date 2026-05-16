import { ArrowRight, GraduationCap } from "lucide-react";
import { LevelCard } from "@/components/learning/LevelCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic, Lesson, Question, UserLessonProgress } from "@/types/database";

export default async function LearnPage() {
  const { supabase, user } = await requireUser();
  const [{ data: levels }, { data: topics }, { data: lessons }, { data: questions }, { data: progress }] =
    await Promise.all([
      supabase
        .from("grammar_levels")
        .select("*")
        .eq("is_published", true)
        .in("slug", [...CORE_LEVEL_SLUGS])
        .order("level_order")
        .returns<GrammarLevel[]>(),
      supabase
        .from("grammar_topics")
        .select("*")
        .eq("is_published", true)
        .order("topic_order")
        .returns<GrammarTopic[]>(),
      supabase
        .from("lessons")
        .select("*")
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
        .returns<UserLessonProgress[]>()
    ]);

  const completedLessonIds = new Set(
    (progress ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_id)
  );

  return (
    <>
      <PageHeader
        description="Choose one of three academy levels: Beginner, Intermediate, or Advanced."
        eyebrow="Learn"
        action={
          <ButtonLink href="/practice" variant="secondary">
            Practice library
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
        title="Learning Path"
      />

      {levels?.length ? (
        <>
          <Card className="mb-6 bg-primaryVerySoft">
            <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-ink">Grammar academy curriculum</h2>
                  <p className="mt-2 max-w-3xl text-base leading-7 text-body">
                    Work through levels in order, open a topic, study the lessons, then practice the questions attached to that lesson.
                  </p>
                </div>
              </div>
                  <Badge tone="blue">3 levels</Badge>
            </CardContent>
          </Card>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {levels.map((level) => {
              const levelTopics = (topics ?? []).filter((topic) => topic.level_id === level.id);
              const topicIds = new Set(levelTopics.map((topic) => topic.id));
              const levelLessons = (lessons ?? []).filter((lesson) => topicIds.has(lesson.topic_id));
              const completedCount = levelLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
              const lessonIds = new Set(levelLessons.map((lesson) => lesson.id));
              const levelQuestions = (questions ?? []).filter(
                (question) => (question.lesson_id && lessonIds.has(question.lesson_id)) || (question.topic_id && topicIds.has(question.topic_id))
              );
              const practiceCount = levelQuestions.filter((question) => question.question_scope === "practice").length;
              const testCount = levelQuestions.filter((question) => question.question_scope !== "practice").length;

              return (
                <LevelCard
                  completedLessons={completedCount}
                  description={level.description}
                  href={`/learn/${level.slug}`}
                  key={level.id}
                  lessonsCount={levelLessons.length}
                  order={level.level_order}
                  practiceCount={practiceCount}
                  testCount={testCount}
                  title={level.title}
                  topicTitles={levelTopics.map((topic) => topic.title)}
                  topicsCount={levelTopics.length}
                />
              );
            })}
          </div>
        </>
      ) : (
        <EmptyState
          description="Ask an admin to publish grammar levels to begin the curriculum."
          title="No levels published"
        />
      )}
    </>
  );
}
