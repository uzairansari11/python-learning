"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Minimal monochrome tab group.
 *
 * Usage:
 *   <Tabs items={[{ label, content }, ...]} />
 */
export default function Tabs({ items, initial = 0 }) {
  const [active, setActive] = useState(initial);
  const item = items[active];

  return (
    <div className="border border-default rounded-lg overflow-hidden">
      <div
        role="tablist"
        className="flex border-b border-default surface-subtle overflow-x-auto"
      >
        {items.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.label}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={`relative px-4 h-10 text-xs font-medium tracking-tight whitespace-nowrap transition-colors ${
                selected ? "fg" : "fg-muted hover:fg"
              }`}
            >
              {t.label}
              {selected && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute left-3 right-3 -bottom-px h-0.5 bg-(--fg)"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="p-5"
      >
        {item.content}
      </motion.div>
    </div>
  );
}
