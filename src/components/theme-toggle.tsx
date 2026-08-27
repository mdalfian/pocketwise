"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let savedTheme: string | null = null;
      try {
        savedTheme = window.localStorage.getItem("theme");
      } catch (error) {
        console.warn("[Pocketwise] Theme storage unavailable", error);
      }
      const shouldUseDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", shouldUseDark);
      setDark(shouldUseDark);
      console.info("[Pocketwise] Theme toggle ready", { savedTheme, dark: shouldUseDark });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    console.info("[Pocketwise] Theme changed", { dark: next });
    try {
      window.localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Some private/PWA browser contexts block localStorage; the current toggle still works.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Gunakan mode terang" : "Gunakan mode gelap"}
      title={dark ? "Mode terang" : "Mode gelap"}
      className="pointer-events-auto inline-flex size-12 touch-manipulation select-none items-center justify-center rounded-xl border border-[#dce8d9] bg-[#f7faf5] text-[#52754c] text-xl transition hover:-translate-y-0.5 hover:bg-[#e8f1e5] focus:outline-none focus:ring-2 focus:ring-[#d8f37d] active:scale-95"
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
