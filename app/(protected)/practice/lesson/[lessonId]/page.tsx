import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PracticeSession, type PracticeQuestion } from "@/components/learning/PracticeSession";
import { requireUser } from "@/lib/auth/guards";
import { optionArray } from "@/lib/utils/content";
import type { Lesson, Question } from "@/types/database";

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

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lesson.id)
    .eq("is_published", true)
    .order("question_order")
    .returns<Question[]>();

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
      <PageHeader
        description="Answer each question. Correct and wrong answers are saved automatically."
        eyebrow="Practice"
        title={lesson.title}
      />

      {practiceQuestions.length ? (
        <PracticeSession backHref={`/lessons/${lesson.id}`} questions={practiceQuestions} />
      ) : (
        <EmptyState
          description="This lesson does not have published questions yet."
          title="No questions available"
        />
      )}
    </>
  );
}
