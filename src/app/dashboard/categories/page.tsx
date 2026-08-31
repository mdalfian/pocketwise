import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardBackLink } from "@/components/dashboard-back-link";
import { FormAlert } from "@/components/form-alert";
import { createClient } from "@/lib/supabase/server";
import { CategoryModal } from "./category-modal";
import { CategoryActions } from "./category-actions";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10);
  const [{ data: categories }, { data: budgets }, { data: transactions }] = await Promise.all([
    supabase.from("categories").select("id, name, kind").eq("user_id", user.id).order("kind").order("name"),
    supabase.from("category_budgets").select("category_id, amount").eq("user_id", user.id).eq("month", month),
    supabase.from("transactions").select("category_id, amount").eq("user_id", user.id).eq("type", "expense").gte("transaction_date", month).lt("transaction_date", nextMonth),
  ]);

  const categoryItems = (categories ?? []).map((category) => {
    const budget = budgets?.find((item) => item.category_id === category.id)?.amount ?? null;
    const spent = (transactions ?? []).filter((item) => item.category_id === category.id).reduce((sum, item) => sum + Number(item.amount), 0);
    const ratio = budget ? spent / Number(budget) : 0;
    return { ...category, budget, spent, ratio };
  });
  const money = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <DashboardBackLink />
        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Pengaturan</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Kelola kategori</h1>
            <p className="mt-2 text-sm text-[#718076]">Atur kategori agar pencatatan transaksi lebih rapi.</p>
          </div>
          <CategoryModal />
        </header>
        <div className="mt-6"><Suspense fallback={null}><FormAlert /></Suspense></div>
        <section className="mt-8 rounded-3xl border border-[#dce8d9] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-semibold text-[#173d2b]">Kategori kamu</h2><p className="mt-1 text-sm text-[#718076]">{categoryItems.length} kategori tersedia</p></div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryItems.length === 0 ? <div className="rounded-2xl border border-dashed border-[#cbdac8] p-8 text-center sm:col-span-2 lg:col-span-3"><p className="font-semibold text-[#173d2b]">Belum ada kategori</p><p className="mt-2 text-sm text-[#718076]">Buat kategori agar setiap transaksi lebih mudah dipahami.</p><div className="mt-4"><CategoryModal /></div></div> : categoryItems.map((category) => {
              const percentage = Math.round(category.ratio * 100);
              const progressWidth = Math.min(percentage, 100);
              const status = category.ratio > 1 ? "Melebihi budget" : category.ratio >= 0.8 ? "Hampir mencapai batas" : "Dalam batas aman";
              const statusClass = category.ratio > 1 ? "text-[#a4473c]" : category.ratio >= 0.8 ? "text-[#a87522]" : "text-[#52754c]";
              const barClass = category.ratio > 1 ? "bg-[#c25a4b]" : category.ratio >= 0.8 ? "bg-[#d39a32]" : "bg-[#6a9a5f]";
              return (
                <div key={category.id} className="rounded-2xl border border-[#edf1ed] bg-[#f7faf5] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="font-medium">{category.name}</p><p className="mt-1 text-xs text-[#718076]">{category.kind === "income" ? "Pemasukan" : "Pengeluaran"}</p></div>
                    <span className={`grid size-9 place-items-center rounded-xl text-sm ${category.kind === "income" ? "bg-[#e8f6e8] text-[#3d8b53]" : "bg-[#fff0ed] text-[#c25a4b]"}`}>{category.kind === "income" ? "+" : "-"}</span>
                  </div>
                  {category.kind === "expense" && <div className="mt-3"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-[#52754c]">{category.budget ? `Budget ${money(Number(category.budget))}` : "Budget belum diatur"}</span>{category.budget && <span className={`font-bold ${statusClass}`}>{percentage}%</span>}</div>{category.budget && <><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5ece3]"><div className={`h-full rounded-full transition-all ${barClass}`} style={{ width: `${progressWidth}%` }} /></div><p className={`mt-1.5 text-[11px] font-semibold ${statusClass}`}>{status} · Terpakai {money(category.spent)}</p></>}</div>}
                  <div className="mt-3 border-t border-[#e6eee4] pt-2"><CategoryActions category={category} /></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
