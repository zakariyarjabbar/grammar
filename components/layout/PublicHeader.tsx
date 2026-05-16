"use client";

import Link from "next/link";
import { BookOpen, LogIn, Menu, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: "Home" },
    { href: "/learn", label: "Lessons" },
    { href: "/practice", label: "Practice" },
    { href: "/practice", label: "Tests" }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2 text-lg font-semibold text-ink" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </span>
          GrammarFlow
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {links.map((link) => (
            <Link className="hover:text-primary" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
        <nav className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/login" variant="ghost">
            <LogIn className="h-4 w-4" />
            Login
          </ButtonLink>
          <ButtonLink href="/register" variant="primary">
            <UserPlus className="h-4 w-4" />
            Get Started
          </ButtonLink>
        </nav>
        <button
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink md:hidden"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 top-16 z-40 border-t border-line bg-background/95 p-4 backdrop-blur-xl md:hidden">
          <div className="mb-4 flex justify-end">
            <button
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-2">
            {links.map((link) => (
              <Link
                className="rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-secondary"
                href={link.href}
                key={link.label}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 grid gap-2">
              <ButtonLink href="/login" variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink href="/register">Get Started</ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
