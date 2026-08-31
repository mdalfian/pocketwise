"use client";

import { useEffect, useState } from "react";

export function PwaSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("pocketwise-splash-seen") === "1") return;
      window.sessionStorage.setItem("pocketwise-splash-seen", "1");
    } catch {
      // Continue showing the splash when storage is unavailable.
    }
    const showTimer = window.setTimeout(() => setVisible(true), 0);
    const hideTimer = window.setTimeout(() => setVisible(false), 650);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pwa-splash fixed inset-0 z-[10000] grid place-items-center overflow-hidden bg-[#f3f7f1] transition-opacity">
      <div className="pwa-splash-orb pwa-splash-orb-one" />
      <div className="pwa-splash-orb pwa-splash-orb-two" />
      <div className="relative flex flex-col items-center">
        <div className="pwa-splash-mark mb-6 grid size-24 place-items-center rounded-[2rem] bg-[#173d2b] text-[#d8f37d] shadow-2xl shadow-[#173d2b]/25">
          <svg viewBox="0 0 24 24" className="size-11 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3 16.5v-9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h13.5A2.5 2.5 0 0 1 19 10.5V12h-3.5a2 2 0 0 1 0-4H19M15.5 10h.01" /></svg>
        </div>
        <span className="text-2xl font-semibold tracking-[-0.04em] text-[#173d2b]">pocketwise</span>
        <span className="mt-2 text-sm text-[#718076]">Keuangan lebih jelas.</span>
        <span className="pwa-splash-loader mt-7 h-1 w-16 overflow-hidden rounded-full bg-[#dce8d9]"><span className="block h-full w-1/2 rounded-full bg-[#6a9a5f]" /></span>
      </div>
    </div>
  );
}
