import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

type AuthCardProps = {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
};

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.02fr_0.98fr]">
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link className="mb-8 flex items-center gap-2 text-lg font-semibold text-ink" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            GrammarFlow
          </Link>
          <Card className="shadow-glow">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-normal text-ink">{title}</h1>
                <p className="text-base leading-7 text-muted">{subtitle}</p>
              </div>
              {children}
              <div className="border-t border-line pt-5 text-center text-sm text-muted">{footer}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-secondary p-10 lg:block">
        <div className="absolute inset-0 surface-grid opacity-70" />
        <div className="relative flex h-full items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-3xl border border-line bg-white/90 p-6 shadow-glow backdrop-blur">
              <p className="text-sm font-semibold text-primary">Continue your grammar journey</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Present Simple Essentials</h2>
              <p className="mt-3 text-base leading-7 text-muted">
                Pick up exactly where you left off with clean lessons and focused practice.
              </p>
            </div>
            {["Review your mistakes", "Practice daily", "Track progress"].map((item, index) => (
              <div
                className="ml-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft"
                key={item}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-success">
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
