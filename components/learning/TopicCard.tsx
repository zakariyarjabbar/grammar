import Link from "next/link";
import { ArrowRight, CheckCircle2, LibraryBig, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";

type TopicCardProps = {
  href: string;
  order: number;
  title: string;
  description: string | null;
  lessonsCount: number;
  completedLessons: number;
  practiceCount?: number;
  recommended?: boolean;
};

export function TopicCard({
  href,
  order,
  title,
  description,
  lessonsCount,
  completedLessons,
  practiceCount = 0,
  recommended
}: TopicCardProps) {
  const progress = lessonsCount ? (completedLessons / lessonsCount) * 100 : 0;
  const completed = lessonsCount > 0 && completedLessons === lessonsCount;

  return (
    <Link className="group block h-full" href={href}>
      <Card
        className={cn(
          "h-full transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift",
          recommended && "border-primary/30 bg-primaryVerySoft"
        )}
      >
        <CardContent className="flex h-full flex-col">
          <div className="mb-5 flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primarySoft text-primary">
              {completed ? <CheckCircle2 className="h-5 w-5" /> : <LibraryBig className="h-5 w-5" />}
            </span>
            <div className="flex flex-wrap justify-end gap-2">
              {recommended ? <Badge tone="blue">Recommended</Badge> : null}
              <Badge tone={completed ? "green" : "gray"}>{completedLessons}/{lessonsCount} lessons</Badge>
            </div>
          </div>
          <p className="text-sm font-semibold text-primary">Topic {order}</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 flex-1 text-base leading-7 text-body">{description}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="font-semibold text-ink">{lessonsCount}</p>
              <p className="text-muted">Lessons</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="font-semibold text-ink">{practiceCount}</p>
              <p className="text-muted">Questions</p>
            </div>
          </div>
          <ProgressBar className="mt-5" label="Topic progress" value={progress} />
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
            <span className="inline-flex items-center gap-1 font-medium text-muted">
              <PlayCircle className="h-4 w-4" />
              {progress > 0 ? "Continue" : "Start"}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:text-primaryHover">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
