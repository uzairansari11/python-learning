"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Library,
  Boxes,
  Cpu,
  Layers,
  PlayCircle,
} from "lucide-react";
import { Button } from "./components/ui/button";

// Curriculum: a linear path from Python fundamentals → master Python → Django-ready.
const groups = [
  {
    name: "1 · Python Foundations",
    icon: Sparkles,
    blurb:
      "The syntax and core data types you'll touch in every Python file you ever write.",
    topics: [
      { title: "Basics", href: "/basics", desc: "Variables, types, operators, control flow, comprehensions." },
      { title: "String Operations", href: "/string-ops", desc: "Methods, f-strings, formatting, regex." },
      { title: "Lists, Tuples & Arrays", href: "/lists-arrays", desc: "Sequences, sets, and array semantics." },
      { title: "Dicts & Objects", href: "/dicts-objects", desc: "Hash maps, views, ordering, and patterns." },
      { title: "Functions", href: "/functions", desc: "def, lambdas, closures, higher-order functions." },
      { title: "*args & **kwargs", href: "/args-kwargs", desc: "Variable arguments, unpacking, parameter rules." },
    ],
  },
  {
    name: "2 · Standard Library",
    icon: Library,
    blurb:
      "Power-ups that keep you out of third-party packages until you really need them.",
    topics: [
      { title: "Built-in Methods", href: "/built-ins", desc: "Essential built-ins for strings, lists, dicts." },
      { title: "Collections Library", href: "/collections-lib", desc: "Counter, deque, defaultdict, OrderedDict." },
      { title: "File Handling", href: "/file-handling", desc: "open(), context managers, JSON, CSV, pathlib." },
      { title: "Error Handling", href: "/error-handling", desc: "try/except, custom exceptions, chaining, logging." },
    ],
  },
  {
    name: "3 · OOP Mastery",
    icon: Boxes,
    blurb: "Django is class-heavy. Master classes here so framework code reads itself.",
    topics: [
      { title: "Classes & OOP", href: "/classes", desc: "All 12 class topics — init, properties, dunders, dataclasses." },
      { title: "OOP Deep Dive", href: "/oop-deep", desc: "MRO, super(), mixins, ABCs, descriptors, metaclasses." },
      { title: "Decorators", href: "/decorators", desc: "Wrapping functions, functools.wraps, class decorators." },
    ],
  },
  {
    name: "4 · Concurrency",
    icon: Cpu,
    blurb: "Threads, locks, the GIL, and async basics — what production servers actually do.",
    topics: [
      { title: "Threads & Concurrency", href: "/threads", desc: "Threads, locks, the GIL, and async basics." },
    ],
  },
  {
    name: "5 · Django-Ready",
    icon: Layers,
    blurb:
      "The Python patterns you'll see in every Django app — once these click, the framework feels obvious.",
    topics: [
      { title: "Django Prep", href: "/django-prep", desc: "ORM patterns, descriptors, request/response, middleware." },
    ],
  },
];

const fade = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-(--border) px-6 sm:px-10 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-6 text-xs text-(--fg-muted) border border-(--border) rounded-full px-3 py-1"
          >
            <Sparkles size={12} aria-hidden />
            Master Python, then Django.
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fade}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-5"
          >
            A reference for Python concepts.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fade}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-base sm:text-lg text-(--fg-muted) max-w-2xl leading-relaxed mb-8"
          >
            From fundamentals to advanced patterns — explained with animated
            traces, real-world examples, exercises, and a live Python editor in
            your browser.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/basics">
                Start with Basics
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/practice">
                <PlayCircle size={16} />
                Open Practice
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl border-t border-(--border) pt-8">
            <Stat value="14" label="Topics" />
            <Stat value="100+" label="Examples" />
            <Stat value="∞" label="Exercises" />
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-6 sm:px-10 py-16">
        <div className="max-w-5xl mx-auto space-y-14">
          {groups.map((group, gi) => {
            const GroupIcon = group.icon;
            return (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-1.5 text-(--fg-subtle)">
                  {GroupIcon && <GroupIcon size={14} aria-hidden />}
                  <h2 className="text-xs font-semibold uppercase tracking-wider">
                    {group.name}
                  </h2>
                </div>
                {group.blurb && (
                  <p className="text-sm text-(--fg-muted) leading-relaxed mb-4 max-w-3xl">
                    {group.blurb}
                  </p>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-(--border) rounded-lg overflow-hidden bg-(--bg-subtle)">
                  {group.topics.map((t, ti) => (
                    <motion.li
                      key={t.href}
                      className="bg-(--bg)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: 0.04 * ti }}
                    >
                      <Link
                        href={t.href}
                        className="group block h-full p-5 hover:bg-(--bg-hover) transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold tracking-tight">
                            {t.title}
                          </span>
                          <ArrowRight
                            size={14}
                            className="text-(--fg-subtle) transition-transform group-hover:translate-x-0.5 group-hover:text-(--fg)"
                            aria-hidden
                          />
                        </div>
                        <p className="text-sm text-(--fg-muted) leading-relaxed">
                          {t.desc}
                        </p>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-(--fg-muted) mt-0.5">{label}</div>
    </div>
  );
}
