import { ArrowRight, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type LevelCardProps = {
  href: string;
  order: number;
  title: string;
  description: string | null;
  topicsCount: number;
  lessonsCount: number;
  completedLessons: number;
  practiceCount?: number;
  testCount?: number;
  topicTitles?: string[];
};

export function LevelCard({
  href,
  order,
  title,
  description,
  topicsCount,
  lessonsCount,
  completedLessons,
  practiceCount = 0,
  testCount = 0,
  topicTitles = []
}: LevelCardProps) {
  const progress = lessonsCount ? (completedLessons / lessonsCount) * 100 : 0;

  return (
    <Card className="group h-full overflow-hidden transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
      <CardContent className="flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Layers3 className="h-6 w-6" />
          </span>
          <Badge tone={progress === 100 ? "green" : "blue"}>{completedLessons}/{lessonsCount} lessons</Badge>
        </div>
        <p className="text-sm font-semibold text-primary">Level {order}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink">{title}</h2>
        <p className="mt-3 min-h-16 text-base leading-7 text-muted">{description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-line bg-secondary p-3">
            <p className="font-semibold text-ink">{topicsCount}</p>
            <p className="text-muted">Topics</p>
          </div>
          <div className="rounded-xl border border-line bg-secondary p-3">
            <p className="font-semibold text-ink">{lessonsCount}</p>
            <p className="text-muted">Lessons</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-line bg-secondary p-3">
            <p className="font-semibold text-ink">{practiceCount}</p>
            <p className="text-muted">Practice</p>
          </div>
          <div className="rounded-xl border border-line bg-secondary p-3">
            <p className="font-semibold text-ink">{testCount}</p>
            <p className="text-muted">Tests</p>
          </div>
        </div>
        {topicTitles.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {topicTitles.slice(0, 5).map((topic) => (
              <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted" key={topic}>
                {topic}
              </span>
            ))}
            {topicTitles.length > 5 ? (
              <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
                +{topicTitles.length - 5} more
              </span>
            ) : null}
          </div>
        ) : null}
        <ProgressBar className="mt-5" label="Progress" value={progress} />
        <ButtonLink className="mt-6 w-full" href={href} variant="secondary">
          Open level
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </CardContent>
    </Card>
  );
}
