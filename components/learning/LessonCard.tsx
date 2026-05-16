import { BookOpen, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

type LessonCardProps = {
  title: string;
  summary: string | null;
  href: string;
  practiceHref: string;
  estimatedMinutes: number;
  order: number;
  completed: boolean;
};

export function LessonCard({
  title,
  summary,
  href,
  practiceHref,
  estimatedMinutes,
  order,
  completed
}: LessonCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow">
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {completed ? <CheckCircle2 className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gray">Lesson {order}</Badge>
              <Badge tone={completed ? "green" : "blue"}>{completed ? "Completed" : "Ready"}</Badge>
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <Clock className="h-4 w-4" />
                {estimatedMinutes} min
              </span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-ink">{title}</h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-muted">{summary}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:w-36 sm:shrink-0">
          <ButtonLink href={href} variant="secondary">
            {completed ? "Review" : "Start"}
          </ButtonLink>
          <ButtonLink href={practiceHref}>
            <PlayCircle className="h-4 w-4" />
            Practice
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  );
}
