import { AlertTriangle, CheckCircle2, Filter, PlayCircle, Search } from "lucide-react";
import { MistakeCard } from "@/components/learning/MistakeCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/guards";

type MistakeRow = {
  id: string;
  lesson_id: string | null;
  submitted_answer: string;
  correct_answer: string;
  created_at: string;
  questions: { prompt: string; explanation: string | null; wrong_answer_explanation: string | null } | null;
  lessons: { title: string } | null;
};

type MistakesPageProps = {
  searchParams: Promise<{
    search?: string;
    topic?: string;
  }>;
};

export default async function MistakesPage({ searchParams }: MistakesPageProps) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: mistakes }, { data: lessons }, { data: topics }, { count: reviewedCount }] = await Promise.all([
    supabase
      .from("user_mistakes")
      .select("id, lesson_id, submitted_answer, correct_answer, created_at, questions(prompt, explanation, wrong_answer_explanation), lessons(title)")
      .eq("user_id", user.id)
      .eq("is_resolved", false)
      .order("created_at", { ascending: false })
      .returns<MistakeRow[]>(),
    supabase.from("lessons").select("id, topic_id").returns<{ id: string; topic_id: string }[]>(),
    supabase.from("grammar_topics").select("id, title").returns<{ id: string; title: string }[]>(),
    supabase
      .from("user_mistakes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_resolved", true)
  ]);

  const lessonTopicById = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson.topic_id]));
  const topicById = new Map((topics ?? []).map((topic) => [topic.id, topic.title]));
  const searchTerm = params.search?.trim().toLowerCase() ?? "";
  const filteredMistakes = (mistakes ?? []).filter((mistake) => {
    const topicId = mistake.lesson_id ? lessonTopicById.get(mistake.lesson_id) : null;
    const topicTitle = topicId ? topicById.get(topicId) : "";
    const matchesSearch = searchTerm
      ? mistake.questions?.prompt.toLowerCase().includes(searchTerm) ||
        mistake.submitted_answer.toLowerCase().includes(searchTerm) ||
        mistake.correct_answer.toLowerCase().includes(searchTerm) ||
        mistake.lessons?.title.toLowerCase().includes(searchTerm) ||
        topicTitle?.toLowerCase().includes(searchTerm)
      : true;
    const matchesTopic = params.topic ? topicId === params.topic : true;

    return matchesSearch && matchesTopic;
  });
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
  const topTopic = repeatedTopics[0]?.[0] ?? "No repeated topic yet";

  return (
    <>
      <PageHeader
        description="Mistakes are useful. Review each one, compare the correct answer, and mark it reviewed when it feels clear."
        eyebrow="Mistakes"
        title="Mistake Review"
      />

      {mistakes?.length ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent>
                <AlertTriangle className="mb-3 h-6 w-6 text-warning" />
                <p className="text-3xl font-semibold text-ink">{mistakes.length}</p>
                <p className="mt-1 text-sm text-muted">Total mistakes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CheckCircle2 className="mb-3 h-6 w-6 text-success" />
                <p className="text-3xl font-semibold text-ink">{reviewedCount ?? 0}</p>
                <p className="mt-1 text-sm text-muted">Reviewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <AlertTriangle className="mb-3 h-6 w-6 text-warning" />
                <p className="text-3xl font-semibold text-ink">{mistakes.length}</p>
                <p className="mt-1 text-sm text-muted">Not reviewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="mb-3 text-sm font-semibold text-primary">Weak topics</p>
                <div className="flex flex-wrap gap-2">
                  {(repeatedTopics.length
                    ? repeatedTopics.slice(0, 4).map(([topic, count]) => `${topic} (${count})`)
                    : [topTopic]
                  ).map((item) => (
                    <span className="rounded-lg border border-line bg-secondary px-3 py-2 text-sm text-muted" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <form className="grid gap-3 md:grid-cols-[1fr_16rem_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input className="pl-9" defaultValue={params.search ?? ""} name="search" placeholder="Search mistakes" />
                </div>
                <Select defaultValue={params.topic ?? ""} name="topic">
                  <option value="">All topics</option>
                  {(topics ?? []).map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </Select>
                <Button type="submit" variant="secondary">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </form>
            </CardContent>
          </Card>

          {filteredMistakes.length ? filteredMistakes.map((mistake) => {
            const topicId = mistake.lesson_id ? lessonTopicById.get(mistake.lesson_id) : null;
            const topicTitle = topicId ? topicById.get(topicId) : null;

            return (
              <MistakeCard
                correctAnswer={mistake.correct_answer}
                createdAt={mistake.created_at}
                explanation={mistake.questions?.explanation}
                id={mistake.id}
                key={mistake.id}
                lesson={mistake.lessons?.title ?? "Practice"}
                question={mistake.questions?.prompt}
                retryHref={mistake.lesson_id ? `/practice/lesson/${mistake.lesson_id}` : null}
                submittedAnswer={mistake.submitted_answer}
                topic={topicTitle}
                wrongAnswerExplanation={mistake.questions?.wrong_answer_explanation}
              />
            );
          }) : (
            <EmptyState
              action={<ButtonLink href="/mistakes" variant="secondary">Clear filters</ButtonLink>}
              description="Try a different search term or topic filter."
              title="No mistakes match your filters"
            />
          )}
        </div>
      ) : (
        <EmptyState
          action={
            <ButtonLink href="/practice">
              <PlayCircle className="h-4 w-4" />
              Start Practice
            </ButtonLink>
          }
          description="No mistakes yet. Keep practicing and your review list will appear here."
          title="No mistakes yet. Keep practicing."
        />
      )}
    </>
  );
}
