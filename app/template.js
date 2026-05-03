"use client";

import { motion } from "framer-motion";

/**
 * app/template.js — re-renders on every navigation, so framer-motion's
 * mount/exit lifecycle gives us a clean cross-fade between routes without any
 * extra wiring at call sites.
 */
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
