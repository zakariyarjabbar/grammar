import type { NavItem } from "@/components/layout/SidebarNav";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { LogOut } from "lucide-react";
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
    <div className="min-h-screen bg-background surface-grid">
      <SidebarNav items={items} label={label} userLabel={userLabel} />
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="mb-6 hidden justify-end lg:flex">
            <form action={signOutAction}>
              <Button size="sm" type="submit" variant="secondary">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
