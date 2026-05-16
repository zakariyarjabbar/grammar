import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PracticeSession, type PracticeQuestion } from "@/components/learning/PracticeSession";
import { requireUser } from "@/lib/auth/guards";
import { isCoreLevelSlug } from "@/lib/utils/curriculum";
import { optionArray } from "@/lib/utils/content";
import type { GrammarLevel, GrammarTopic, Lesson, Question } from "@/types/database";

type PracticeLessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function PracticeLessonPage({ params }: PracticeLessonPageProps) {
  const { lessonId } = await params;
  const { supabase } = await requireUser();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .eq("is_published", true)
    .single<Lesson>();

  if (!lesson) {
    notFound();
  }

  const [{ data: questions }, { data: topic }] = await Promise.all([
    supabase
      .from("questions")
      .select("*")
      .eq("lesson_id", lesson.id)
      .eq("is_published", true)
      .eq("question_scope", "practice")
      .order("question_order")
      .returns<Question[]>(),
    supabase.from("grammar_topics").select("*").eq("id", lesson.topic_id).single<GrammarTopic>()
  ]);
  const { data: level } = topic
    ? await supabase.from("grammar_levels").select("*").eq("id", topic.level_id).single<GrammarLevel>()
    : { data: null };

  if (level && !isCoreLevelSlug(level.slug)) {
    notFound();
  }

  const practiceQuestions: PracticeQuestion[] = (questions ?? []).map((question) => ({
    id: question.id,
    prompt: question.prompt,
    question_type: question.question_type,
    options:
      question.question_type === "true_false" && optionArray(question.options).length === 0
        ? ["True", "False"]
        : optionArray(question.options)
  }));

  return (
    <>
      {level && topic ? (
        <Breadcrumbs
          items={[
            { label: "Learning Path", href: "/learn" },
            { label: level.title, href: `/learn/${level.slug}` },
            { label: topic.title, href: `/learn/${level.slug}/${topic.slug}` },
            { label: lesson.title, href: `/lessons/${lesson.id}` },
            { label: "Practice" }
          ]}
        />
      ) : null}
      <PageHeader
        description="Answer each question. Correct and wrong answers are saved automatically."
        eyebrow="Practice"
        meta={
          <>
            <Badge tone="blue">{practiceQuestions.length} questions</Badge>
            <Badge tone="gray">{lesson.difficulty}</Badge>
            {topic ? <Badge tone="gray">{topic.title}</Badge> : null}
          </>
        }
        title={lesson.title}
      />

      {practiceQuestions.length ? (
        <PracticeSession
          backHref={`/lessons/${lesson.id}`}
          lessonTitle={lesson.title}
          levelTitle={level?.title}
          questions={practiceQuestions}
          topicTitle={topic?.title}
        />
      ) : (
        <EmptyState
          description="This lesson does not have published questions yet."
          title="No questions available"
        />
      )}
    </>
  );
}
