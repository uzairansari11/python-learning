"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TopicCard({ title, description, href, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        href={href}
        className="group block h-full p-5 border border-default rounded-lg surface-hover transition-colors"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold tracking-tight">{title}</span>
          <span
            aria-hidden
            className="fg-subtle group-hover:fg transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </div>
        <p className="text-sm fg-muted leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  );
}
