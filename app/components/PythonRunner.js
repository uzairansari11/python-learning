"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Self-contained Python practice editor.
 *
 * - Loads Pyodide lazily from CDN on first run (~10 MB, cached after).
 * - Captures stdout / stderr.
 * - Tab key inserts 4 spaces (it does not change focus).
 *
 * Props:
 *   - initialCode: string seed code shown in the editor
 *   - rows: editor height in rows (default 10)
 *   - title: optional header label (defaults to "Practice")
 */
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;

let pyodidePromise = null;

function loadPyodideOnce() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window
        .loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` })
        .then(resolve, reject);
      return;
    }
    const script = document.createElement("script");
    script.src = PYODIDE_URL;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Pyodide"));
    script.onload = () => {
      window
        .loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` })
        .then(resolve, reject);
    };
    document.head.appendChild(script);
  });
  return pyodidePromise;
}

export default function PythonRunner({ initialCode = "", rows = 10, title = "Practice" }) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState("idle"); // idle | loading | running | done | error
  const [output, setOutput] = useState("");
  const taRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const insert = "    ";
      const next = ta.value.slice(0, start) + insert + ta.value.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + insert.length;
      });
    }
  }, []);

  const run = useCallback(async () => {
    setOutput("");
    setStatus("loading");
    try {
      const pyodide = await loadPyodideOnce();
      setStatus("running");
      let buffer = "";
      pyodide.setStdout({ batched: (s) => { buffer += s + "\n"; } });
      pyodide.setStderr({ batched: (s) => { buffer += s + "\n"; } });
      try {
        await pyodide.runPythonAsync(code);
        setOutput(buffer || "(no output)");
        setStatus("done");
      } catch (err) {
        setOutput((buffer ? buffer + "\n" : "") + String(err));
        setStatus("error");
      }
    } catch (err) {
      setOutput("Failed to load Python runtime: " + String(err));
      setStatus("error");
    }
  }, [code]);

  const reset = useCallback(() => {
    setCode(initialCode);
    setOutput("");
    setStatus("idle");
  }, [initialCode]);

  // Esc clears focus to allow scrolling the page on mobile.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && document.activeElement === taRef.current) {
        taRef.current.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const statusLabel = {
    idle: "Idle",
    loading: "Loading Python…",
    running: "Running…",
    done: "Done",
    error: "Error",
  }[status];

  return (
    <div className="border border-default rounded-lg overflow-hidden my-6">
      <div className="flex items-center justify-between px-4 h-10 border-b border-default surface-subtle">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold fg-subtle">
            {title}
          </span>
          <span className="text-[11px] fg-muted">{statusLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            className="h-7 px-2 text-[11px] font-medium fg-muted hover:fg surface-hover rounded"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={run}
            disabled={status === "loading" || status === "running"}
            className="h-7 px-3 text-[11px] font-medium border border-default rounded surface-hover disabled:opacity-50"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            Run ▸
          </button>
        </div>
      </div>

      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={rows}
        className="block w-full p-4 font-mono text-[12.5px] leading-[1.65] resize-y outline-none surface fg"
        style={{ tabSize: 4 }}
      />

      <div className="border-t border-default surface-subtle">
        <div className="px-4 pt-3 text-[10px] uppercase tracking-wider font-semibold fg-subtle">
          Output
        </div>
        <pre className="m-0 px-4 pb-4 pt-2 text-[12px] font-mono fg whitespace-pre-wrap min-h-[3rem]">
          {output || <span className="fg-subtle">(run to see output)</span>}
        </pre>
      </div>
    </div>
  );
}
