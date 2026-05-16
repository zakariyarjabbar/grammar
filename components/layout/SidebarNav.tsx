"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  LibraryBig,
  Menu,
  NotebookText,
  RotateCcw,
  Settings,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const navIcons = {
  adminDashboard: LayoutDashboard,
  dashboard: BarChart3,
  learn: GraduationCap,
  practice: BookOpen,
  mistakes: RotateCcw,
  settings: Settings,
  levels: Layers3,
  topics: LibraryBig,
  lessons: NotebookText,
  questions: FileQuestion
};

export type NavIconKey = keyof typeof navIcons;

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconKey;
};

type SidebarNavProps = {
  items: NavItem[];
  label: string;
  userLabel: string;
};

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = navIcons[item.icon];
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-primaryVerySoft hover:text-primary",
              active && "bg-primarySoft text-primary ring-1 ring-primary/10"
            )}
            href={item.href}
            key={item.href}
            onClick={onNavigate}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarNav({ items, label, userLabel }: SidebarNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-line bg-card px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold text-ink">GrammarFlow</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        </div>
        <NavLinks items={items} />
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-secondary p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Signed in</p>
          <p className="mt-1 truncate text-sm font-semibold text-ink">{userLabel}</p>
          <Link
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primaryHover"
            href="/settings"
          >
            <Settings className="h-4 w-4" />
            Account settings
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-card/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">GrammarFlow</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          </div>
          <button
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-ink"
            onClick={() => setOpen(true)}
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/30 lg:hidden">
          <aside className="ml-auto flex h-full w-80 max-w-[90vw] flex-col border-l border-line bg-card p-4 shadow-glow">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Menu</p>
                <p className="text-sm text-muted">{userLabel}</p>
              </div>
              <button
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-ink"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks items={items} onNavigate={() => setOpen(false)} />
            <div className="mt-auto rounded-lg border border-line bg-secondary p-4 text-sm">
              <p className="font-semibold text-ink">{userLabel}</p>
              <Link
                className="mt-3 inline-flex items-center gap-2 font-semibold text-primary hover:text-primaryHover"
                href="/settings"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Session and profile
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
