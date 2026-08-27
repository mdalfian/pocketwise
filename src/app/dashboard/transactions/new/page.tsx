import { DashboardBackLink } from "@/components/dashboard-back-link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FormAlert } from "@/components/form-alert";
import { createClient } from "@/lib/supabase/server";
import { TransactionForm } from "./transaction-form";

export default async function NewTransactionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("accounts").select("id, name, balance, currency").eq("user_id", user.id).order("name"),
    supabase.from("categories").select("id, name, kind").eq("user_id", user.id).order("name"),
  ]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-xl">
        <DashboardBackLink />
        <section className="mt-6 rounded-3xl border border-[#dce8d9] bg-white p-5 shadow-sm sm:mt-8 sm:p-8">
          <div className="border-b border-[#edf1ed] pb-6">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Transaksi baru</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Catat pergerakan uang</h1>
            <p className="mt-3 text-sm leading-6 text-[#718076]">Tambahkan transaksi agar kondisi keuanganmu tetap rapi.</p>
          </div>
          <div className="pt-6"><Suspense fallback={null}><FormAlert /></Suspense></div>
          {accounts?.length ? <TransactionForm accounts={accounts} categories={categories ?? []} today={today} /> : <p className="pt-6 text-sm text-[#718076]">Buat rekening terlebih dahulu sebelum mencatat transaksi.</p>}
        </section>
      </div>
    </main>
  );
}
