import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  ListChecks,
  NotebookText,
  PenLine,
  RotateCcw,
  ShieldCheck,
  Target
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
  {
    title: "Step-by-step grammar lessons",
    description: "Follow a structured curriculum instead of jumping between disconnected rules.",
    icon: BookOpenCheck
  },
  {
    title: "Deep explanations and examples",
    description: "Study each rule with formulas, usage notes, examples, and common mistakes.",
    icon: NotebookText
  },
  {
    title: "Interactive practice",
    description: "Answer focused questions and get immediate feedback while the rule is fresh.",
    icon: PenLine
  },
  {
    title: "Smart tests",
    description: "Admin-managed test questions support lesson, topic, level, and mixed review.",
    icon: ClipboardCheck
  },
  {
    title: "Mistake review",
    description: "Wrong answers become a useful review list with the correct answer and explanation.",
    icon: RotateCcw
  },
  {
    title: "Progress tracking",
    description: "See completed lessons, answered questions, accuracy, and what to do next.",
    icon: BarChart3
  },
  {
    title: "Beginner to advanced path",
    description: "Move through Beginner, Intermediate, and Advanced without extra confusing level names.",
    icon: GraduationCap
  },
  {
    title: "Admin-managed content",
    description: "Levels, topics, lessons, and questions can expand into a serious curriculum.",
    icon: ShieldCheck
  }
];

const levels = [
  {
    title: "Beginner",
    badge: "Foundation",
    description: "Core sentence patterns, simple tenses, questions, negatives, articles, pronouns, and everyday accuracy."
  },
  {
    title: "Intermediate",
    badge: "Core grammar",
    description: "Perfect forms, modals, passive voice, reported speech, clauses, conditionals, and connected conversation."
  },
  {
    title: "Advanced",
    badge: "Advanced control",
    description: "Nuance, emphasis, formal grammar, academic and business style, discourse markers, and advanced conversation."
  }
];

const grammarLabels = ["Tenses", "Articles", "Prepositions", "Conditionals", "Clauses", "Writing"];

const whyItems = [
  ["Learn in order", "Start with foundations and build toward advanced grammar without guessing the next step."],
  ["Practice immediately", "Move from explanation to exercises while the grammar point is still clear."],
  ["Review mistakes", "Turn wrong answers into a focused study list rather than a discouraging score."],
  ["Track progress", "Use the dashboard to see lessons completed, answers saved, and topics to revisit."],
  ["Keep improving", "Return to weak topics, continue the path, and steadily sharpen grammar accuracy."]
];

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mr-0">
      <div className="absolute -left-4 top-10 hidden rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft sm:block">
        Tenses
      </div>
      <div className="absolute -right-3 bottom-20 hidden rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft sm:block">
        Clauses
      </div>
      <div className="rounded-lg border border-line bg-white/90 p-4 shadow-glow backdrop-blur">
        <div className="grid gap-4">
          <div className="rounded-lg border border-line bg-primaryVerySoft p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge tone="blue">Current lesson</Badge>
                <h2 className="mt-3 text-xl font-semibold text-ink">Present Simple Essentials</h2>
              </div>
              <span className="rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold text-muted">
                8 min
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-body">
              Subject + base verb. Add -s with he, she, and it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <Badge tone="gray">Practice question</Badge>
              <p className="mt-3 font-semibold text-ink">She ___ to school every day.</p>
              <div className="mt-4 grid gap-2">
                {["A. go", "B. goes", "C. going", "D. gone"].map((option) => (
                  <div
                    className={
                      option.includes("goes")
                        ? "rounded-lg border border-green-200 bg-successSoft px-3 py-2 text-sm font-semibold text-success"
                        : "rounded-lg border border-line bg-secondary px-3 py-2 text-sm text-muted"
                    }
                    key={option}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
                <Badge tone="blue">Progress</Badge>
                <p className="mt-3 text-3xl font-semibold text-ink">68%</p>
                <ProgressBar className="mt-3" value={68} />
              </div>
              <div className="rounded-lg border border-amber-100 bg-warningSoft p-5">
                <Badge tone="amber">Mistake review</Badge>
                <p className="mt-3 text-sm leading-6 text-body">6 answers ready to revisit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonPreview() {
  return (
    <Card>
      <CardContent>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Badge tone="blue">Lesson preview</Badge>
          <Badge tone="gray">Beginner</Badge>
        </div>
        <h3 className="text-2xl font-semibold text-ink">Present Simple</h3>
        <div className="mt-5 grid gap-4">
          <div className="rounded-lg border border-line bg-secondary p-4">
            <p className="text-sm font-semibold text-primary">Explanation</p>
            <p className="mt-2 text-base leading-7 text-body">
              Use the present simple for habits, routines, facts, and things that are generally true.
            </p>
          </div>
          <div className="rounded-lg border border-primary/15 bg-primarySoft p-4">
            <p className="text-sm font-semibold text-primary">Structure / Formula</p>
            <p className="mt-2 font-mono text-base leading-7 text-primary">Subject + base verb (+ s/es)</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["I study English every morning.", "She reads before work."].map((example) => (
              <div className="rounded-lg border border-green-100 bg-successSoft p-4" key={example}>
                <p className="text-sm font-semibold text-success">Example</p>
                <p className="mt-2 text-base text-ink">{example}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-red-100 bg-errorSoft p-4">
            <p className="text-sm font-semibold text-error">Common mistake</p>
            <p className="mt-2 text-base leading-7 text-body">Wrong: She go to school. Correct: She goes to school.</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">Summary</p>
            <p className="mt-2 text-base leading-7 text-body">
              Present simple is the clean default for repeated actions and general facts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PracticePreview() {
  return (
    <Card>
      <CardContent>
        <div className="mb-5 flex items-center justify-between gap-4">
          <Badge tone="blue">Practice preview</Badge>
          <span className="text-sm font-semibold text-muted">Question 1 of 8</span>
        </div>
        <ProgressBar value={22} />
        <h3 className="mt-5 text-2xl font-semibold text-ink">She ___ to school every day.</h3>
        <div className="mt-5 grid gap-3">
          {["A. go", "B. goes", "C. going", "D. gone"].map((option) => (
            <div
              className={
                option.includes("goes")
                  ? "flex items-center justify-between rounded-lg border border-green-200 bg-successSoft p-4 font-semibold text-success"
                  : "rounded-lg border border-line bg-secondary p-4 text-body"
              }
              key={option}
            >
              <span>{option}</span>
              {option.includes("goes") ? <CheckCircle2 className="h-5 w-5" /> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MistakeReviewPreview() {
  return (
    <Card>
      <CardContent>
        <Badge tone="amber">Mistake review preview</Badge>
        <h3 className="mt-4 text-2xl font-semibold text-ink">Understand the correction</h3>
        <p className="mt-2 text-base leading-7 text-body">Each saved mistake keeps the question, your answer, and the explanation.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-errorSoft p-4">
            <p className="text-sm font-semibold text-error">Your answer</p>
            <p className="mt-2 text-base text-ink">She go</p>
          </div>
          <div className="rounded-lg border border-green-100 bg-successSoft p-4">
            <p className="text-sm font-semibold text-success">Correct answer</p>
            <p className="mt-2 text-base text-ink">She goes</p>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-line bg-secondary p-4">
          <p className="text-sm font-semibold text-ink">Explanation</p>
          <p className="mt-2 text-base leading-7 text-body">
            Add -s to the verb with he, she, and it in the present simple.
          </p>
        </div>
        <div className="mt-5">
          <span className="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-primary shadow-sm">
            Retry mistake
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPreview() {
  return (
    <Card>
      <CardContent>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Badge tone="blue">Dashboard preview</Badge>
          <span className="text-sm font-semibold text-primary">Current level: Beginner</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Lessons completed", "12"],
            ["Questions answered", "148"],
            ["Mistakes to review", "6"],
            ["Accuracy", "84%"]
          ].map(([label, value]) => (
            <div className="rounded-lg border border-line bg-secondary p-4" key={label}>
              <p className="text-sm font-medium text-muted">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-primary/15 bg-primaryVerySoft p-4">
          <p className="text-sm font-semibold text-primary">Continue learning</p>
          <p className="mt-2 text-lg font-semibold text-ink">Present Simple Essentials</p>
          <ProgressBar className="mt-4" value={68} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden border-b border-line premium-surface">
          <div className="absolute inset-0 surface-grid opacity-60" />
          {grammarLabels.map((word, index) => (
            <span
              className="absolute hidden rounded-full border border-line bg-white/75 px-4 py-2 text-sm font-semibold text-primary/70 shadow-soft lg:block"
              key={word}
              style={{
                left: `${7 + index * 15}%`,
                top: `${18 + (index % 2) * 48}%`,
                animation: `float ${6 + index}s ease-in-out infinite`
              }}
            >
              {word}
            </span>
          ))}
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:py-24">
            <div className="flex flex-col justify-center">
              <Badge tone="blue" className="w-fit">
                Free structured English grammar learning
              </Badge>
              <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-normal text-ink sm:text-6xl">
                Master English Grammar From Beginner to Advanced
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-body">
                Learn grammar step by step with clear lessons, deep examples, smart practice, tests,
                and mistake review.
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

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeader
            centered
            description="A premium study loop for serious learners: understand the rule, practice it, review mistakes, and continue along the path."
            eyebrow="Core features"
            title="Built for calm, focused grammar study"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card className="transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift" key={feature.title}>
                  <CardContent>
                    <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primarySoft text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-lg font-semibold text-ink">{feature.title}</h2>
                    <p className="mt-3 text-base leading-7 text-body">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-y border-line bg-secondary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeader
                description="The curriculum is designed as a serious academy path, from first grammar patterns to advanced sentence control."
                eyebrow="Learning path preview"
                title="A clear three-level grammar path"
              />
              <ButtonLink href="/learn" variant="secondary">
                Open Learning Path
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="relative mt-2 grid gap-4 md:grid-cols-3">
              {levels.map((level, index) => (
                <div className="relative" key={level.title}>
                  <Card className="h-full">
                    <CardContent>
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                          {index + 1}
                        </div>
                        <Badge tone={index === 0 ? "green" : index === 1 ? "blue" : "amber"}>{level.badge}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-ink">{level.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-body">{level.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeader
            centered
            description="Lessons are designed for long study sessions: readable text, scannable sections, and immediate practice."
            eyebrow="Study experience"
            title="Lessons, practice, mistakes, and progress in one learning loop"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <LessonPreview />
            <PracticePreview />
            <MistakeReviewPreview />
            <DashboardPreview />
          </div>
        </section>

        <section className="border-y border-line bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeader
              centered
              description="The platform stays focused on grammar learning: lessons, practice, tests, mistake review, and steady progress."
              eyebrow="Why this platform"
              title="A serious free grammar academy"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {whyItems.map(([title, description], index) => (
                <div className="rounded-lg border border-line bg-secondary p-5" key={title}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primarySoft text-primary">
                    {[Layers3, PenLine, RotateCcw, BarChart3, Target].map((Icon, iconIndex) =>
                      iconIndex === index ? <Icon className="h-5 w-5" key={title} /> : null
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-body">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
          <Badge tone="blue" className="mx-auto">
            Start free
          </Badge>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-ink">
            Build stronger grammar with a clear path and useful review.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-body">
            Create an account, choose your current level, and begin with the first lesson in your path.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/login" size="lg" variant="secondary">
              Log in
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-secondary py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <ListChecks className="h-5 w-5" />
              </span>
              GrammarFlow
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-body">
              A free English grammar learning platform for structured lessons, practice, tests, and mistake review.
            </p>
          </div>
          <div className="grid gap-3 text-sm font-medium text-muted sm:grid-cols-2 lg:grid-cols-4">
            <Link className="hover:text-primary" href="/learn">
              Lessons
            </Link>
            <Link className="hover:text-primary" href="/practice">
              Practice
            </Link>
            <Link className="hover:text-primary" href="/tests">
              Tests
            </Link>
            <Link className="hover:text-primary" href="/login">
              Login
            </Link>
            <span className="sm:col-span-2 lg:col-span-4">© 2026 GrammarFlow. Free grammar learning.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
