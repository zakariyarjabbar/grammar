import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpenCheck, CheckCircle2, ListChecks, PlayCircle, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { requireUser } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic, Lesson, UserLessonProgress } from "@/types/database";

type RecentMistake = {
  id: string;
  submitted_answer: string;
  correct_answer: string;
  created_at: string;
  questions: { prompt: string } | null;
  lessons: { title: string } | null;
};

export default async function DashboardPage() {
  const { supabase, user, profile } = await requireUser();

  const [
    { data: levels },
    { data: topics },
    { data: lessons },
    { data: progress },
    { count: answeredCount },
    { count: correctCount },
    { count: mistakesCount },
    { data: recentMistakes }
  ] = await Promise.all([
    supabase
      .from("grammar_levels")
      .select("*")
      .eq("is_published", true)
      .in("slug", [...CORE_LEVEL_SLUGS])
      .order("level_order")
      .returns<GrammarLevel[]>(),
    supabase
      .from("grammar_topics")
      .select("*")
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
      .returns<UserLessonProgress[]>(),
    supabase
      .from("user_answers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("user_answers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_correct", true),
    supabase
      .from("user_mistakes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_resolved", false),
    supabase
      .from("user_mistakes")
      .select("id, submitted_answer, correct_answer, created_at, questions(prompt), lessons(title)")
      .eq("user_id", user.id)
      .eq("is_resolved", false)
      .order("created_at", { ascending: false })
      .limit(4)
      .returns<RecentMistake[]>()
  ]);

  const safeLevels = levels ?? [];
  const safeTopics = topics ?? [];
  const safeLessons = lessons ?? [];
  const completedLessonIds = new Set(
    (progress ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_id)
  );
  const completedLessons = completedLessonIds.size;
  const currentLevel =
    safeLevels.find((level) => level.id === profile?.current_level_id) ?? safeLevels[0] ?? null;
  const nextLevel = currentLevel
    ? safeLevels.find((level) => level.level_order > currentLevel.level_order) ?? null
    : safeLevels[1] ?? null;

  const topicById = new Map(safeTopics.map((topic) => [topic.id, topic]));
  const levelById = new Map(safeLevels.map((level) => [level.id, level]));
  const sortedLessons = safeLessons
    .map((lesson) => {
      const topic = topicById.get(lesson.topic_id);
      const level = topic ? levelById.get(topic.level_id) : null;
      return { lesson, topic, level };
    })
    .filter((item) => item.topic && item.level)
    .sort((a, b) => {
      const levelOrder = (a.level?.level_order ?? 0) - (b.level?.level_order ?? 0);
      if (levelOrder !== 0) return levelOrder;
      const topicOrder = (a.topic?.topic_order ?? 0) - (b.topic?.topic_order ?? 0);
      if (topicOrder !== 0) return topicOrder;
      return a.lesson.lesson_order - b.lesson.lesson_order;
    });
  const nextLesson = sortedLessons.find((item) => !completedLessonIds.has(item.lesson.id));
  const levelProgress = safeLevels.map((level) => {
    const levelTopicIds = new Set(safeTopics.filter((topic) => topic.level_id === level.id).map((topic) => topic.id));
    const levelLessons = safeLessons.filter((lesson) => levelTopicIds.has(lesson.topic_id));
    const levelCompleted = levelLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
    return {
      level,
      lessons: levelLessons.length,
      completed: levelCompleted,
      progress: levelLessons.length ? (levelCompleted / levelLessons.length) * 100 : 0
    };
  });
  const displayName = profile?.full_name || user.email?.split("@")[0] || "Learner";
  const accuracy = answeredCount ? Math.round(((correctCount ?? 0) / answeredCount) * 100) : 0;
  const overallProgress = safeLessons.length ? (completedLessons / safeLessons.length) * 100 : 0;

  return (
    <>
      <PageHeader
        description="Continue your grammar journey and review what needs more practice."
        eyebrow="Dashboard"
        title={`Welcome, ${displayName}`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          detail={currentLevel?.title ?? "Choose a level in settings"}
          icon={<BookOpenCheck className="h-5 w-5" />}
          label="Current level"
          value={currentLevel ? currentLevel.level_order : "-"}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Lessons completed"
          value={completedLessons}
        />
        <StatCard
          icon={<ListChecks className="h-5 w-5" />}
          label="Questions answered"
          value={answeredCount ?? 0}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Mistakes"
          value={mistakesCount ?? 0}
        />
        <StatCard
          detail={answeredCount ? "Based on saved answers" : "Answer questions to calculate"}
          icon={<Target className="h-5 w-5" />}
          label="Accuracy"
          value={answeredCount ? `${accuracy}%` : "-"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="bg-primaryVerySoft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Continue learning</h2>
                <p className="mt-2 text-base text-body">Your next available lesson is ready.</p>
              </div>
              <Badge tone="blue">{Math.round(overallProgress)}% complete</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {nextLesson ? (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge tone="blue">{nextLesson.level?.title}</Badge>
                    <h3 className="mt-3 text-2xl font-semibold text-ink">{nextLesson.lesson.title}</h3>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-body">
                      {nextLesson.lesson.summary || nextLesson.topic?.title}
                    </p>
                    <p className="mt-3 text-sm font-medium text-muted">
                      Topic: <span className="text-ink">{nextLesson.topic?.title}</span>
                    </p>
                  </div>
                  <ButtonLink href={`/lessons/${nextLesson.lesson.id}`}>
                    Continue
                    <PlayCircle className="h-4 w-4" />
                  </ButtonLink>
                </div>
                <ProgressBar label="Overall lesson progress" value={overallProgress} />
              </div>
            ) : (
              <EmptyState
                action={<ButtonLink href="/learn">Go to Learn</ButtonLink>}
                description="Start with the learning path and your first published lesson."
                title="Start your first lesson"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Recent mistakes</h2>
            <p className="mt-1 text-sm text-body">Reviewing these will strengthen recall.</p>
          </CardHeader>
          <CardContent>
            {recentMistakes?.length ? (
              <div className="space-y-4">
                {recentMistakes.map((mistake) => (
                  <div className="border-b border-line pb-4 last:border-0 last:pb-0" key={mistake.id}>
                    <p className="text-sm font-medium text-ink">{mistake.questions?.prompt}</p>
                    <p className="mt-1 text-sm text-muted">
                      Your answer: <span className="text-red-700">{mistake.submitted_answer}</span>
                    </p>
                    <p className="text-sm text-muted">
                      Correct: <span className="text-success">{mistake.correct_answer}</span>
                    </p>
                  </div>
                ))}
                <Link className="inline-flex text-sm font-medium text-primary hover:text-primaryHover" href="/mistakes">
                  View all mistakes
                </Link>
              </div>
            ) : (
              <EmptyState
                description="Wrong answers from practice will appear here automatically."
                title="No mistakes yet"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-ink">Recommended practice</h2>
            <p className="mt-1 text-base text-body">Keep your next session focused and manageable.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge tone="blue">{nextLesson?.topic?.title ?? "Practice"}</Badge>
              <h3 className="mt-3 text-lg font-semibold text-ink">
                {nextLesson ? `Practice ${nextLesson.lesson.title}` : "Choose a lesson to practice"}
              </h3>
              <p className="mt-2 text-base leading-7 text-body">
                Practice reinforces the rule and saves wrong answers for review.
              </p>
            </div>
            <ButtonLink href={nextLesson ? `/practice/lesson/${nextLesson.lesson.id}` : "/practice"}>
              Start Practice
            </ButtonLink>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-ink">Recent activity</h2>
            <p className="mt-1 text-base text-body">A simple snapshot of your saved learning work.</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-secondary p-4">
              <p className="text-2xl font-semibold text-ink">{completedLessons}</p>
              <p className="mt-1 text-sm text-muted">Completed</p>
            </div>
            <div className="rounded-lg border border-line bg-secondary p-4">
              <p className="text-2xl font-semibold text-ink">{answeredCount ?? 0}</p>
              <p className="mt-1 text-sm text-muted">Answers</p>
            </div>
            <div className="rounded-lg border border-line bg-secondary p-4">
              <p className="text-2xl font-semibold text-ink">{mistakesCount ?? 0}</p>
              <p className="mt-1 text-sm text-muted">Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold text-ink">Learning path snapshot</h2>
          <p className="mt-1 text-base text-body">See where you are now and what comes next.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-lg border border-primary/15 bg-primaryVerySoft p-4">
              <Badge tone="blue">Current level</Badge>
              <h3 className="mt-3 text-xl font-semibold text-ink">{currentLevel?.title ?? "Choose a level"}</h3>
              <p className="mt-2 text-sm leading-6 text-body">
                {currentLevel?.description ?? "Select your current level in settings to personalize the dashboard."}
              </p>
            </div>
            <ArrowRight className="hidden h-5 w-5 text-primary md:block" />
            <div className="rounded-lg border border-line bg-secondary p-4">
              <Badge tone="gray">Next level</Badge>
              <h3 className="mt-3 text-xl font-semibold text-ink">{nextLevel?.title ?? "Path complete"}</h3>
              <p className="mt-2 text-sm leading-6 text-body">
                {nextLevel?.description ?? "Keep reviewing and practicing advanced grammar."}
              </p>
            </div>
          </div>
          <ProgressBar className="mt-5" label="Full curriculum progress" value={overallProgress} />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {levelProgress.map((item) => (
              <div className="rounded-lg border border-line bg-white p-4" key={item.level.id}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink">{item.level.title}</h3>
                  <Badge tone={item.progress === 100 && item.lessons ? "green" : "gray"}>
                    {item.completed}/{item.lessons}
                  </Badge>
                </div>
                <ProgressBar className="mt-4" label={`${item.level.title} progress`} value={item.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
