"use client";

import dynamic from "next/dynamic";

/**
 * Pyodide is large (~10 MB on first run) and only matters once the user
 * actually scrolls a runner into view. next/dynamic with ssr:false also keeps
 * Pyodide out of the SSR bundle and out of the initial JS payload.
 */
const PythonRunner = dynamic(() => import("./PythonRunner"), {
  ssr: false,
  loading: () => (
    <div className="border border-(--border) rounded-lg my-6 p-6 text-sm text-(--fg-muted)">
      Loading editor…
    </div>
  ),
});

export default PythonRunner;
