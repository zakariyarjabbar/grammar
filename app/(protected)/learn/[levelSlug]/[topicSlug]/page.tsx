import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCard } from "@/components/learning/LessonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";
import type { GrammarLevel, GrammarTopic, Lesson, UserLessonProgress } from "@/types/database";

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

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("topic_id", topic.id)
      .eq("is_published", true)
      .order("lesson_order")
      .returns<Lesson[]>(),
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
        description={topic.description ?? "Work through the lessons, then practice the topic."}
        eyebrow={level.title}
        title={topic.title}
      />

      {lessons?.length ? (
        <div className="space-y-4">
          {lessons.map((lesson) => {
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
          <Link className="inline-flex text-sm font-medium text-primary hover:text-primaryHover" href="/learn">
            Back to levels
          </Link>
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
