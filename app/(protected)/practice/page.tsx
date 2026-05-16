import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";
import type { Lesson, Question } from "@/types/database";

export default async function PracticePage() {
  const { supabase } = await requireUser();
  const [{ data: lessons }, { data: questions }] = await Promise.all([
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
      .returns<Question[]>()
  ]);

  const lessonsWithQuestions = (lessons ?? [])
    .map((lesson) => ({
      lesson,
      questions: (questions ?? []).filter((question) => question.lesson_id === lesson.id)
    }))
    .filter((item) => item.questions.length > 0);

  return (
    <>
      <PageHeader
        description="Choose a lesson, answer each question, and use feedback to strengthen your grammar."
        eyebrow="Practice"
        title="Practice library"
      />

      {lessonsWithQuestions.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lessonsWithQuestions.map(({ lesson, questions: lessonQuestions }) => (
            <Card className="transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow" key={lesson.id}>
              <CardContent className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{lesson.title}</h2>
                    <p className="mt-3 text-base leading-7 text-muted">{lesson.summary}</p>
                  </div>
                  <Badge tone="blue">{lessonQuestions.length} questions</Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-line bg-secondary p-3">
                    <p className="font-semibold text-ink">
                      {lessonQuestions.filter((question) => question.question_scope === "practice").length}
                    </p>
                    <p className="text-muted">Practice</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-secondary p-3">
                    <p className="font-semibold text-ink">
                      {lessonQuestions.filter((question) => question.question_scope !== "practice").length}
                    </p>
                    <p className="text-muted">Tests</p>
                  </div>
                </div>
                <div className="mt-6 flex grow items-end">
                  <ButtonLink className="w-full" href={`/practice/lesson/${lesson.id}`}>
                    <PlayCircle className="h-4 w-4" />
                    Start Practice
                  </ButtonLink>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Admin-created questions will show here when they are published."
          title="No practice available"
        />
      )}
    </>
  );
}
