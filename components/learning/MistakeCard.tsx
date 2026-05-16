import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { resolveMistakeAction } from "@/lib/actions/practice";

type MistakeCardProps = {
  id: string;
  question?: string;
  lesson?: string;
  topic?: string | null;
  submittedAnswer: string;
  correctAnswer: string;
  explanation?: string | null;
  wrongAnswerExplanation?: string | null;
  retryHref?: string | null;
  createdAt: string;
};

export function MistakeCard({
  id,
  question,
  lesson,
  topic,
  submittedAnswer,
  correctAnswer,
  explanation,
  wrongAnswerExplanation,
  retryHref,
  createdAt
}: MistakeCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift">
      <CardContent className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {topic ? <Badge tone="blue">{topic}</Badge> : null}
            <Badge tone="amber">{lesson ?? "Practice"}</Badge>
            <span className="text-sm text-muted">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <h2 className="text-xl font-semibold text-ink">{question}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-red-100 bg-errorSoft p-4">
              <p className="text-sm font-semibold text-error">Your answer</p>
              <p className="mt-2 text-base text-ink">{submittedAnswer}</p>
            </div>
            <div className="rounded-lg border border-green-100 bg-successSoft p-4">
              <p className="text-sm font-semibold text-success">Correct answer</p>
              <p className="mt-2 text-base text-ink">{correctAnswer}</p>
            </div>
          </div>
          {explanation ? (
            <div className="mt-4 rounded-lg border border-line bg-secondary p-4 text-base leading-7 text-body">
              <p className="text-sm font-semibold text-primary">Explanation</p>
              <p className="mt-2">{explanation}</p>
            </div>
          ) : null}
          {wrongAnswerExplanation ? (
            <div className="mt-3 rounded-lg border border-red-100 bg-errorSoft p-4 text-base leading-7 text-body">
              <p className="text-sm font-semibold text-error">Why the answer was wrong</p>
              <p className="mt-2">{wrongAnswerExplanation}</p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 lg:shrink-0">
          {retryHref ? (
            <ButtonLink className="w-full lg:w-auto" href={retryHref}>
              Retry practice
            </ButtonLink>
          ) : null}
          <form action={resolveMistakeAction}>
            <input name="mistake_id" type="hidden" value={id} />
            <Button className="w-full lg:w-auto" type="submit" variant="secondary">
              <CheckCircle2 className="h-4 w-4" />
              Mark reviewed
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
