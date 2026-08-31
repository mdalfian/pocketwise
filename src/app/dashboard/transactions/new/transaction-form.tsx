"use client";

import Link from "next/link";
import { useState } from "react";
import { createTransaction } from "@/app/dashboard/transactions/actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";

type Category = { id: string; name: string; kind: "income" | "expense" };
type Account = { id: string; name: string; balance: number | string };

export function TransactionForm({ accounts, categories, today, returnTo }: { accounts: Account[]; categories: Category[]; today: string; returnTo?: string }) {
  const [selectedType, setSelectedType] = useState<"expense" | "income" | "transfer">("expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [resolvedReturnTo] = useState(() => {
    if (returnTo || typeof window === "undefined") return returnTo || "/dashboard";
    try {
      const path = new URL(document.referrer).pathname;
      return path.startsWith("/dashboard") && path !== "/dashboard/transactions/new" ? path : "/dashboard";
    } catch {
      return "/dashboard";
    }
  });
  const availableCategories = categories.filter((item) => item.kind === selectedType);

  return (
    <form action={createTransaction} className="space-y-5">
      <input type="hidden" name="returnTo" value={resolvedReturnTo} />
      <fieldset>
        <legend className="text-sm font-medium">Jenis transaksi</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-2xl bg-[#f7faf5] p-1">
          {(["expense", "income", "transfer"] as const).map((option) => <button key={option} type="button" onClick={() => { setSelectedType(option); setSelectedCategory(""); setToAccount(""); }} className={`rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${selectedType === option ? "bg-[#173d2b] text-white shadow-sm" : "text-[#526057] hover:bg-white"}`}>{option === "expense" ? "Pengeluaran" : option === "income" ? "Pemasukan" : "Transfer"}</button>)}
        </div>
        <input type="hidden" name="type" value={selectedType} />
      </fieldset>
      <label className="block text-sm font-medium">Jumlah (Rupiah)<input required min="1" step="1" type="number" name="amount" inputMode="numeric" placeholder="Contoh: 25000" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /><span className="mt-1.5 block text-xs font-normal text-[#718076]">Masukkan nominal tanpa titik atau koma.</span></label>
      <label className="block text-sm font-medium">Rekening sumber<select required name="accountId" value={sourceAccount} onChange={(event) => { setSourceAccount(event.target.value); setToAccount(""); }} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60"><option value="">Pilih rekening</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name} · Rp {Number(account.balance).toLocaleString("id-ID")}</option>)}</select><span className="mt-1.5 block text-xs font-normal text-[#718076]">Saldo rekening akan diperbarui setelah transaksi disimpan.</span></label>
      {selectedType !== "transfer" && <label className="block text-sm font-medium">Kategori<select required name="categorySelector" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60"><option value="">Pilih kategori</option>{availableCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input type="hidden" name="categoryId" value={selectedCategory} /></label>}
      {selectedType === "transfer" && <label className="block text-sm font-medium">Rekening tujuan<select required name="toAccountId" value={toAccount} onChange={(event) => setToAccount(event.target.value)} disabled={accounts.length < 2} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60"><option value="">Pilih rekening tujuan</option>{accounts.filter((account) => account.id !== sourceAccount).map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select><span className={`mt-1.5 block text-xs font-normal ${accounts.length < 2 ? "text-[#a4473c]" : "text-[#718076]"}`}>{accounts.length < 2 ? "Tambahkan minimal dua rekening untuk melakukan transfer." : "Saldo rekening sumber berkurang dan tujuan bertambah."}</span></label>}
      <label className="block text-sm font-medium">Keterangan <span className="font-normal text-[#9aa69d]">(opsional)</span><input name="description" placeholder="Contoh: Makan siang" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
      <label className="block text-sm font-medium">Tanggal<input required type="date" name="transactionDate" defaultValue={today} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
      {selectedType !== "transfer" && <fieldset className="rounded-2xl border border-[#dce8d9] bg-[#f7faf5] p-4"><label className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" name="recurring" value="yes" checked={recurring} onChange={(event) => setRecurring(event.target.checked)} className="size-4 accent-[#173d2b]" /> Jadikan transaksi berulang</label><p className="mt-1 pl-7 text-xs text-[#718076]">Cocok untuk gaji, sewa, langganan, atau tagihan rutin.</p>{recurring && <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Frekuensi<select name="frequency" required className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3"><option value="monthly">Setiap bulan</option><option value="weekly">Setiap minggu</option></select></label><label className="block text-sm font-medium">Transaksi berikutnya<input required type="date" name="nextRun" defaultValue={today} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3" /></label><label className="block text-sm font-medium sm:col-span-2">Berakhir <span className="font-normal text-[#9aa69d]">(opsional)</span><input type="date" name="endDate" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3" /></label></div>}</fieldset>}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><Link href="/dashboard" className="rounded-xl border border-[#dce3dc] px-5 py-3 text-center text-sm font-semibold text-[#526057] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f7faf5]">Batal</Link><PendingSubmitButton pendingLabel="Menyimpan..." className="cursor-pointer rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#24573c] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">Simpan transaksi</PendingSubmitButton></div>
    </form>
  );
}
