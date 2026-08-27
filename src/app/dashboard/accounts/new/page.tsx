import Link from "next/link";
import { Suspense } from "react";
import { createAccount } from "@/app/dashboard/accounts/actions";
import { FormAlert } from "@/components/form-alert";

export default function NewAccountPage() {
  return <main className="min-h-screen bg-[#f7f8f5] px-6 py-8 text-[#17211b] lg:px-10"><div className="mx-auto max-w-2xl"><Link href="/dashboard/accounts" className="text-sm font-medium">← Kembali ke rekening</Link><div className="mt-10 rounded-3xl bg-white p-8 shadow-sm"><Suspense fallback={null}><FormAlert /></Suspense><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Rekening baru</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Tambahkan rekening</h1><form action={createAccount} className="mt-8 space-y-5"><label className="block text-sm font-medium">Nama rekening<input required name="name" placeholder="Tunai, BCA, e-wallet" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><label className="block text-sm font-medium">Saldo saat ini (IDR)<input required min="0" step="1" type="number" name="balance" defaultValue="0" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><button type="submit" className="w-full rounded-xl bg-[#173d2b] py-3.5 font-semibold text-white">Simpan rekening</button></form></div></div></main>;
}
