"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  PlayCircle,
  Sparkles,
  Library,
  Boxes,
  Cpu,
  Layers,
} from "lucide-react";
import { cn } from "../../lib/utils";

// Curriculum: a linear path from Python fundamentals → master Python → Django-ready.
const groups = [
  {
    name: "Start",
    icon: Home,
    topics: [
      { name: "Overview", href: "/", icon: Home },
      { name: "Practice", href: "/practice", icon: PlayCircle },
    ],
  },
  {
    name: "1 · Python Foundations",
    icon: Sparkles,
    topics: [
      { name: "Basics", href: "/basics" },
      { name: "String Operations", href: "/string-ops" },
      { name: "Lists, Tuples & Arrays", href: "/lists-arrays" },
      { name: "Dicts & Objects", href: "/dicts-objects" },
      { name: "Functions", href: "/functions" },
      { name: "*args & **kwargs", href: "/args-kwargs" },
    ],
  },
  {
    name: "2 · Standard Library",
    icon: Library,
    topics: [
      { name: "Built-in Methods", href: "/built-ins" },
      { name: "Collections Library", href: "/collections-lib" },
      { name: "File Handling", href: "/file-handling" },
      { name: "Error Handling", href: "/error-handling" },
    ],
  },
  {
    name: "3 · OOP Mastery",
    icon: Boxes,
    topics: [
      { name: "Classes & OOP", href: "/classes" },
      { name: "OOP Deep Dive", href: "/oop-deep" },
      { name: "Decorators", href: "/decorators" },
    ],
  },
  {
    name: "4 · Concurrency",
    icon: Cpu,
    topics: [{ name: "Threads & Concurrency", href: "/threads" }],
  },
  {
    name: "5 · Django-Ready",
    icon: Layers,
    topics: [{ name: "Django Prep", href: "/django-prep" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : undefined }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-(--border) bg-(--bg)",
          "transform transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/"
            className="flex items-center gap-2 h-14 px-5 border-b border-(--border) shrink-0"
          >
            <span className="font-mono text-sm font-bold tracking-tight">py</span>
            <span className="text-(--fg-subtle)">/</span>
            <span className="font-semibold tracking-tight">concepts</span>
          </Link>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            {groups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.name} className="mb-6">
                  <div className="flex items-center gap-2 px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--fg-subtle)">
                    {GroupIcon && <GroupIcon size={12} aria-hidden />}
                    <span>{group.name}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {group.topics.map((t) => {
                      const active =
                        t.href === "/"
                          ? pathname === "/"
                          : pathname === t.href ||
                            pathname.startsWith(t.href + "/");
                      const ItemIcon = t.icon;
                      return (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className={cn(
                              "relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                              active
                                ? "text-(--fg) bg-(--bg-muted) font-medium"
                                : "text-(--fg-muted) hover:bg-(--bg-hover) hover:text-(--fg)"
                            )}
                          >
                            {active && (
                              <motion.span
                                layoutId="sidebar-active"
                                className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-(--fg)"
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 38,
                                }}
                              />
                            )}
                            {ItemIcon && (
                              <ItemIcon size={14} className="shrink-0" aria-hidden />
                            )}
                            <span>{t.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="border-t border-(--border) px-5 py-3 text-[11px] text-(--fg-subtle)">
            v0.2 · monochrome
          </div>
        </div>
      </motion.aside>
    </>
  );
}
