import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { requireUser } from "@/lib/auth/guards";
import { jsonArray } from "@/lib/utils/content";
import type { GrammarLevel, GrammarTopic, Lesson } from "@/types/database";

type LessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
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

  const { data: topic } = await supabase
    .from("grammar_topics")
    .select("*")
    .eq("id", lesson.topic_id)
    .single<GrammarTopic>();
  const { data: level } = topic
    ? await supabase.from("grammar_levels").select("*").eq("id", topic.level_id).single<GrammarLevel>()
    : { data: null };

  const examples = jsonArray(lesson.examples);
  const mistakes = jsonArray(lesson.common_mistakes);
  const wrongCorrectExamples = jsonArray(lesson.wrong_correct_examples);
  const shortNotes = jsonArray(lesson.short_notes);
  const miniPractice = jsonArray(lesson.mini_practice);

  return (
    <>
      <PageHeader
        action={
          <ButtonLink href={`/practice/lesson/${lesson.id}`}>
            <PlayCircle className="h-4 w-4" />
            Start practice
          </ButtonLink>
        }
        description={lesson.summary ?? undefined}
        eyebrow={level && topic ? `${level.title} / ${topic.title}` : "Lesson"}
        title={lesson.title}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="safe-prose space-y-6">
          <ProgressBar value={20} />
          <Card id="explanation">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">Explanation</h2>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-lg leading-9 text-muted">{lesson.explanation}</p>
            </CardContent>
          </Card>

          {lesson.formula ? (
            <Card id="structure">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">Structure</h2>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-primary/15 bg-primary/10 p-5 font-mono text-base leading-7 text-primary">
                  {lesson.formula}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {(lesson.usage_when || lesson.usage_when_not) ? (
            <Card id="usage">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">When to use it</h2>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {lesson.usage_when ? (
                  <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                    <h3 className="font-semibold text-success">Use it when</h3>
                    <p className="mt-3 whitespace-pre-line text-base leading-7 text-muted">{lesson.usage_when}</p>
                  </div>
                ) : null}
                {lesson.usage_when_not ? (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                    <h3 className="font-semibold text-warning">Be careful when</h3>
                    <p className="mt-3 whitespace-pre-line text-base leading-7 text-muted">{lesson.usage_when_not}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card id="examples">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">Examples</h2>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {examples.map((example) => (
                  <li className="flex gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-base leading-7 text-ink" key={example}>
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-success" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card id="mistakes">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">Common mistakes</h2>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {mistakes.map((mistake) => (
                  <li className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-base leading-7 text-ink" key={mistake}>
                    <XCircle className="mt-1 h-5 w-5 shrink-0 text-error" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {wrongCorrectExamples.length ? (
            <Card id="wrong-correct">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">Wrong vs correct</h2>
              </CardHeader>
              <CardContent className="grid gap-3">
                {wrongCorrectExamples.map((item) => {
                  const [wrong, correct] = item.split("|").map((part) => part.trim());
                  return (
                    <div className="grid gap-3 rounded-2xl border border-line bg-secondary p-4 md:grid-cols-2" key={item}>
                      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-error">Wrong</p>
                        <p className="mt-2 text-base text-ink">{wrong?.replace(/^Wrong:\s*/i, "")}</p>
                      </div>
                      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                        <p className="text-sm font-semibold text-success">Correct</p>
                        <p className="mt-2 text-base text-ink">{correct?.replace(/^Correct:\s*/i, "")}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}

          {miniPractice.length || shortNotes.length ? (
            <Card id="mini-practice">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">Mini practice</h2>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {miniPractice.length ? (
                  <div>
                    <h3 className="font-semibold text-ink">Try these</h3>
                    <ul className="mt-3 space-y-3">
                      {miniPractice.map((prompt) => (
                        <li className="rounded-2xl border border-line bg-secondary p-4 text-base leading-7 text-muted" key={prompt}>
                          {prompt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {shortNotes.length ? (
                  <div>
                    <h3 className="font-semibold text-ink">Short notes</h3>
                    <ul className="mt-3 space-y-3">
                      {shortNotes.map((note) => (
                        <li className="rounded-2xl border border-line bg-white p-4 text-base leading-7 text-muted" key={note}>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card id="summary">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">Summary</h2>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-9 text-muted">
                {lesson.summary || "Review the structure, examples, and mistakes before starting practice."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/practice/lesson/${lesson.id}`}>
                  <PlayCircle className="h-4 w-4" />
                  Start Practice
                </ButtonLink>
                {level && topic ? (
                  <ButtonLink href={`/learn/${level.slug}/${topic.slug}`} variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Topic
                  </ButtonLink>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent>
              <BookOpenCheck className="mb-4 h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-ink">Lesson details</h2>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <div className="flex justify-between gap-3">
                  <span>Level</span>
                  <Badge tone="blue">{level?.title ?? "Published"}</Badge>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Topic</span>
                  <span className="font-medium text-ink">{topic?.title}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Difficulty</span>
                  <Badge tone="gray">{lesson.difficulty}</Badge>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </span>
                  <span className="font-medium text-ink">{lesson.estimated_minutes} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold text-ink">On this lesson</h2>
              <nav className="mt-4 grid gap-2 text-sm font-medium text-muted">
                <a className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-primary" href="#explanation">
                  Explanation
                </a>
                <a className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-primary" href="#structure">
                  Structure
                </a>
                <a className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-primary" href="#usage">
                  Usage
                </a>
                <a className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-primary" href="#examples">
                  Examples
                </a>
                <a className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-primary" href="#mistakes">
                  Common mistakes
                </a>
                <a className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-primary" href="#summary">
                  Summary
                </a>
              </nav>
            </CardContent>
          </Card>
          {level && topic ? (
            <ButtonLink href={`/learn/${level.slug}/${topic.slug}`} variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to topic
            </ButtonLink>
          ) : null}
        </aside>
      </div>
    </>
  );
}
