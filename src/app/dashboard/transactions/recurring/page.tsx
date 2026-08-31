import { redirect } from "next/navigation";
import { DashboardBackLink } from "@/components/dashboard-back-link";
import { createClient } from "@/lib/supabase/server";
import { RecurringActions } from "./recurring-actions";

type Relation = { name: string } | { name: string }[] | null;
type Schedule = {
  id: string;
  type: "income" | "expense";
  amount: number | string;
  description: string;
  frequency: "weekly" | "monthly";
  next_run: string;
  active: boolean;
  accounts: Relation;
  categories: Relation;
};

/* icons are rendered by the client action component */
function relationName(relation: Relation) {
  return Array.isArray(relation) ? relation[0]?.name : relation?.name;
}

export default async function RecurringPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("recurring_transactions")
    .select("id, type, amount, description, frequency, next_run, active, accounts(name), categories(name)")
    .eq("user_id", user.id)
    .order("active", { ascending: false })
    .order("next_run");

  const schedules = data as Schedule[] | null;

  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <DashboardBackLink />
        <header className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Otomatisasi</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Transaksi berulang</h1>
            <p className="mt-2 text-sm text-[#718076]">Kelola transaksi yang dibuat otomatis oleh Pocketwise.</p>
          </div>
          <a href="/dashboard/transactions/new" className="rounded-2xl bg-[#173d2b] px-5 py-3 text-center text-sm font-semibold text-white">
            + Tambah transaksi
          </a>
        </header>

        <section className="mt-8 space-y-3">
          {schedules?.length ? schedules.map((item) => {
            const account = relationName(item.accounts) ?? "Tanpa rekening";
            const category = relationName(item.categories) ?? "Tanpa kategori";
            return (
              <article key={item.id} className="rounded-2xl border border-[#dce8d9] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.description}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.active ? "bg-[#eef8ee] text-[#28703d]" : "bg-[#f1f3f0] text-[#718076]"}`}>
                        {item.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${item.type === "income" ? "text-[#28703d]" : "text-[#a4473c]"}`}>
                      {item.type === "income" ? "+" : "-"} Rp {Number(item.amount).toLocaleString("id-ID")}
                    </p>
                    <p className="mt-2 text-sm text-[#718076]">{category} · {account}</p>
                    <p className="mt-1 text-xs text-[#849187]">
                      {item.frequency === "monthly" ? "Setiap bulan" : "Setiap minggu"} · Berikutnya {new Date(`${item.next_run}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <RecurringActions id={item.id} active={item.active} />
                </div>
              </article>
            );
          }) : (
            <div className="rounded-3xl border border-dashed border-[#cbdac8] bg-white p-10 text-center">
              <h2 className="font-semibold">Belum ada transaksi berulang</h2>
              <p className="mt-2 text-sm text-[#718076]">Buat jadwal dari form tambah transaksi.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
