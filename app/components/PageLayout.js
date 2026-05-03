"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PageLayout({ title, subtitle, children }) {
  return (
    <div>
      {/* Hero */}
      <div className="border-b border-default px-6 sm:px-10 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs fg-muted mb-6"
          >
            <Link href="/" className="hover:fg transition-colors">
              Home
            </Link>
            <span className="fg-subtle">/</span>
            <span className="fg">{title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg fg-muted max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
