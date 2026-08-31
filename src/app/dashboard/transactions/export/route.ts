import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function relationName(relation: { name: string } | { name: string }[] | null, fallback: string) {
  if (Array.isArray(relation)) return relation[0]?.name ?? fallback;
  return relation?.name ?? fallback;
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function transactionType(type: string) {
  if (type === "income") return "Pemasukan";
  if (type === "expense") return "Pengeluaran";
  return "Transfer antar rekening";
}

function readableDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = new URL(request.url).searchParams;
  const search = params.get("search")?.trim().toLowerCase();
  const type = params.get("type");
  const account = params.get("account");
  const category = params.get("category");
  const from = params.get("from");
  const to = params.get("to");
  const { data } = await supabase
    .from("transactions")
    .select("id, type, amount, description, transaction_date, created_at, accounts(name), categories(name)")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  const transactions = (data ?? []).filter((item) => {
    const accountName = relationName(item.accounts, "Rekening");
    const categoryName = relationName(item.categories, item.type === "transfer" ? "Transfer antar rekening" : "Tanpa kategori");
    const searchable = `${item.description} ${accountName} ${categoryName}`.toLowerCase();
    return (!search || searchable.includes(search)) && (!type || type === "all" || item.type === type) && (!account || accountName === account) && (!category || categoryName === category) && (!from || item.transaction_date >= from) && (!to || item.transaction_date <= to);
  });

  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0);
  const rows = [
    ["LAPORAN TRANSAKSI POCKETWISE"],
    ["Diekspor pada", readableDate(new Date().toISOString().slice(0, 10))],
    ["Jumlah transaksi", transactions.length],
    ["Total pemasukan (Rp)", income],
    ["Total pengeluaran (Rp)", expense],
    ["Saldo bersih (Rp)", income - expense],
    [],
    ["Tanggal transaksi", "Jenis transaksi", "Keterangan", "Kategori", "Rekening", "Jumlah (Rp)"],
    ...transactions.map((item) => [readableDate(item.transaction_date), transactionType(item.type), item.description, relationName(item.categories, item.type === "transfer" ? "Transfer antar rekening" : "Tanpa kategori"), relationName(item.accounts, "Rekening"), Number(item.amount)]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  const filename = `pocketwise-transaksi-${new Date().toISOString().slice(0, 7)}.csv`;
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}"` } });
}
