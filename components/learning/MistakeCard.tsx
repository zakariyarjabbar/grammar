import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { resolveMistakeAction } from "@/lib/actions/practice";

type MistakeCardProps = {
  id: string;
  question?: string;
  lesson?: string;
  submittedAnswer: string;
  correctAnswer: string;
  explanation?: string | null;
  createdAt: string;
};

export function MistakeCard({
  id,
  question,
  lesson,
  submittedAnswer,
  correctAnswer,
  explanation,
  createdAt
}: MistakeCardProps) {
  return (
    <Card className="transition hover:border-primary/20">
      <CardContent className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="amber">{lesson ?? "Practice"}</Badge>
            <span className="text-sm text-muted">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <h2 className="text-xl font-semibold text-ink">{question}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-semibold text-error">Your answer</p>
              <p className="mt-2 text-base text-ink">{submittedAnswer}</p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="text-sm font-semibold text-success">Correct answer</p>
              <p className="mt-2 text-base text-ink">{correctAnswer}</p>
            </div>
          </div>
          {explanation ? (
            <p className="mt-4 rounded-2xl border border-line bg-secondary p-4 text-base leading-7 text-muted">
              {explanation}
            </p>
          ) : null}
        </div>
        <form action={resolveMistakeAction} className="lg:shrink-0">
          <input name="mistake_id" type="hidden" value={id} />
          <Button className="w-full lg:w-auto" type="submit" variant="secondary">
            <CheckCircle2 className="h-4 w-4" />
            Mark reviewed
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
