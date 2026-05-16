import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { MistakeCard } from "@/components/learning/MistakeCard";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";

type MistakeRow = {
  id: string;
  lesson_id: string | null;
  submitted_answer: string;
  correct_answer: string;
  created_at: string;
  questions: { prompt: string; explanation: string | null } | null;
  lessons: { title: string } | null;
};

export default async function MistakesPage() {
  const { supabase, user } = await requireUser();
  const [{ data: mistakes }, { data: lessons }, { data: topics }] = await Promise.all([
    supabase
      .from("user_mistakes")
      .select("id, lesson_id, submitted_answer, correct_answer, created_at, questions(prompt, explanation), lessons(title)")
      .eq("user_id", user.id)
      .eq("is_resolved", false)
      .order("created_at", { ascending: false })
      .returns<MistakeRow[]>(),
    supabase.from("lessons").select("id, topic_id").returns<{ id: string; topic_id: string }[]>(),
    supabase.from("grammar_topics").select("id, title").returns<{ id: string; title: string }[]>()
  ]);

  const lessonTopicById = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson.topic_id]));
  const topicById = new Map((topics ?? []).map((topic) => [topic.id, topic.title]));
  const repeatedTopics = Array.from(
    (mistakes ?? []).reduce((map, mistake) => {
      const topicId = mistake.lesson_id ? lessonTopicById.get(mistake.lesson_id) : null;
      const topicTitle = topicId ? topicById.get(topicId) : null;
      if (topicTitle) {
        map.set(topicTitle, (map.get(topicTitle) ?? 0) + 1);
      }
      return map;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHeader
        description="Mistakes are useful. Review each one, compare the correct answer, and mark it reviewed when it feels clear."
        eyebrow="Mistakes"
        title="Review mistakes"
      />

      {mistakes?.length ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent>
                <AlertTriangle className="mb-3 h-6 w-6 text-warning" />
                <p className="text-3xl font-semibold text-ink">{mistakes.length}</p>
                <p className="mt-1 text-sm text-muted">Not reviewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CheckCircle2 className="mb-3 h-6 w-6 text-success" />
                <p className="text-3xl font-semibold text-ink">Review</p>
                <p className="mt-1 text-sm text-muted">One mistake at a time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="mb-3 text-sm font-semibold text-primary">Weak topics</p>
                <div className="flex flex-wrap gap-2">
                  {(repeatedTopics.length ? repeatedTopics.slice(0, 4).map(([topic, count]) => `${topic} (${count})`) : ["No repeated topic yet"]).map((item) => (
                    <span className="rounded-xl border border-line bg-secondary px-3 py-2 text-sm text-muted" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {mistakes.map((mistake) => (
            <MistakeCard
              correctAnswer={mistake.correct_answer}
              createdAt={mistake.created_at}
              explanation={mistake.questions?.explanation}
              id={mistake.id}
              key={mistake.id}
              lesson={mistake.lessons?.title ?? "Practice"}
              question={mistake.questions?.prompt}
              submittedAnswer={mistake.submitted_answer}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="When an answer is wrong, it will appear here for review."
          title="No mistakes yet. Keep practicing."
        />
      )}
    </>
  );
}
