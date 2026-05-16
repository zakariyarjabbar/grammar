import Link from "next/link";
import { ArrowRight, LibraryBig } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { requireUser } from "@/lib/auth/guards";
import type { GrammarLevel, GrammarTopic, Lesson, UserLessonProgress } from "@/types/database";

type LevelPageProps = {
  params: Promise<{
    levelSlug: string;
  }>;
};

export default async function LevelPage({ params }: LevelPageProps) {
  const { levelSlug } = await params;
  const { supabase, user } = await requireUser();
  const { data: level } = await supabase
    .from("grammar_levels")
    .select("*")
    .eq("slug", levelSlug)
    .eq("is_published", true)
    .single<GrammarLevel>();

  if (!level) {
    notFound();
  }

  const [{ data: topics }, { data: lessons }, { data: progress }] = await Promise.all([
    supabase
      .from("grammar_topics")
      .select("*")
      .eq("level_id", level.id)
      .eq("is_published", true)
      .order("topic_order")
      .returns<GrammarTopic[]>(),
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("lesson_order")
      .returns<Lesson[]>(),
    supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", user.id)
      .returns<UserLessonProgress[]>()
  ]);

  const completedLessonIds = new Set(
    (progress ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_id)
  );

  return (
    <>
      <PageHeader
        description={level.description ?? "Choose a topic and work through its lessons."}
        eyebrow="Grammar level"
        title={level.title}
      />

      {topics?.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {topics.map((topic) => {
            const topicLessons = (lessons ?? []).filter((lesson) => lesson.topic_id === topic.id);
            const completedCount = topicLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
            const progressValue = topicLessons.length ? (completedCount / topicLessons.length) * 100 : 0;

            return (
              <Link className="group block" href={`/learn/${level.slug}/${topic.slug}`} key={topic.id}>
                <Card className="h-full transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
                  <CardContent>
                    <div className="mb-5 flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <LibraryBig className="h-6 w-6" />
                      </span>
                      <Badge tone={progressValue === 100 && topicLessons.length ? "green" : "blue"}>
                        {completedCount}/{topicLessons.length} lessons
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-semibold text-ink">{topic.title}</h2>
                    <p className="mt-3 min-h-16 text-base leading-7 text-muted">{topic.description}</p>
                    <ProgressBar className="mt-5" label="Topic progress" value={progressValue} />
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                      <span className="text-muted">Topic {topic.topic_order}</span>
                      <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:text-primaryHover">
                        Open <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          description="This level has no published topics yet."
          title="No topics published"
        />
      )}
    </>
  );
}
