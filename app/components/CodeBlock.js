"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function CodeBlock({ code, language = "python", filename }) {
  const [copied, setCopied] = useState(false);
  const { isDark, isMounted } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Choose a Prism theme that matches the current site theme.
  // Until mounted, render the light theme to match SSR.
  const prismStyle = isMounted && isDark ? oneDark : oneLight;
  const codeBg = isMounted && isDark ? "var(--code-bg)" : "var(--code-bg)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="code-surface rounded-md overflow-hidden my-4"
    >
      <div className="flex items-center justify-between px-4 h-9 border-b border-default surface-subtle">
        <span className="text-[11px] font-mono fg-subtle truncate">
          {filename || language.toUpperCase()}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[11px] font-medium fg-muted hover:fg transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="code-wrapper overflow-x-auto" style={{ background: codeBg }}>
        <SyntaxHighlighter
          language={language}
          style={prismStyle}
          customStyle={{
            margin: 0,
            padding: "1rem 1.25rem",
            background: "transparent",
            fontSize: "0.8125rem",
            lineHeight: "1.65",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            },
          }}
          showLineNumbers={code.split("\n").length > 5}
          lineNumberStyle={{
            color: "var(--fg-subtle, #a1a1aa)",
            opacity: 0.6,
            minWidth: "2.25rem",
            paddingRight: "1rem",
            userSelect: "none",
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}
