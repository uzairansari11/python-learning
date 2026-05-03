"use client";

import { motion } from "framer-motion";

export default function Section({ title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="mb-14"
    >
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-5 pb-2 border-b border-default">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </motion.section>
  );
}

export function SubSection({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      <h3 className="text-base sm:text-lg font-semibold tracking-tight mb-2">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

export function Explain({ children }) {
  return (
    <p className="fg-muted leading-relaxed text-[0.95rem]">{children}</p>
  );
}

export function Callout({ type = "info", children }) {
  const labels = {
    info: "Note",
    warning: "Warning",
    success: "Tip",
    tip: "Tip",
  };
  const label = labels[type] || "Note";
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="my-4 border-l-2 border-default pl-4 py-1"
    >
      <div className="text-[10px] uppercase tracking-wider fg-subtle font-semibold mb-1">
        {label}
      </div>
      <p className="text-sm fg-muted leading-relaxed">{children}</p>
    </motion.div>
  );
}

export function Exercise({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="my-6 border border-default rounded-lg p-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold fg-subtle">
          Exercise
        </span>
        <span className="h-px flex-1 bg-(--border)" />
      </div>
      <h4 className="text-base font-semibold tracking-tight mb-2">{title}</h4>
      <div className="text-sm fg-muted leading-relaxed space-y-2">
        {children}
      </div>
    </motion.div>
  );
}

export function RealWorld({ title, scenario, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="my-6 border border-default rounded-lg overflow-hidden"
    >
      <div className="px-5 py-3 surface-subtle border-b border-default">
        <div className="text-[10px] uppercase tracking-wider fg-subtle font-semibold">
          Real-world scenario
        </div>
        <h4 className="text-base font-semibold tracking-tight mt-0.5">
          {title}
        </h4>
      </div>
      <div className="p-5 space-y-3">
        {scenario && (
          <p className="text-sm fg-muted leading-relaxed">{scenario}</p>
        )}
        {children}
      </div>
    </motion.div>
  );
}
