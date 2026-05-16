import { AppShell } from "@/components/layout/AppShell";
import { requireAdmin } from "@/lib/auth/guards";
import type { NavItem } from "@/components/layout/SidebarNav";

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "adminDashboard" },
  { href: "/admin/levels", label: "Levels", icon: "levels" },
  { href: "/admin/topics", label: "Topics", icon: "topics" },
  { href: "/admin/lessons", label: "Lessons", icon: "lessons" },
  { href: "/admin/questions", label: "Questions", icon: "questions" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireAdmin();
  const userLabel = profile?.full_name || user.email || "Admin";

  return (
    <AppShell items={adminNavItems} label="Admin workspace" userLabel={userLabel}>
      {children}
    </AppShell>
  );
}
