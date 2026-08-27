"use client";

import { useState } from "react";
import { createAccount } from "./actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";

export function AccountModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="cursor-pointer rounded-full bg-[#173d2b] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#24573c] focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">
        + Tambah rekening
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-[#173d2b]/30 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Tambah rekening">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-[#18231c]">
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#5e8a54]">Rekening baru</p><h2 className="mt-2 text-2xl font-semibold text-[#173d2b] dark:text-[#edf5ee]">Tambahkan rekening</h2></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup modal" className="grid size-9 place-items-center rounded-full bg-[#f3f7f1] text-xl text-[#526057] transition hover:bg-[#e8f1e5] dark:bg-[#24352a] dark:text-[#c9d8cc]">×</button>
            </div>
            <form action={createAccount} className="mt-6 space-y-5">
              <label className="block text-sm font-medium">Nama rekening<input required name="name" maxLength={100} placeholder="Tunai, BCA, e-wallet" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none focus:border-[#5e8a54] dark:border-[#35503b] dark:bg-[#1d2b21] dark:text-[#edf5ee]" /></label>
              <label className="block text-sm font-medium">Saldo saat ini (IDR)<input required min="0" step="1" type="number" name="balance" defaultValue="0" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none focus:border-[#5e8a54] dark:border-[#35503b] dark:bg-[#1d2b21] dark:text-[#edf5ee]" /></label>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-xl border border-[#dce3dc] px-5 py-3 text-sm font-semibold text-[#526057] dark:border-[#35503b] dark:text-[#c9d8cc]">Batal</button><PendingSubmitButton pendingLabel="Menyimpan..." className="cursor-pointer rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#24573c]">Simpan rekening</PendingSubmitButton></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
