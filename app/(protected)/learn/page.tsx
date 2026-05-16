import { LevelCard } from "@/components/learning/LevelCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";
import type { GrammarLevel, GrammarTopic, Lesson, Question, UserLessonProgress } from "@/types/database";

export default async function LearnPage() {
  const { supabase, user } = await requireUser();
  const [{ data: levels }, { data: topics }, { data: lessons }, { data: questions }, { data: progress }] =
    await Promise.all([
      supabase
        .from("grammar_levels")
        .select("*")
        .eq("is_published", true)
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
        description="Start from the basics and move step by step toward advanced grammar."
        eyebrow="Learn"
        title="Learning Path"
      />

      {levels?.length ? (
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
      ) : (
        <EmptyState
          description="Ask an admin to publish grammar levels to begin the curriculum."
          title="No levels published"
        />
      )}
    </>
  );
}
