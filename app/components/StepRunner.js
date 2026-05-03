"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Step-through animator for code execution traces.
 *
 * Each step is shaped like:
 *   {
 *     line: number,             // 1-indexed line that just executed (optional)
 *     state: { var: value, ... }, // variables to display as boxes
 *     output: "string",         // optional stdout to append for this step
 *     note: "string",           // optional caption shown beneath the code
 *   }
 *
 * Props:
 *   - code: string of source to display
 *   - steps: array of step objects
 *   - language: highlight language (default "python")
 *   - autoplayMs: if set, advances automatically (e.g. 1200)
 */
export default function StepRunner({ code, steps, language = "python", autoplayMs }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(Boolean(autoplayMs));
  const timer = useRef(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setTimeout(() => {
      setI((n) => (n + 1 >= steps.length ? 0 : n + 1));
    }, autoplayMs || 1400);
    return () => clearTimeout(timer.current);
  }, [i, playing, autoplayMs, steps.length]);

  const step = steps[i] || {};
  const lines = code.split("\n");

  const accumulatedOutput = steps
    .slice(0, i + 1)
    .map((s) => s.output)
    .filter(Boolean)
    .join("\n");

  return (
    <div className="border border-default rounded-lg overflow-hidden my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-default surface-subtle">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold fg-subtle">
            Trace
          </span>
          <span className="text-[11px] fg-muted font-mono">
            step {i + 1} / {steps.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Btn onClick={() => { setPlaying(false); setI(Math.max(0, i - 1)); }} aria-label="Previous">‹</Btn>
          <Btn onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
            {playing ? "❚❚" : "▶"}
          </Btn>
          <Btn onClick={() => { setPlaying(false); setI(Math.min(steps.length - 1, i + 1)); }} aria-label="Next">›</Btn>
          <Btn onClick={() => { setPlaying(false); setI(0); }} aria-label="Restart">↺</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Code panel with highlighted active line */}
        <div className="border-b md:border-b-0 md:border-r border-default surface-subtle">
          <pre className="m-0 p-0 text-[12.5px] leading-[1.6] font-mono overflow-x-auto">
            {lines.map((ln, idx) => {
              const lineNo = idx + 1;
              const active = step.line === lineNo;
              return (
                <div
                  key={idx}
                  className={`px-4 py-[1px] flex gap-3 ${
                    active ? "bg-(--bg-muted)" : ""
                  }`}
                >
                  <span className="fg-subtle select-none w-6 text-right">
                    {lineNo}
                  </span>
                  <span className={active ? "fg font-medium" : "fg-muted"}>
                    {ln || " "}
                  </span>
                </div>
              );
            })}
          </pre>
          {step.note && (
            <div className="px-4 py-3 border-t border-default text-[12px] fg-muted">
              {step.note}
            </div>
          )}
        </div>

        {/* State + output panel */}
        <div className="p-4 space-y-4">
          <Panel title="Variables">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {Object.entries(step.state || {}).map(([k, v]) => (
                  <motion.div
                    key={k}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.18 }}
                    className="px-2.5 py-1.5 border border-default rounded-md font-mono text-[12px]"
                  >
                    <span className="fg-subtle">{k}</span>
                    <span className="fg-subtle mx-1">=</span>
                    <span className="fg">{stringify(v)}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!Object.keys(step.state || {}).length && (
                <span className="text-[12px] fg-subtle">(empty)</span>
              )}
            </div>
          </Panel>

          <Panel title="Output">
            <pre className="m-0 text-[12px] font-mono fg-muted whitespace-pre-wrap min-h-[2rem]">
              {accumulatedOutput || <span className="fg-subtle">(no output)</span>}
            </pre>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-semibold fg-subtle mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function Btn({ children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center h-7 min-w-7 px-2 text-[11px] font-mono fg-muted hover:fg surface-hover rounded"
      {...props}
    >
      {children}
    </button>
  );
}

function stringify(v) {
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stringify).join(", ") + "]";
  if (v && typeof v === "object") {
    return (
      "{" +
      Object.entries(v)
        .map(([k, val]) => `${k}: ${stringify(val)}`)
        .join(", ") +
      "}"
    );
  }
  return String(v);
}
