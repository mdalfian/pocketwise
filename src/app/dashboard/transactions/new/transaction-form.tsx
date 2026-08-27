"use client";

import Link from "next/link";
import { useState } from "react";
import { createTransaction } from "@/app/dashboard/transactions/actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";

type Category = { id: string; name: string; kind: "income" | "expense" };
type Account = { id: string; name: string; balance: number | string };

export function TransactionForm({ accounts, categories, today }: { accounts: Account[]; categories: Category[]; today: string }) {
  const [selected, setSelected] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const category = categories.find((item) => item.id === selected);
  const type = category?.kind ?? (selected === "transfer" ? "transfer" : "");

  return (
    <form action={createTransaction} className="space-y-5">
      <label className="block text-sm font-medium">Rekening<select required name="accountId" value={sourceAccount} onChange={(event) => { setSourceAccount(event.target.value); setToAccount(""); }} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60"><option value="">Pilih rekening</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name} · Rp {Number(account.balance).toLocaleString("id-ID")}</option>)}</select></label>
      <label className="block text-sm font-medium">Kategori<select required name="categorySelector" value={selected} onChange={(event) => setSelected(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60"><option value="">Pilih kategori terlebih dahulu</option>{categories.filter((item) => item.kind === "expense").map((item) => <option key={item.id} value={item.id}>{item.name} · Pengeluaran</option>)}{categories.filter((item) => item.kind === "income").map((item) => <option key={item.id} value={item.id}>{item.name} · Pemasukan</option>)}<option value="transfer">Transfer antar rekening</option></select><input type="hidden" name="categoryId" value={selected === "transfer" ? "" : selected} /></label>
      {selected === "transfer" && <label className="block text-sm font-medium">Rekening tujuan<select required name="toAccountId" value={toAccount} onChange={(event) => setToAccount(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60"><option value="">Pilih rekening tujuan</option>{accounts.filter((account) => account.id !== sourceAccount).map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select>{accounts.length < 2 && <span className="mt-2 block text-xs font-normal text-[#a4473c]">Tambahkan minimal dua rekening untuk melakukan transfer.</span>}</label>}
      <input type="hidden" name="type" value={type} />
      <label className="block text-sm font-medium">Jumlah (IDR)<input required min="1" step="1" type="number" name="amount" placeholder="25000" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
      <label className="block text-sm font-medium">Keterangan <span className="font-normal text-[#9aa69d]">(opsional)</span><input name="description" placeholder="Contoh: Makan siang" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
      <label className="block text-sm font-medium">Tanggal<input required type="date" name="transactionDate" defaultValue={today} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3 outline-none transition focus:border-[#5e8a54] focus:ring-2 focus:ring-[#d8f37d]/60" /></label>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><Link href="/dashboard" className="rounded-xl border border-[#dce3dc] px-5 py-3 text-center text-sm font-semibold text-[#526057] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f7faf5]">Batal</Link><PendingSubmitButton pendingLabel="Menyimpan..." className="cursor-pointer rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#24573c] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">Simpan transaksi</PendingSubmitButton></div>
    </form>
  );
}
