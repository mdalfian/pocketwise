"use client";
import { useState } from "react";
import { deleteCategory, updateCategory } from "./actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type Category = { id: string; name: string; kind: string; budget?: number | null };

function formatRupiah(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("id-ID") : "";
}

export function CategoryActions({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState(category.kind);
  const [budget, setBudget] = useState(category.budget ? String(category.budget) : "");
  return <div className="flex items-center gap-2">
    <button type="button" onClick={() => { setKind(category.kind); setBudget(category.budget ? String(category.budget) : ""); setOpen(true); }} aria-label={`Edit ${category.name}`} title="Edit kategori" className="grid size-9 place-items-center rounded-xl border border-[#dce8d9] bg-white text-[#52754c]">✎</button>
    <AlertDialog><AlertDialogTrigger asChild><button type="button" aria-label={`Hapus ${category.name}`} title="Hapus kategori" className="grid size-9 place-items-center rounded-xl border border-[#f2d8d3] bg-white text-[#a4473c]"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 13h8l1-13" /></svg></button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus kategori?</AlertDialogTitle><AlertDialogDescription>Kategori <strong>{category.name}</strong> akan dihapus. Transaksi lama tetap aman.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel><form action={deleteCategory} className="w-full sm:w-auto"><input type="hidden" name="id" value={category.id} /><AlertDialogAction asChild><PendingSubmitButton pendingLabel="Menghapus..." className="w-full">Hapus kategori</PendingSubmitButton></AlertDialogAction></form></AlertDialogFooter></AlertDialogContent></AlertDialog>
    {open && <div className="fixed inset-0 z-50 flex items-end bg-[#173d2b]/40 p-4 backdrop-blur-md sm:items-center sm:justify-center"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h2 className="text-2xl font-semibold text-[#173d2b]">Edit kategori</h2><form action={updateCategory} className="mt-6 space-y-4"><input type="hidden" name="id" value={category.id} /><label className="block text-sm font-medium">Nama kategori<input required name="name" defaultValue={category.name} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><label className="block text-sm font-medium">Jenis<select name="kind" value={kind} onChange={(event) => setKind(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3"><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label>{kind === "expense" && <label className="block text-sm font-medium">Budget bulan ini<input inputMode="numeric" value={formatRupiah(budget)} onChange={(event) => setBudget(event.target.value)} placeholder="Contoh: 500.000" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /><input type="hidden" name="budget" value={budget.replace(/\D/g, "")} /><span className="mt-1 block text-xs text-[#718076]">Kosongkan jika tidak memakai budget.</span></label>}<div className="flex gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-5 py-3">Batal</button><PendingSubmitButton pendingLabel="Menyimpan..." className="rounded-xl bg-[#173d2b] px-5 py-3 text-white">Simpan</PendingSubmitButton></div></form></div></div>}
  </div>;
}
