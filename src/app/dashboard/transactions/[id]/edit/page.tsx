import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { FormAlert } from "@/components/form-alert";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { updateTransaction } from "../../actions";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: transaction }, { data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("transactions").select("id, account_id, category_id, type, amount, description, transaction_date").eq("id", id).eq("user_id", user.id).single(),
    supabase.from("accounts").select("id, name").eq("user_id", user.id).order("name"),
    supabase.from("categories").select("id, name, kind").eq("user_id", user.id).order("name"),
  ]);
  if (!transaction || transaction.type === "transfer") notFound();
    return <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-10"><div className="mx-auto max-w-xl"><Link href="/dashboard/transactions" className="text-sm font-semibold text-[#526057]">&lt; Kembali</Link><section className="mt-6 rounded-3xl border border-[#dce8d9] bg-white p-5 shadow-sm sm:p-8"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#5e8a54]">Edit transaksi</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Perbarui transaksi</h1><div className="mt-6"><FormAlert /></div><form action={updateTransaction} className="mt-6 space-y-5"><input type="hidden" name="id" value={id} /><label className="block text-sm font-medium">Rekening<select required name="accountId" defaultValue={transaction.account_id} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3"><option value="">Pilih rekening</option>{accounts?.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label><label className="block text-sm font-medium">Kategori<select name="categoryId" defaultValue={transaction.category_id ?? ""} className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-white px-4 py-3"><option value="">Tanpa kategori</option>{categories?.filter((category) => category.kind === transaction.type).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><input type="hidden" name="type" value={transaction.type} /><label className="block text-sm font-medium">Jumlah<input required min="1" step="1" type="number" name="amount" defaultValue={transaction.amount} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><label className="block text-sm font-medium">Keterangan<input required name="description" defaultValue={transaction.description} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><label className="block text-sm font-medium">Tanggal<input required type="date" name="transactionDate" defaultValue={transaction.transaction_date} className="mt-2 w-full rounded-xl border border-[#dce3dc] px-4 py-3" /></label><div className="flex justify-end gap-3"><Link href="/dashboard/transactions" className="rounded-xl border border-[#dce3dc] px-5 py-3 text-sm font-semibold">Batal</Link><PendingSubmitButton pendingLabel="Menyimpan..." className="rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-semibold text-white">Simpan perubahan</PendingSubmitButton></div></form></section></div></main>;
}
