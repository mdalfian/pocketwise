"use client";

import Link from "next/link";
import { deleteTransaction } from "./actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function TransactionActions({ id, type }: { id: string; type: string }) {
  return (
    <div className="flex items-center gap-2 sm:absolute sm:right-5 sm:bottom-2">
      <Link href={`/dashboard/transactions/${id}/edit`} aria-label="Edit transaksi" title="Edit transaksi" className="grid size-9 place-items-center rounded-xl border border-[#dce8d9] bg-white text-[#52754c] transition hover:-translate-y-0.5 hover:border-[#9fbd9c] hover:bg-[#e8f1e5] focus:outline-none focus:ring-2 focus:ring-[#d8f37d]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="m14 6 4 4M5 19l3.5-.7L18.8 8a2.1 2.1 0 0 0-3-3L5.5 15.3 5 19Z" /></svg>
      </Link>
      {type !== "transfer" && <AlertDialog><AlertDialogTrigger asChild><button type="button" aria-label="Hapus transaksi" title="Hapus transaksi" className="grid size-9 cursor-pointer place-items-center rounded-xl border border-[#f2d8d3] bg-white text-[#a4473c] transition hover:-translate-y-0.5 hover:border-[#e5aaa0] hover:bg-[#fff0ed] focus:outline-none focus:ring-2 focus:ring-[#f4c5bd]"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 13h8l1-13" /></svg></button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus transaksi?</AlertDialogTitle><AlertDialogDescription>Transaksi ini akan dihapus dan saldo rekening akan disesuaikan kembali.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter className="items-stretch sm:items-center"><AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel><form action={deleteTransaction} className="w-full sm:w-auto"><input type="hidden" name="id" value={id} /><AlertDialogAction asChild><PendingSubmitButton pendingLabel="Menghapus..." className="w-full sm:w-auto">Hapus transaksi</PendingSubmitButton></AlertDialogAction></form></AlertDialogFooter></AlertDialogContent></AlertDialog>}
    </div>
  );
}
