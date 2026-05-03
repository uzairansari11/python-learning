"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/button";

export default function TopBar() {
  const { isDark, toggleTheme, isMounted } = useTheme();

  const openSidebar = () =>
    window.dispatchEvent(new Event("toggle-sidebar"));

  // Use the View Transitions API for a fluid theme cross-fade when supported.
  const handleThemeToggle = () => {
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => toggleTheme());
    } else {
      toggleTheme();
    }
  };

  return (
    <header
      className="sticky top-0 z-20 h-14 border-b border-(--border) backdrop-blur"
      style={{ background: "color-mix(in oklab, var(--bg) 80%, transparent)" }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={openSidebar}
        >
          <Menu size={16} />
        </Button>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="icon"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={handleThemeToggle}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isMounted ? (isDark ? "sun" : "moon") : "moon"}
              initial={{ rotate: -45, opacity: 0, scale: 0.85 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="inline-flex"
            >
              {isMounted && isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
    </header>
  );
}
