import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Suspense } from "react";
import { FormAlert } from "@/components/form-alert";

type MonthlyCashflow = { label: string; income: number; expense: number };
type CategorySpending = { name: string; amount: number };

const money = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

function WalletIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3 16.5v-9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h13.5A2.5 2.5 0 0 1 19 10.5V12h-3.5a2 2 0 0 1 0-4H19M15.5 10h.01" /></svg>;
}

function ProfileIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>;
}

function LogoutIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3m8 8h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-7" /></svg>;
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return <Link href={href} className="quick-access-link flex items-center justify-between rounded-xl bg-white/65 px-4 py-3 text-sm font-semibold text-[#385b32] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#173d2b]/40"><span className="flex items-center gap-3"><span className="text-[#52754c]">{icon}</span>{label}</span><ArrowIcon /></Link>;
}

function ListIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M8 6h11M8 12h11M8 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>; }
function RepeatIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" /></svg>; }
function TagIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V4h3.5L19 16.5 16.5 19 3 7.5Z" /><path strokeLinecap="round" d="M6.5 7.5h.01" /></svg>; }
function ChartIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M8 16v-5m4 5V7m4 9v-8" /></svg>; }

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="rounded-2xl bg-[#f7faf5] px-4 py-3"><p className="text-xs text-[#718076]">{label}</p><p className={`mt-1 truncate text-sm font-semibold ${tone}`}>{value}</p></div>;
}

function CashflowChart({ monthly, chartMax }: { monthly: MonthlyCashflow[]; chartMax: number }) {
  return <div className="mt-6 rounded-2xl bg-[#f7faf5] px-3 pb-3 pt-4 sm:px-5"><div className="grid h-44 grid-cols-6 items-end gap-1.5 sm:h-52 sm:gap-3">{monthly.map((item) => <div key={item.label} className="flex h-full min-w-0 flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end justify-center gap-0.5 sm:gap-1"><span title={`Masuk ${money(item.income)}`} className="min-h-0 w-[38%] rounded-t-md bg-[#3d8b53]" style={{ height: `${Math.max((item.income / chartMax) * 100, item.income ? 5 : 0)}%` }} /><span title={`Keluar ${money(item.expense)}`} className="min-h-0 w-[38%] rounded-t-md bg-[#c25a4b]" style={{ height: `${Math.max((item.expense / chartMax) * 100, item.expense ? 5 : 0)}%` }} /></div><span className="text-[10px] capitalize text-[#718076] sm:text-xs">{item.label}</span></div>)}</div></div>;
}

type DashboardSearchParams = Promise<{ message?: string; error?: string }>;

export default async function DashboardPage({ searchParams }: { searchParams: DashboardSearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.rpc("process_due_recurring_transactions");

  const [{ data: profile }, { data: accounts }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase.from("accounts").select("id, name, balance, currency").eq("user_id", user.id).order("created_at"),
    supabase.from("transactions").select("id, type, amount, description, transaction_date, accounts(name), categories(name)").eq("user_id", user.id).order("transaction_date", { ascending: false }).limit(500),
  ]);

  const totalBalance = accounts?.reduce((total, account) => total + Number(account.balance), 0) ?? 0;
  const monthly = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const items = transactions?.filter((item) => item.transaction_date.startsWith(key)) ?? [];
    return { label: date.toLocaleDateString("id-ID", { month: "short" }), income: items.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0), expense: items.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0) };
  });
  const chartMax = Math.max(...monthly.flatMap((item) => [item.income, item.expense]), 1);
  const periodIncome = monthly.reduce((sum, item) => sum + item.income, 0);
  const periodExpense = monthly.reduce((sum, item) => sum + item.expense, 0);
  const categoryTotals = new Map<string, number>();
  transactions?.filter((item) => item.type === "expense").forEach((item) => {
    const relation = item.categories as { name: string } | { name: string }[] | null;
    const name = Array.isArray(relation) ? relation[0]?.name : relation?.name;
    categoryTotals.set(name || "Tanpa kategori", (categoryTotals.get(name || "Tanpa kategori") ?? 0) + Number(item.amount));
  });
  const topCategories: CategorySpending[] = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, amount]) => ({ name, amount }));
  const topCategory = topCategories[0];

  return <main className="dashboard-shell min-h-screen bg-[#f3f7f1] px-4 py-5 text-[#17211b] sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-6xl">
    <header className="flex items-center justify-between rounded-2xl border border-[#e1e9df] bg-white/80 px-4 py-3 shadow-sm"><Link href="/dashboard" className="flex items-center gap-2.5 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-[#173d2b] text-[#d8f37d]"><WalletIcon /></span><span>pocketwise</span></Link><div className="flex items-center gap-2"><Link href="/dashboard/profile" aria-label="Profil" title="Profil" className="inline-flex size-10 items-center justify-center rounded-xl border border-[#dce8d9] bg-[#f7faf5] text-[#52754c] transition hover:bg-[#e8f1e5]"><ProfileIcon /></Link><form action={signOut}><button type="submit" aria-label="Keluar" title="Keluar" className="inline-flex size-10 items-center justify-center rounded-xl border border-[#e1e3dd] bg-[#fafbf9] text-[#526057] transition hover:bg-[#fff6f3] hover:text-[#a4473c]"><LogoutIcon /></button></form></div></header>
    <Suspense fallback={null}><FormAlert forcedMessage={params.message} /></Suspense>
    <section className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Ruang keuanganmu</p><h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#173d2b] sm:text-5xl">Halo, {profile?.display_name || user.email?.split("@")[0] || "teman"}!</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#718076]">Pantau saldo dan atur transaksi harianmu dengan lebih tenang.</p></div><Link href="/dashboard/transactions/new?returnTo=%2Fdashboard" className="rounded-2xl bg-[#173d2b] px-5 py-3.5 text-center font-semibold text-white hover:bg-[#24573c]">+ Catat Transaksi</Link></section>
    <section className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]"><div className="rounded-[2rem] bg-[#173d2b] p-6 text-white shadow-xl sm:p-8"><p className="text-sm text-[#b5cdbb]">Total saldo</p><p className="mt-5 break-words text-4xl font-semibold sm:text-5xl">{money(totalBalance)}</p><p className="mt-8 text-sm text-[#b5cdbb]">{accounts?.length ?? 0} rekening terhubung</p></div><div className="rounded-[2rem] bg-[#d8f37d] p-6 shadow-sm sm:p-8"><p className="text-sm font-medium text-[#52653f]">Akses cepat</p><h2 className="mt-3 text-2xl font-semibold text-[#173d2b]">Atur keuanganmu</h2><div className="mt-6 grid gap-2"><QuickLink href="/dashboard/transactions" label="Lihat riwayat transaksi" icon={<ListIcon />} /><QuickLink href="/dashboard/transactions/recurring" label="Transaksi berulang" icon={<RepeatIcon />} /><QuickLink href="/dashboard/accounts" label="Kelola rekening" icon={<WalletIcon />} /><QuickLink href="/dashboard/categories" label="Kelola kategori" icon={<TagIcon />} /><QuickLink href="/dashboard/reports" label="Lihat laporan" icon={<ChartIcon />} /></div></div></section>
    <section className="mt-5 rounded-[2rem] border border-[#e1e9df] bg-white p-4 shadow-sm sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#6a9a5f]">Ringkasan</p><h2 className="mt-2 text-xl font-semibold sm:text-2xl">Arus kas 6 bulan</h2></div><div className="flex gap-4 text-xs text-[#718076]"><span><i className="mr-1.5 inline-block size-2 rounded-full bg-[#3d8b53]" />Masuk</span><span><i className="mr-1.5 inline-block size-2 rounded-full bg-[#c25a4b]" />Keluar</span></div></div><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3"><SummaryCard label="Total masuk" value={money(periodIncome)} tone="text-[#28703d]" /><SummaryCard label="Total keluar" value={money(periodExpense)} tone="text-[#a4473c]" /><SummaryCard label="Selisih" value={money(periodIncome - periodExpense)} tone={periodIncome >= periodExpense ? "text-[#28703d]" : "text-[#a4473c]"} /></div><CashflowChart monthly={monthly} chartMax={chartMax} /></section>
    <section className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-[2rem] border border-[#e1e9df] bg-white p-5 shadow-sm sm:p-7"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#6a9a5f]">Pola pengeluaran</p><h2 className="mt-2 text-xl font-semibold">Kategori terbesar</h2><div className="mt-5 space-y-4">{topCategories.length ? topCategories.map((item) => <div key={item.name}><div className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium">{item.name}</span><span className="shrink-0 text-[#718076]">{money(item.amount)}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf1ed]"><div className="h-full rounded-full bg-[#6a9a5f]" style={{ width: `${(item.amount / (topCategory?.amount || 1)) * 100}%` }} /></div></div>) : <p className="text-sm text-[#718076]">Belum ada pengeluaran untuk dianalisis.</p>}</div></div><div className="dashboard-insight-card flex flex-col rounded-[2rem] border border-[#d7e9d3] bg-[#edf6eb] p-5 shadow-sm sm:p-7"><div className="grid size-10 place-items-center rounded-2xl bg-[#d8f37d] text-[#173d2b]">✦</div><p className="mt-5 text-sm font-semibold uppercase tracking-[.16em] text-[#5e8a54]">Insight</p><h2 className="mt-2 text-xl font-semibold text-[#173d2b]">{topCategory ? "Perhatikan kategori ini" : "Mulai catat transaksi"}</h2><p className="mt-3 text-sm leading-6 text-[#52705a]">{topCategory ? `${topCategory.name} menjadi pengeluaran terbesar dalam data yang tercatat, sebesar ${money(topCategory.amount)}.` : "Catat transaksi agar PocketWise bisa membantu membaca pola keuanganmu."}</p><Link href="/dashboard/reports" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#385b32]">Lihat laporan <ArrowIcon /></Link></div></section>
  </div></main>;
}
