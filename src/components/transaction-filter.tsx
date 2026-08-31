"use client";

import { useState } from "react";

export function TransactionFilter({ children, mobileTrigger = true }: { children: React.ReactNode; mobileTrigger?: boolean }) {
  const [open, setOpen] = useState(false);
  return <>
    {mobileTrigger && <button type="button" onClick={() => setOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#dce8d9] bg-white px-4 py-2.5 text-sm font-semibold text-[#385b32] shadow-sm transition hover:bg-[#f7faf5] sm:hidden"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M5 7h14M5 12h14M5 17h14" /><path strokeLinecap="round" d="M9 5v4m6-1v4m-4 3v4" /></svg> Filter</button>}
    <div className="hidden sm:block">{children}</div>
    {open && mobileTrigger && <div className="fixed inset-0 z-50 flex items-end bg-[#173d2b]/30 p-3 backdrop-blur-sm sm:hidden" role="dialog" aria-modal="true" aria-label="Filter transaksi"><div className="transaction-filter-sheet w-full rounded-3xl bg-white p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-lg font-semibold text-[#173d2b]">Filter transaksi</p><p className="mt-1 text-xs text-[#718076]">Atur filter sesuai kebutuhanmu.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Tutup filter" className="grid size-9 place-items-center rounded-full bg-[#f3f7f1] text-lg text-[#526057]">×</button></div>{children}</div></div>}
  </>;
}
