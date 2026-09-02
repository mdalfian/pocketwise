"use client";

import { useState } from "react";
import { saveBudget } from "./actions";
import { BudgetAmountInput } from "./budget-amount-input";

export function BudgetEditor({ categoryId, month, amount }: { categoryId: string; month: string; amount: number }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-[#385b32]">Edit</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173d2b]/40 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Edit budget">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-[#173d2b]">Edit budget</h2><button type="button" onClick={() => setOpen(false)} aria-label="Tutup modal" className="grid size-9 place-items-center rounded-full bg-[#f3f7f1] text-xl text-[#526057]">×</button></div>
        <form action={saveBudget} className="mt-6 space-y-4">
          <input type="hidden" name="categoryId" value={categoryId} /><input type="hidden" name="month" value={month} />
          <label className="block text-sm font-medium">Budget<BudgetAmountInput initialValue={amount} /></label>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[#dce3dc] px-5 py-3 text-sm font-semibold text-[#526057]">Batal</button><button className="rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white">Simpan</button></div>
        </form>
      </div>
    </div>}
  </>;
}
