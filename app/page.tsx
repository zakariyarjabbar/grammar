import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  Layers3,
  ListChecks,
  PenLine,
  RotateCcw,
  Sparkles,
  Target
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
  {
    title: "Step-by-step lessons",
    description: "Short, structured explanations that help grammar rules feel practical.",
    icon: BookOpenCheck
  },
  {
    title: "Interactive practice",
    description: "Multiple question types with immediate feedback and clear explanations.",
    icon: PenLine
  },
  {
    title: "Smart tests",
    description: "Focused grammar checks for lessons, topics, and long-term review.",
    icon: ClipboardCheck
  },
  {
    title: "Mistake review",
    description: "Wrong answers are saved so learners can turn weak spots into strengths.",
    icon: RotateCcw
  },
  {
    title: "Progress tracking",
    description: "A clean dashboard shows completed lessons, answers, and review work.",
    icon: BarChart3
  },
  {
    title: "Beginner to advanced path",
    description: "A guided curriculum moves from foundations to more precise grammar.",
    icon: Layers3
  }
];

const levels = [
  "Absolute Beginner",
  "Beginner",
  "Elementary",
  "Pre-Intermediate",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced",
  "Expert Mastery"
];
const grammarWords = ["Tenses", "Articles", "Prepositions", "Clauses", "Conditionals"];

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -left-5 top-10 hidden rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-primary shadow-soft sm:block">
        Tenses
      </div>
      <div className="absolute -right-3 bottom-16 hidden rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-primary shadow-soft sm:block">
        Clauses
      </div>
      <div className="rounded-[2rem] border border-line bg-white/85 p-4 shadow-glow backdrop-blur">
        <div className="grid gap-4">
          <div className="rounded-3xl border border-line bg-secondary p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Lesson</p>
                <h2 className="mt-1 text-xl font-semibold text-ink">Present Simple Essentials</h2>
              </div>
              <span className="rounded-xl bg-white px-3 py-1 text-sm font-medium text-muted">8 min</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Subject + base verb. Add -s with he, she, and it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-primary">Practice</p>
              <p className="mt-2 font-medium text-ink">She ___ to school every day.</p>
              <div className="mt-4 grid gap-2">
                {["go", "goes", "going", "gone"].map((option) => (
                  <div
                    className={
                      option === "goes"
                        ? "rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-success"
                        : "rounded-xl border border-line bg-secondary px-3 py-2 text-sm text-muted"
                    }
                    key={option}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-primary">Progress</p>
                <p className="mt-2 text-3xl font-semibold text-ink">68%</p>
                <ProgressBar className="mt-3" value={68} />
              </div>
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
                <p className="text-sm font-semibold text-warning">Mistake review</p>
                <p className="mt-2 text-sm leading-6 text-muted">6 answers ready to revisit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden border-b border-line/80">
          <div className="absolute inset-0 surface-grid opacity-70" />
          {grammarWords.map((word, index) => (
            <span
              className="absolute hidden rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold text-primary/60 shadow-soft lg:block"
              key={word}
              style={{
                left: `${8 + index * 18}%`,
                top: `${18 + (index % 2) * 48}%`,
                animation: `float ${5 + index}s ease-in-out infinite`
              }}
            >
              {word}
            </span>
          ))}
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Free structured English grammar learning
              </div>
              <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-normal text-ink sm:text-6xl">
                Master English Grammar From Beginner to Advanced
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">
                Learn grammar step by step with clear lessons, smart practice, tests, examples, and
                mistake review.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/register" size="lg">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/learn" size="lg" variant="secondary">
                  Explore Lessons
                </ButtonLink>
              </div>
            </div>
            <HeroMockup />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            centered
            description="Everything in version 1 supports the core learning loop: read, practice, review, and continue."
            eyebrow="Core features"
            title="Built for calm, focused grammar study"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card className="transition hover:-translate-y-1 hover:border-primary/30" key={feature.title}>
                  <CardContent>
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="text-xl font-semibold text-ink">{feature.title}</h2>
                    <p className="mt-3 text-base leading-7 text-muted">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-secondary py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              description="Start with foundations, then move toward more advanced grammar without guessing what comes next."
              eyebrow="Learning path"
              title="A clear journey from basics to fluency"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {levels.map((level, index) => (
                <Card className="relative overflow-hidden" key={level}>
                  <CardContent>
                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-ink">{level}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {index === 0 ? "Core patterns" : index === 4 ? "Precision grammar" : "Guided progress"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Card>
            <CardContent>
              <SectionHeader
                description="Answer choices feel clear, feedback appears immediately, and wrong answers become review material."
                eyebrow="Practice preview"
                title="Practice that teaches"
              />
              <div className="rounded-3xl border border-line bg-secondary p-5">
                <p className="font-semibold text-ink">She ___ to school every day.</p>
                <div className="mt-4 grid gap-3">
                  {["A. go", "B. goes", "C. going", "D. gone"].map((option) => (
                    <div
                      className={
                        option.includes("goes")
                          ? "rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-success"
                          : "rounded-2xl border border-line bg-white p-4 text-muted"
                      }
                      key={option}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionHeader
                description="The dashboard gives learners a quick sense of where they are and what to do next."
                eyebrow="Dashboard preview"
                title="A useful study home"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Lessons completed", "12"],
                  ["Questions answered", "148"],
                  ["Mistakes to review", "6"],
                  ["Continue learning", "Present Simple"]
                ].map(([label, value]) => (
                  <div className="rounded-2xl border border-line bg-secondary p-4" key={label}>
                    <p className="text-sm font-medium text-muted">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="border-y border-line bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              centered
              description="GrammarFlow is designed to be simple enough for daily study and structured enough to grow into a full curriculum."
              eyebrow="Why GrammarFlow"
              title="Premium learning experience, free to use"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Readable lessons", "Study pages are calm, spacious, and built for longer reading sessions."],
                ["Practical review", "Mistakes stay visible until learners review and resolve them."],
                ["Expandable content", "Admins can manage levels, topics, lessons, and questions without code."]
              ].map(([title, description]) => (
                <div className="rounded-3xl border border-line bg-secondary p-6" key={title}>
                  <Target className="mb-4 h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-4xl font-semibold tracking-normal text-ink">
            Start building stronger grammar today.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">
            Create a free account, choose your level, and begin with your first lesson.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/register" size="lg">
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-secondary py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <ListChecks className="h-5 w-5" />
              </span>
              GrammarFlow
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              A free English grammar learning platform for structured lessons, practice, and review.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-muted">
            <Link className="hover:text-primary" href="/learn">
              Lessons
            </Link>
            <Link className="hover:text-primary" href="/practice">
              Practice
            </Link>
            <Link className="hover:text-primary" href="/login">
              Login
            </Link>
            <span>© 2026 GrammarFlow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
