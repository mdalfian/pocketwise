import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardBackLink } from "@/components/dashboard-back-link";
import { FormAlert } from "@/components/form-alert";
import { deleteGroup } from "./actions";
import { CreateGroupModal } from "./create-group-modal";

type SearchParams = Promise<{ message?: string; error?: string }>;
type Group = { id: string; name: string; description: string | null; start_date: string | null; end_date: string | null; color: string };
type Tx = { group_id: string; type: string; amount: number | string };
const money = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
function PlusIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>; }
function TrashIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M6 7l1 12h10l1-12M9 7V4h6v3" /></svg>; }

export default async function GroupsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams; const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const [{ data: groups }, { data: transactions }] = await Promise.all([
    supabase.from("transaction_groups").select("id, name, description, start_date, end_date, color").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("transactions").select("group_id, type, amount").eq("user_id", user.id).not("group_id", "is", null),
  ]);
  const txs = (transactions ?? []) as Tx[];
  return <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-5xl"><DashboardBackLink /><header className="mt-8 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Pengelompokan</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Grup transaksi</h1><p className="mt-2 text-sm text-[#718076]">Kelompokkan transaksi berdasarkan trip atau proyek.</p></div><CreateGroupModal /></header><div className="mt-6"><FormAlert forcedMessage={params.message} /></div><section className="mt-8 grid gap-4 md:grid-cols-2">{((groups ?? []) as Group[]).map((group) => { const items = txs.filter((tx) => tx.group_id === group.id); const income = items.filter((tx) => tx.type === "income").reduce((s, tx) => s + Number(tx.amount), 0); const expense = items.filter((tx) => tx.type === "expense").reduce((s, tx) => s + Number(tx.amount), 0); return <article key={group.id} className="rounded-3xl border border-[#dce8d9] bg-white p-5 shadow-sm"><div className="flex justify-between gap-3"><Link href={`/dashboard/groups/${group.id}`} className="flex-1" aria-label={`Lihat detail ${group.name}`}><div className="flex items-start gap-3"><span className="mt-1 size-4 shrink-0 rounded-full" style={{ backgroundColor: group.color }} /><div><h2 className="text-lg font-semibold text-[#173d2b]">{group.name}</h2><p className="mt-1 text-sm text-[#718076]">{group.description || "Tanpa deskripsi"}</p></div></div></Link><form action={deleteGroup}><input type="hidden" name="id" value={group.id} /><button type="submit" aria-label={`Hapus grup ${group.name}`} title="Hapus grup" className="grid size-9 place-items-center rounded-xl text-[#a4473c] hover:bg-[#fff0ed]"><TrashIcon /></button></form></div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-[#f7faf5] p-3"><p className="text-xs text-[#718076]">Masuk</p><p className="mt-1 truncate text-sm font-semibold text-[#28703d]">{money(income)}</p></div><div className="rounded-2xl bg-[#f7faf5] p-3"><p className="text-xs text-[#718076]">Keluar</p><p className="mt-1 truncate text-sm font-semibold text-[#a4473c]">{money(expense)}</p></div></div><div className="mt-4 flex items-center justify-between"><Link href={`/dashboard/groups/${group.id}`} className="text-xs font-semibold text-[#52754c] hover:underline">Lihat detail →</Link><Link href={`/dashboard/transactions/new?groupId=${group.id}&returnTo=%2Fdashboard%2Fgroups`} aria-label={`Tambah transaksi ke ${group.name}`} title="Tambah transaksi" className="inline-flex items-center gap-2 rounded-xl bg-[#173d2b] px-3 py-2 text-xs font-semibold text-white hover:bg-[#24573c]"><PlusIcon />Tambah</Link></div></article>; })}</section></div></main>;
}
