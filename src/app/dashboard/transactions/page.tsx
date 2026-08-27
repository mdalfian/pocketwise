import Link from "next/link";
import { DashboardBackLink } from "@/components/dashboard-back-link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TransactionFilter } from "@/components/transaction-filter";
import { FormAlert } from "@/components/form-alert";
import { TransactionActions } from "./transaction-actions";

type SearchParams = Promise<{ type?: string; account?: string; category?: string; from?: string; to?: string }>;

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string;
  transaction_date: string;
  accounts: { name: string } | { name: string }[] | null;
  categories: { name: string } | { name: string }[] | null;
};

function relationName(relation: { name: string } | { name: string }[] | null, fallback: string) {
  if (Array.isArray(relation)) return relation[0]?.name ?? fallback;
  return relation?.name ?? fallback;
}

export default async function TransactionsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: rawTransactions }, { data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("transactions").select("id, type, amount, description, transaction_date, accounts(name), categories(name)").eq("user_id", user.id).order("transaction_date", { ascending: false }).limit(100),
    supabase.from("accounts").select("id, name").eq("user_id", user.id).order("name"),
    supabase.from("categories").select("id, name, kind").eq("user_id", user.id).order("name"),
  ]);
  const transactions = (rawTransactions ?? []) as unknown as Transaction[];
  const items = transactions.filter((item) =>
    (!filters.type || filters.type === "all" || item.type === filters.type) &&
    (!filters.account || relationName(item.accounts, "Rekening") === filters.account) &&
    (!filters.category || relationName(item.categories, item.type === "transfer" ? "Transfer antar rekening" : "Tanpa kategori") === filters.category) &&
    (!filters.from || item.transaction_date >= filters.from) &&
    (!filters.to || item.transaction_date <= filters.to),
  );
  const income = items.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0);
  const format = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;
  const filterForm = (
    <form action="/dashboard/transactions" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <select name="type" defaultValue={filters.type ?? "all"} className="rounded-xl border border-[#dce3dc] bg-white px-3 py-2.5 text-sm">
        <option value="all">Semua jenis</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option><option value="transfer">Transfer</option>
      </select>
      <select name="category" defaultValue={filters.category ?? ""} className="rounded-xl border border-[#dce3dc] bg-white px-3 py-2.5 text-sm">
        <option value="">Semua kategori</option>{categories?.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
      </select>
      <select name="account" defaultValue={filters.account ?? ""} className="rounded-xl border border-[#dce3dc] bg-white px-3 py-2.5 text-sm">
        <option value="">Semua rekening</option>{accounts?.map((account) => <option key={account.id} value={account.name}>{account.name}</option>)}
      </select>
      <input type="date" name="from" defaultValue={filters.from} aria-label="Tanggal mulai" className="rounded-xl border border-[#dce3dc] px-3 py-2.5 text-sm" />
      <input type="date" name="to" defaultValue={filters.to} aria-label="Tanggal akhir" className="rounded-xl border border-[#dce3dc] px-3 py-2.5 text-sm" />
      <button type="submit" className="cursor-pointer rounded-xl bg-[#173d2b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#24573c] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2">Terapkan filter</button>
    </form>
  );

  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <DashboardBackLink />
        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Riwayat keuangan</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Semua transaksi</h1><p className="mt-2 text-sm text-[#718076]">Temukan dan pahami setiap pergerakan uangmu.</p></div>
          <Link href="/dashboard/transactions/new" className="inline-flex w-full items-center justify-center rounded-xl bg-[#173d2b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#24573c] sm:w-auto">+ Catat transaksi</Link>
        </header>
        <div className="mt-8 rounded-2xl border-0 bg-transparent p-0 shadow-none sm:border sm:border-[#dce8d9] sm:bg-white sm:p-5 sm:shadow-sm"><div className="mb-3 hidden text-sm font-semibold text-[#173d2b] sm:block">Filter transaksi</div><TransactionFilter>{filterForm}</TransactionFilter></div>
        <div className="mt-4"><FormAlert /></div><div className="flex items-center justify-between text-sm text-[#718076]"><span>Menampilkan {items.length} transaksi</span><span className="hidden sm:inline">{format(income)} masuk - {format(expense)} keluar</span></div>
        <section className="mt-4 overflow-hidden rounded-3xl border border-[#e1e9df] bg-white shadow-sm">
           {items.length ? items.map((transaction) => <article key={transaction.id} className="relative border-b border-[#edf1ed] p-4 last:border-0 hover:bg-[#f7faf5] sm:grid sm:grid-cols-[1fr_10rem_8rem] sm:items-center sm:gap-3 sm:p-5 sm:pr-24"><div className="flex min-w-0 items-start gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded-xl text-base ${transaction.type === "income" ? "bg-[#e8f6e8] text-[#3d8b53]" : "bg-[#fff0ed] text-[#c25a4b]"}`}>{transaction.type === "income" ? "+" : "-"}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><p className="truncate font-semibold">{transaction.description}</p><p className={`shrink-0 text-sm font-semibold sm:hidden ${transaction.type === "income" ? "text-[#3d8b53]" : "text-[#c25a4b]"}`}>{transaction.type === "income" ? "+" : "-"}{format(Number(transaction.amount))}</p></div><p className="mt-1 truncate text-xs text-[#718076]">{relationName(transaction.accounts, "Rekening")} - {relationName(transaction.categories, transaction.type === "transfer" ? "Transfer antar rekening" : "Tanpa kategori")}</p><div className="mt-2 flex items-center justify-between"><p className="text-xs text-[#718076]">{new Date(`${transaction.transaction_date}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p><TransactionActions id={transaction.id} type={transaction.type} /></div></div></div><p className="hidden text-sm text-[#718076] sm:block">{new Date(`${transaction.transaction_date}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p><p className={`hidden text-right font-semibold sm:block ${transaction.type === "income" ? "text-[#3d8b53]" : "text-[#c25a4b]"}`}>{transaction.type === "income" ? "+" : "-"} {format(Number(transaction.amount))}</p></article>) : <div className="p-10 text-center text-sm text-[#718076]">Tidak ada transaksi yang cocok.</div>}
        </section>
      </div>
    </main>
  );
}
