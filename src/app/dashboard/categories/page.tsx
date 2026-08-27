import { DashboardBackLink } from "@/components/dashboard-back-link";
import { redirect } from "next/navigation";
import { CategoryModal } from "./category-modal";
import { CategoryActions } from "./category-actions";
import { createClient } from "@/lib/supabase/server";
import { FormAlert } from "@/components/form-alert";
import { Suspense } from "react";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: categories } = await supabase.from("categories").select("id, name, kind").eq("user_id", user.id).order("kind").order("name");

  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <DashboardBackLink />
        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Pengaturan</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Kelola kategori</h1><p className="mt-2 text-sm text-[#718076]">Atur kategori agar pencatatan transaksi lebih rapi.</p></div><CategoryModal /></header>
        <div className="mt-6"><Suspense fallback={null}><FormAlert /></Suspense></div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <section className="rounded-3xl border border-[#dce8d9] bg-white p-5 shadow-sm sm:col-span-2 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-[#173d2b]">Kategori kamu</h2><p className="mt-1 text-sm text-[#718076]">{categories?.length ?? 0} kategori tersedia</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories?.map((category) => <div key={category.id} className="rounded-2xl border border-[#edf1ed] bg-[#f7faf5] px-4 py-3"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{category.name}</p><p className="mt-1 text-xs text-[#718076]">{category.kind === "income" ? "Pemasukan" : "Pengeluaran"}</p></div><span className={`grid size-9 place-items-center rounded-xl text-sm ${category.kind === "income" ? "bg-[#e8f6e8] text-[#3d8b53]" : "bg-[#fff0ed] text-[#c25a4b]"}`}>{category.kind === "income" ? "+" : "-"}</span></div><div className="mt-3 border-t border-[#e6eee4] pt-2"><CategoryActions category={category} /></div></div>)}</div></section>
        </div>
      </div>
    </main>
  );
}
