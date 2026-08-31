import { DashboardBackLink } from "@/components/dashboard-back-link";
import { AccountActions } from "./account-actions";
import { AccountModal } from "./account-modal";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: accounts } = await supabase.from("accounts").select("id, name, balance, currency").eq("user_id", user.id).order("created_at");

  return <main className="min-h-screen bg-[#f7f8f5] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-5xl"><DashboardBackLink /><header className="mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Rekening</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Tempat uangmu tersimpan</h1></div><AccountModal /></header><section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{accounts?.length ? accounts.map((account) => <article key={account.id} className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><p className="text-sm text-[#718076]">{account.currency}</p><h2 className="mt-8 font-semibold">{account.name}</h2><p className="mt-3 text-2xl font-semibold">Rp {Number(account.balance).toLocaleString("id-ID")}</p><p className="mt-3 break-all text-xs text-[#9aa69c]">ID: {account.id}</p><AccountActions account={account} /></article>) : <div className="rounded-3xl border border-dashed border-[#cbdac8] bg-white p-10 text-center sm:col-span-2 lg:col-span-3"><p className="text-lg font-semibold text-[#173d2b]">Belum ada rekening</p><p className="mx-auto mt-2 max-w-md text-sm text-[#718076]">Tambahkan rekening pertama agar kamu bisa mulai mencatat transaksi dan memantau saldo.</p><div className="mt-5"><AccountModal /></div></div>}</section></div></main>;
}
