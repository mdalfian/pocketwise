import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardBackLink } from "@/components/dashboard-back-link";

type SearchParams = Promise<{ month?: string }>;
type Relation = { name: string } | { name: string }[] | null;

function relationName(relation: Relation) {
  return Array.isArray(relation) ? relation[0]?.name ?? "Tanpa kategori" : relation?.name ?? "Tanpa kategori";
}

const money = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const now = new Date();
  const selected = /^\d{4}-\d{2}$/.test(params.month ?? "") ? params.month! : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [year, month] = selected.split("-").map(Number);
  const start = `${selected}-01`;
  const endDate = new Date(year, month, 0);
  const end = `${selected}-${String(endDate.getDate()).padStart(2, "0")}`;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: transactions } = await supabase.from("transactions").select("id, type, amount, description, transaction_date, categories(name)").eq("user_id", user.id).gte("transaction_date", start).lte("transaction_date", end).order("transaction_date", { ascending: false });
  const income = transactions?.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;
  const expense = transactions?.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;
  const grouped = new Map<string, number>();
  transactions?.filter((item) => item.type === "expense").forEach((item) => { const name = relationName(item.categories as Relation); grouped.set(name, (grouped.get(name) ?? 0) + Number(item.amount)); });
  const categories = [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    return <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-5xl"><DashboardBackLink /><header className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Analitik</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Laporan keuangan</h1><p className="mt-2 text-sm text-[#718076]">Lihat ringkasan cashflow berdasarkan bulan.</p></div><form><label className="block text-sm font-semibold text-[#526057]">Pilih bulan<input type="month" name="month" defaultValue={selected} className="mt-2 rounded-xl border border-[#dce3dc] bg-white px-4 py-3 text-sm" /></label></form></header><section className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-3xl bg-[#eef8ee] p-5"><p className="text-sm text-[#52754c]">Pemasukan</p><p className="mt-2 text-xl font-semibold text-[#28703d]">{money(income)}</p></div><div className="rounded-3xl bg-[#fff1ee] p-5"><p className="text-sm text-[#a4473c]">Pengeluaran</p><p className="mt-2 text-xl font-semibold text-[#a4473c]">{money(expense)}</p></div><div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm text-[#718076]">Cashflow bersih</p><p className={`mt-2 text-xl font-semibold ${income - expense >= 0 ? "text-[#28703d]" : "text-[#a4473c]"}`}>{money(income - expense)}</p></div></section><section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]"><div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#6a9a5f]">Periode</p><h2 className="mt-2 text-2xl font-semibold capitalize">{monthLabel}</h2><p className="mt-3 text-sm text-[#718076]">{transactions?.length ?? 0} transaksi tercatat bulan ini.</p></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Pengeluaran berdasarkan kategori</h2><div className="mt-5 space-y-4">{categories.length ? categories.map(([name, amount]) => <div key={name}><div className="flex justify-between gap-4 text-sm"><span className="font-medium">{name}</span><span className="font-semibold">{money(amount)}</span></div><div className="mt-2 h-2 rounded-full bg-[#eef2ed]"><div className="h-2 rounded-full bg-[#c25a4b]" style={{ width: `${Math.max((amount / expense) * 100, 4)}%` }} /></div></div>) : <p className="text-sm text-[#718076]">Belum ada pengeluaran pada bulan ini.</p>}</div></div></section></div></main>;
}
