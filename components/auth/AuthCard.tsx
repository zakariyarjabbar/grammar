import Link from "next/link";
import { BookOpen, CheckCircle2, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

type AuthCardProps = {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
  visualTitle?: string;
  visualSubtitle?: string;
  visualItems?: string[];
};

export function AuthCard({
  title,
  subtitle,
  footer,
  children,
  visualTitle = "Continue your grammar journey",
  visualSubtitle = "Pick up exactly where you left off with clean lessons and focused practice.",
  visualItems = ["Review mistakes", "Practice today", "Track progress"]
}: AuthCardProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.02fr_0.98fr]">
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link className="mb-8 flex items-center gap-2 text-lg font-semibold text-ink" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            GrammarFlow
          </Link>
          <Card className="shadow-glow">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-normal text-ink">{title}</h1>
                <p className="text-base leading-7 text-body">{subtitle}</p>
              </div>
              {children}
              <div className="border-t border-line pt-5 text-center text-sm text-muted">{footer}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="relative hidden overflow-hidden border-l border-line bg-secondary p-10 lg:block">
        <div className="absolute inset-0 surface-grid opacity-70" />
        <div className="relative flex h-full items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-lg border border-line bg-white/92 p-6 shadow-glow backdrop-blur">
              <Badge tone="blue">Grammar academy</Badge>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{visualTitle}</h2>
              <p className="mt-3 text-base leading-7 text-body">{visualSubtitle}</p>
              <div className="mt-5 rounded-lg border border-primary/15 bg-primaryVerySoft p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Current path</p>
                    <p className="text-sm text-muted">Beginner to advanced grammar</p>
                  </div>
                </div>
              </div>
            </div>
            {visualItems.map((item, index) => (
              <div
                className="ml-8 flex items-center gap-3 rounded-lg border border-line bg-white p-4 shadow-soft"
                key={item}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-successSoft text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <span className="font-medium text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
