import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth/guards";
import type { NavItem } from "@/components/layout/SidebarNav";

const userNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/learn", label: "Learn", icon: "learn" },
  { href: "/practice", label: "Practice", icon: "practice" },
  { href: "/mistakes", label: "Mistakes", icon: "mistakes" },
  { href: "/settings", label: "Settings", icon: "settings" }
];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();
  const userLabel = profile?.full_name || user.email || "Learner";
  const items =
    profile?.role === "admin"
      ? [...userNavItems, { href: "/admin", label: "Admin", icon: "adminDashboard" } satisfies NavItem]
      : userNavItems;

  return (
    <AppShell items={items} label="Learning workspace" userLabel={userLabel}>
      {children}
    </AppShell>
  );
}
