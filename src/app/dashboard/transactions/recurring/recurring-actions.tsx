"use client";

import { deleteRecurring, toggleRecurring } from "./actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function Icon({ type }: { type: "pause" | "play" | "trash" }) {
  if (type === "trash") return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 13h8l1-13" /></svg>;
  if (type === "play") return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="m8 5 11 7-11 7V5Z" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M8 5v14M16 5v14" /></svg>;
}

const buttonClass = "grid size-9 place-items-center rounded-xl border transition focus:outline-none focus:ring-2";

export function RecurringActions({ id, active }: { id: string; active: boolean }) {
  const action = active ? "Nonaktifkan" : "Aktifkan";
  return (
    <div className="flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button" aria-label={`${action} transaksi berulang`} title={action} className={`${buttonClass} border-[#dce8d9] text-[#52754c] hover:bg-[#e8f1e5] focus:ring-[#d8f37d]`}><Icon type={active ? "pause" : "play"} /></button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{action} transaksi berulang?</AlertDialogTitle>
            <AlertDialogDescription>{active ? "Jadwal ini tidak akan membuat transaksi baru sampai diaktifkan kembali." : "Jadwal ini akan kembali membuat transaksi otomatis sesuai pengaturannya."}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="items-stretch sm:items-center">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <form action={toggleRecurring} className="w-full sm:w-auto">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="active" value={String(!active)} />
              <AlertDialogAction asChild><PendingSubmitButton pendingLabel="Menyimpan..." className="w-full sm:w-auto">{action}</PendingSubmitButton></AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button" aria-label="Hapus transaksi berulang" title="Hapus transaksi berulang" className={`${buttonClass} border-[#f2d8d3] text-[#a4473c] hover:bg-[#fff0ed] focus:ring-[#f2b8ae]`}><Icon type="trash" /></button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus transaksi berulang?</AlertDialogTitle>
            <AlertDialogDescription>Jadwal ini akan dihapus permanen dan tidak akan membuat transaksi otomatis lagi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="items-stretch sm:items-center">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <form action={deleteRecurring} className="w-full sm:w-auto">
              <input type="hidden" name="id" value={id} />
              <AlertDialogAction asChild><PendingSubmitButton pendingLabel="Menghapus..." className="w-full sm:w-auto">Hapus transaksi</PendingSubmitButton></AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
