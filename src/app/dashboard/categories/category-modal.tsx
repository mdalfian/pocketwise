"use client";

import { useState } from "react";
import { createCategory } from "./actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";

export function CategoryModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="cursor-pointer rounded-xl bg-[#173d2b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#24573c] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">+ Tambah kategori</button>
      {open && <div className="fixed inset-0 z-50 flex items-end bg-[#173d2b]/30 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Tambah kategori">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#5e8a54]">Kategori baru</p><h2 className="mt-2 text-2xl font-semibold text-[#173d2b]">Tambah kategori</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Tutup modal" className="grid size-9 place-items-center rounded-full bg-[#f3f7f1] text-xl text-[#526057] transition duration-200 hover:rotate-90 hover:bg-[#e8f1e5]">x</button></div>
          <form action={createCategory} className="mt-6 space-y-4"><label className="block text-sm font-medium">Nama kategori<input required name="name" maxLength={80} placeholder="Contoh: Kopi" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label><label className="block text-sm font-medium">Jenis<select name="kind" defaultValue="expense" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3"><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label><div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-xl border border-[#dce3dc] px-5 py-3 text-sm font-semibold text-[#526057] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f7faf5] focus:outline-none focus:ring-2 focus:ring-[#d8f37d]">Batal</button><PendingSubmitButton pendingLabel="Menyimpan..." className="cursor-pointer rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#24573c] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">Simpan kategori</PendingSubmitButton></div></form>
        </div>
      </div>}
    </>
  );
}
