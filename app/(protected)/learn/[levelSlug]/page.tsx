import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { TopicCard } from "@/components/learning/TopicCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic, Lesson, Question, UserLessonProgress } from "@/types/database";

type LevelPageProps = {
  params: Promise<{
    levelSlug: string;
  }>;
};

export default async function LevelPage({ params }: LevelPageProps) {
  const { levelSlug } = await params;
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

  const [{ data: topics }, { data: lessons }, { data: questions }, { data: progress }] = await Promise.all([
    supabase
      .from("grammar_topics")
      .select("*")
      .eq("level_id", level.id)
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
  const recommendedTopicId = (topics ?? []).find((topic) => {
    const topicLessons = (lessons ?? []).filter((lesson) => lesson.topic_id === topic.id);
    return topicLessons.some((lesson) => !completedLessonIds.has(lesson.id));
  })?.id;

  return (
    <>
      <Breadcrumbs items={[{ label: "Learning Path", href: "/learn" }, { label: level.title }]} />
      <PageHeader
        description={level.description ?? "Choose a topic and work through its lessons."}
        eyebrow="Grammar level"
        action={
          <ButtonLink href="/learn" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to levels
          </ButtonLink>
        }
        title={level.title}
      />

      {topics?.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {topics.map((topic) => {
            const topicLessons = (lessons ?? []).filter((lesson) => lesson.topic_id === topic.id);
            const completedCount = topicLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
            const lessonIds = new Set(topicLessons.map((lesson) => lesson.id));
            const practiceCount = (questions ?? []).filter(
              (question) =>
                (question.lesson_id && lessonIds.has(question.lesson_id)) ||
                question.topic_id === topic.id
            ).length;

            return (
              <TopicCard
                completedLessons={completedCount}
                description={topic.description}
                href={`/learn/${level.slug}/${topic.slug}`}
                key={topic.id}
                lessonsCount={topicLessons.length}
                order={topic.topic_order}
                practiceCount={practiceCount}
                recommended={topic.id === recommendedTopicId}
                title={topic.title}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          description="This level has no published topics yet."
          title="No topics published"
        />
      )}
    </>
  );
}
