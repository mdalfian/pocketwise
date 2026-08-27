import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardBackLink } from "@/components/dashboard-back-link";
import { FormAlert } from "@/components/form-alert";
import { saveBudget, deleteBudget } from "./actions";

export default async function BudgetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthStart = `${month}-01`;
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthStart = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}-01`;
  const [{ data: categories }, { data: budgets }, { data: transactions }] = await Promise.all([
    supabase.from("categories").select("id, name").eq("user_id", user.id).eq("kind", "expense").order("name"),
    supabase.from("category_budgets").select("id, category_id, amount").eq("user_id", user.id).eq("month", monthStart),
    supabase.from("transactions").select("category_id, amount").eq("user_id", user.id).eq("type", "expense").gte("transaction_date", monthStart).lt("transaction_date", nextMonthStart),
  ]);
  const money = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;
  const spent = (categoryId: string) => (transactions ?? []).filter((item) => item.category_id === categoryId).reduce((sum, item) => sum + Number(item.amount), 0);
  return <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-4xl"><DashboardBackLink /><header className="mt-8"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Perencanaan</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Budget bulanan</h1><p className="mt-2 text-sm text-[#718076]">Atur batas pengeluaran per kategori untuk {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}.</p></header><div className="mt-6"><FormAlert /></div><section className="mt-8 rounded-3xl border border-[#dce8d9] bg-white p-5 shadow-sm sm:p-7"><h2 className="text-lg font-semibold text-[#173d2b]">Tambah atau ubah budget</h2><form action={saveBudget} className="mt-5 grid gap-3 sm:grid-cols-[1fr_10rem_10rem_auto] sm:items-end"><label className="text-sm font-medium">Kategori<select required name="categoryId" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-3 py-2.5"><option value="">Pilih kategori</option>{categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="text-sm font-medium">Bulan<input required type="month" name="month" defaultValue={month} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-3 py-2.5" /></label><label className="text-sm font-medium">Budget<input required type="number" name="amount" min="1" placeholder="500000" className="mt-2 w-full rounded-xl border border-[#dce3dc] px-3 py-2.5" /></label><button className="rounded-xl bg-[#173d2b] px-4 py-2.5 text-sm font-semibold text-white">Simpan</button></form></section><section className="mt-5 space-y-3">{budgets?.length ? budgets.map((budget) => { const category = categories?.find((item) => item.id === budget.category_id); const used = spent(budget.category_id); const percent = Math.min((used / Number(budget.amount)) * 100, 100); return <article key={budget.id} className="rounded-3xl border border-[#e1e9df] bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">{category?.name ?? "Kategori"}</h2><p className="mt-1 text-sm text-[#718076]">Terpakai {money(used)} dari {money(Number(budget.amount))}</p></div><form action={deleteBudget}><input type="hidden" name="id" value={budget.id} /><button className="text-sm font-semibold text-[#a4473c]">Hapus</button></form></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-[#edf1ed]"><div className={`h-full rounded-full ${used > Number(budget.amount) ? "bg-[#c25a4b]" : "bg-[#6a9a5f]"}`} style={{ width: `${percent}%` }} /></div><p className="mt-2 text-xs text-[#718076]">{Math.round((used / Number(budget.amount)) * 100)}% terpakai</p></article>; }) : <div className="rounded-3xl border border-dashed border-[#cbdac8] p-10 text-center text-sm text-[#718076]">Belum ada budget bulan ini.</div>}</section><Link href="/dashboard" className="mt-6 inline-block text-sm font-semibold text-[#385b32]">← Kembali ke dashboard</Link></div></main>;
}
