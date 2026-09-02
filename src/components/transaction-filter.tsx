"use client";

import { useState } from "react";

export function TransactionFilter({ children, mobileTrigger = true, activeCount = 0 }: { children: React.ReactNode; mobileTrigger?: boolean; activeCount?: number }) {
  const [open, setOpen] = useState(false);
  return <>
    {mobileTrigger && <button type="button" onClick={() => setOpen(true)} aria-pressed={activeCount > 0} className={`mt-0 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 sm:hidden ${activeCount ? "border-[#6a9a5f] bg-[#e8f6e8] text-[#2f5b38] shadow-[0_0_0_3px_rgba(106,154,95,0.12)] dark:border-[#6f9b72] dark:bg-[#23432d] dark:text-[#d9eadb] dark:shadow-[0_0_0_3px_rgba(111,155,114,0.18)]" : "border-[#dce8d9] bg-white text-[#385b32] shadow-sm hover:bg-[#f7faf5] dark:border-[#35503b] dark:bg-[#18231c] dark:text-[#b9d9b7] dark:hover:bg-[#223327]"}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M5 7h14M5 12h14M5 17h14" /><path strokeLinecap="round" d="M9 5v4m6-1v4m-4 3v4" /></svg> Filter</button>}
    <div className="hidden sm:block">{children}</div>
    {open && mobileTrigger && <div className="fixed inset-0 z-50 flex items-end bg-[#173d2b]/30 p-3 backdrop-blur-sm sm:hidden" role="dialog" aria-modal="true" aria-label="Filter transaksi"><div className="transaction-filter-sheet w-full rounded-3xl bg-white p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-lg font-semibold text-[#173d2b]">Filter transaksi</p><p className="mt-1 text-xs text-[#718076]">Atur filter sesuai kebutuhanmu.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Tutup filter" className="grid size-9 place-items-center rounded-full bg-[#f3f7f1] text-lg text-[#526057]">×</button></div>{children}</div></div>}
  </>;
}
