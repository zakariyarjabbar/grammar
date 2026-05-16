import type { NavItem } from "@/components/layout/SidebarNav";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { LogOut, UserCircle } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

type AppShellProps = {
  children: React.ReactNode;
  items: NavItem[];
  label: string;
  userLabel: string;
};

export function AppShell({ children, items, label, userLabel }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav items={items} label={label} userLabel={userLabel} />
      <main className="lg:pl-72">
        <div className="sticky top-0 z-20 hidden border-b border-line bg-background/90 backdrop-blur-xl lg:block">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
            <div>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-xs text-muted">Study, practice, review, and keep moving forward.</p>
            </div>
            <form action={signOutAction}>
              <Button size="sm" type="submit" variant="secondary">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 hidden rounded-lg border border-line bg-card p-4 shadow-soft lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primarySoft text-primary">
                <UserCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{userLabel}</p>
                <p className="text-xs text-muted">Your free grammar academy workspace</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-6 text-body">
              Continue your grammar journey and review what needs more practice.
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
