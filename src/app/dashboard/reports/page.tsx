import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardBackLink } from "@/components/dashboard-back-link";
import { ReportMonthFilter } from "./report-month-filter";

type SearchParams = Promise<{ month?: string }>;
type Relation = { name: string } | { name: string }[] | null;

const money = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

function relationName(relation: Relation) {
  return Array.isArray(relation) ? relation[0]?.name ?? "Tanpa kategori" : relation?.name ?? "Tanpa kategori";
}

function getSelectedMonth(value?: string) {
  const [, month] = (value ?? "").split("-").map(Number);
  if (/^\d{4}-\d{2}$/.test(value ?? "") && month >= 1 && month <= 12) return value!;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function SummaryCard({ label, amount, className, amountClassName }: { label: string; amount: number; className: string; amountClassName: string }) {
  return <div className={`rounded-3xl p-5 ${className}`}><p className="text-sm text-[#52754c]">{label}</p><p className={`mt-2 text-xl font-semibold ${amountClassName}`}>{money(amount)}</p></div>;
}

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selected = getSelectedMonth(params.month);
  const [year, month] = selected.split("-").map(Number);
  const start = `${selected}-01`;
  const end = `${selected}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: transactions } = await supabase.from("transactions").select("id, type, amount, description, transaction_date, categories(name), accounts(name)").eq("user_id", user.id).gte("transaction_date", start).lte("transaction_date", end).order("transaction_date", { ascending: false });
  const income = transactions?.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;
  const expense = transactions?.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;
  const grouped = new Map<string, number>();
  transactions?.filter((item) => item.type === "expense").forEach((item) => { const name = relationName(item.categories as Relation); grouped.set(name, (grouped.get(name) ?? 0) + Number(item.amount)); });
  const categories = [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <DashboardBackLink />
        <header className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Analitik</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Laporan keuangan</h1><p className="mt-2 text-sm text-[#718076]">Lihat ringkasan cashflow berdasarkan bulan.</p></div>
          <ReportMonthFilter selected={selected} />
        </header>
        <section className="mt-8 grid gap-4 sm:grid-cols-3"><SummaryCard label="Pemasukan" amount={income} className="bg-[#eef8ee]" amountClassName="text-[#28703d]" /><SummaryCard label="Pengeluaran" amount={expense} className="bg-[#fff1ee]" amountClassName="text-[#a4473c]" /><SummaryCard label="Cashflow bersih" amount={income - expense} className="bg-white shadow-sm" amountClassName={income - expense >= 0 ? "text-[#28703d]" : "text-[#a4473c]"} /></section>
        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]"><div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#6a9a5f]">Periode</p><h2 className="mt-2 text-2xl font-semibold capitalize">{monthLabel}</h2><p className="mt-3 text-sm text-[#718076]">{transactions?.length ?? 0} transaksi tercatat bulan ini.</p></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Pengeluaran berdasarkan kategori</h2><div className="mt-5 space-y-4">{categories.length ? categories.map(([name, amount]) => <div key={name}><div className="flex justify-between gap-4 text-sm"><span className="font-medium">{name}</span><span className="font-semibold">{money(amount)}</span></div><div className="mt-2 h-2 rounded-full bg-[#eef2ed]"><div className="h-2 rounded-full bg-[#c25a4b]" style={{ width: `${Math.max((amount / expense) * 100, 4)}%` }} /></div></div>) : <p className="text-sm text-[#718076]">Belum ada pengeluaran pada bulan ini.</p>}</div></div></section>
        <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#6a9a5f]">Rincian</p><h2 className="mt-2 text-xl font-semibold">Transaksi bulan ini</h2></div><span className="text-sm text-[#718076]">{transactions?.length ?? 0} transaksi</span></div><div className="mt-5 divide-y divide-[#edf1ec]">{transactions?.length ? transactions.map((item) => { const isIncome = item.type === "income"; const isTransfer = item.type === "transfer"; const category = relationName(item.categories as Relation); const account = relationName(item.accounts as Relation); return <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className={`grid size-10 shrink-0 place-items-center rounded-xl text-lg ${isTransfer ? "bg-[#eef2ed] text-[#718076]" : isIncome ? "bg-[#e8f6e8] text-[#3d8b53]" : "bg-[#fff0ed] text-[#c25a4b]"}`}>{isTransfer ? "↔" : isIncome ? "+" : "−"}</span><div className="min-w-0"><p className="truncate font-medium">{item.description || (isTransfer ? "Transfer antar rekening" : category)}</p><p className="mt-1 text-xs text-[#718076]">{new Date(`${item.transaction_date}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })} · {isTransfer ? "Transfer" : category} · {account}</p></div></div><p className={`shrink-0 font-semibold ${isTransfer ? "text-[#718076]" : isIncome ? "text-[#28703d]" : "text-[#a4473c]"}`}>{isTransfer ? "" : isIncome ? "+" : "−"}{money(Number(item.amount))}</p></div> }) : <p className="py-6 text-sm text-[#718076]">Belum ada transaksi pada bulan ini.</p>}</div></section>
      </div>
    </main>
  );
}
