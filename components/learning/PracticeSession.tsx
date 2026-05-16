"use client";

import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from "lucide-react";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { submitAnswerAction, type SubmitAnswerResult } from "@/lib/actions/practice";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Field";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { QuestionType } from "@/types/database";
import { cn } from "@/lib/utils/cn";

export type PracticeQuestion = {
  id: string;
  prompt: string;
  question_type: QuestionType;
  options: string[];
};

type PracticeSessionProps = {
  questions: PracticeQuestion[];
  backHref: string;
};

function questionTypeLabel(type: QuestionType) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function PracticeSession({ questions, backHref }: PracticeSessionProps) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<SubmitAnswerResult | null>(null);
  const [savedResults, setSavedResults] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const current = questions[index];
  const progressLabel = useMemo(() => `${index + 1} of ${questions.length}`, [index, questions.length]);
  const progressValue = ((index + 1) / questions.length) * 100;

  if (!current) {
    const correctCount = Object.values(savedResults).filter(Boolean).length;
    const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-semibold text-ink">Practice complete</h2>
          <p className="mt-2 text-base leading-7 text-muted">
            You answered {correctCount} of {questions.length} correctly. Score: {score}%.
          </p>
          <ProgressBar className="mx-auto mt-5 max-w-sm" label="Session score" value={score} />
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" variant="primary">
              Dashboard
            </ButtonLink>
            <ButtonLink href="/mistakes" variant="secondary">
              Review mistakes
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    startTransition(async () => {
      const response = await submitAnswerAction({
        questionId: current.id,
        answer
      });
      setResult(response);
      if (!response.error) {
        setSavedResults((value) => ({
          ...value,
          [current.id]: response.isCorrect
        }));
      }
    });
  }

  function goNext() {
    setResult(null);
    setAnswer("");
    setIndex((value) => value + 1);
  }

  function resetCurrent() {
    setResult(null);
    setAnswer("");
  }

  const locked = Boolean(result && !result.error);

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Question {progressLabel}</p>
          <h2 className="mt-2 text-2xl font-semibold leading-9 text-ink">{current.prompt}</h2>
        </div>
        <Badge tone="blue">{questionTypeLabel(current.question_type)}</Badge>
      </CardHeader>
      <CardContent>
        <ProgressBar className="mb-6" label="Practice progress" value={progressValue} />
        <form className="space-y-5" onSubmit={submitAnswer}>
          {current.question_type === "multiple_choice" || current.question_type === "true_false" ? (
            <div className={cn("grid gap-3", current.question_type === "true_false" && "sm:grid-cols-2")}>
              {current.options.map((option) => (
                <label
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-secondary px-4 py-3 text-base font-medium text-ink hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5",
                    answer === option && "border-primary bg-primary/10 text-primary ring-2 ring-primary/10",
                    result && !result.error && !result.isCorrect && answer === option && "animate-soft-shake border-red-200 bg-red-50 text-error"
                  )}
                  key={option}
                >
                  <input
                    checked={answer === option}
                    className="h-4 w-4 accent-primary"
                    disabled={locked}
                    name="answer"
                    onChange={() => setAnswer(option)}
                    type="radio"
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : null}

          {current.question_type === "fill_blank" ? (
            <Input
              disabled={locked}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type the missing word or phrase"
              value={answer}
            />
          ) : null}

          {current.question_type === "sentence_correction" ? (
            <Textarea
              disabled={locked}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Rewrite the sentence correctly"
              value={answer}
            />
          ) : null}

          {result?.error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-base text-error">
              {result.error}
            </div>
          ) : null}

          {result && !result.error ? (
            <div
              className={cn(
                "rounded-2xl border p-5",
                result.isCorrect
                  ? "border-green-100 bg-green-50 text-green-800"
                  : "animate-soft-shake border-red-100 bg-red-50 text-red-800"
              )}
            >
              <div className="flex items-center gap-2 text-lg font-semibold">
                {result.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                {result.isCorrect ? "Correct" : "Not quite"}
              </div>
              {!result.isCorrect ? (
                <p className="mt-3 text-base">Correct answer: {result.correctAnswer}</p>
              ) : null}
              {result.explanation ? <p className="mt-3 text-base leading-7">{result.explanation}</p> : null}
              {result.completedLesson ? (
                <p className="mt-3 text-sm font-semibold">Lesson marked as completed.</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ButtonLink href={backHref} variant="ghost">
              Back
            </ButtonLink>
            <div className="flex flex-col gap-2 sm:flex-row">
              {result ? (
                <Button onClick={resetCurrent} type="button" variant="secondary">
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </Button>
              ) : null}
              {result && !result.error ? (
                <Button onClick={goNext} type="button">
                  {index + 1 === questions.length ? "Finish" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button disabled={isPending} type="submit">
                  {isPending ? "Checking" : "Check answer"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
