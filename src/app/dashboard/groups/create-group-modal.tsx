"use client";

import { useState } from "react";
import { createGroup } from "./actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";

export function CreateGroupModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-xl bg-[#173d2b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#24573c] focus:outline-none focus:ring-2 focus:ring-[#d8f37d]">
        + Buat grup
      </button>
      {open && <div className="fixed inset-0 z-50 flex items-end bg-[#173d2b]/30 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="create-group-title">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#5e8a54]">Grup baru</p><h2 id="create-group-title" className="mt-2 text-2xl font-semibold text-[#173d2b]">Buat grup transaksi</h2><p className="mt-2 text-sm text-[#718076]">Contoh: Trip Semarang atau renovasi rumah.</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup modal" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f3f7f1] text-xl text-[#526057] transition duration-200 hover:rotate-90 hover:bg-[#e8f1e5]">×</button>
          </div>
          <form action={createGroup} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Nama grup<input required name="name" maxLength={100} placeholder="Contoh: Trip Semarang" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
            <label className="block text-sm font-medium">Deskripsi <span className="font-normal text-[#9aa69d]">(opsional)</span><textarea name="description" rows={2} maxLength={240} placeholder="Pengeluaran selama liburan 3 hari" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Mulai<input type="date" name="startDate" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><label className="block text-sm font-medium">Selesai<input type="date" name="endDate" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label></div>
            <label className="block text-sm font-medium">Warna<input type="color" name="color" defaultValue="#6a9a5f" className="mt-2 h-12 w-full rounded-xl border border-[#dce3dc] bg-white p-1" /></label>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-xl border border-[#dce3dc] px-5 py-3 text-sm font-semibold text-[#526057] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f7faf5] focus:outline-none focus:ring-2 focus:ring-[#d8f37d]">Batal</button><PendingSubmitButton pendingLabel="Menyimpan..." className="cursor-pointer rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#24573c] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">Simpan grup</PendingSubmitButton></div>
          </form>
        </div>
      </div>}
    </>
  );
}
