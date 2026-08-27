"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { transactionInputSchema } from "@/lib/validation/transaction";

export async function createTransaction(formData: FormData) {
  const parsed = transactionInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/transactions/new?error=invalid-input");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // The database requires a non-empty description, while the form makes it optional.
  // Keep the field optional for users but always send a valid value to the RPC.
  const description = parsed.data.description || "Transaksi";

  if (parsed.data.type === "transfer") {
    const toAccountId = parsed.data.toAccountId;
    if (!toAccountId || toAccountId === parsed.data.accountId) redirect("/dashboard/transactions/new?error=invalid-transfer");
    const { data: transferAccounts } = await supabase
      .from("accounts")
      .select("id")
      .in("id", [parsed.data.accountId, toAccountId])
      .eq("user_id", user.id);
    if (!transferAccounts || transferAccounts.length !== 2) redirect("/dashboard/transactions/new?error=account-not-found");
    const { error } = await supabase.rpc("create_transfer_and_update_balances", {
      p_from_account_id: parsed.data.accountId,
      p_to_account_id: toAccountId,
      p_amount: parsed.data.amount,
      p_description: description,
      p_transaction_date: parsed.data.transactionDate.toISOString().slice(0, 10),
    });
    if (error) {
      console.error("Transfer transaction failed:", error);
      const message = error.message.toLowerCase();
      const errorKey = message.includes("insufficient") ? "insufficient-balance" : message.includes("function") ? "transfer-not-ready" : "save-failed";
      redirect(`/dashboard/transactions/new?error=${errorKey}`);
    }
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/accounts");
    revalidatePath("/dashboard/transactions");
    redirect("/dashboard");
  }

  const { data: account } = await supabase.from("accounts").select("id").eq("id", parsed.data.accountId).eq("user_id", user.id).single();
  if (!account) redirect("/dashboard/transactions/new?error=account-not-found");

  if (parsed.data.categoryId) {
    const { data: category } = await supabase.from("categories").select("id").eq("id", parsed.data.categoryId).eq("user_id", user.id).single();
    if (!category) redirect("/dashboard/transactions/new?error=category-not-found");
  }

  const { error } = await supabase.rpc("create_transaction_and_update_balance", {
    p_account_id: parsed.data.accountId,
    p_category_id: parsed.data.categoryId || null,
    p_type: parsed.data.type,
    p_amount: parsed.data.amount,
    p_description: description,
    p_transaction_date: parsed.data.transactionDate.toISOString().slice(0, 10),
  });

  if (error) redirect("/dashboard/transactions/new?error=save-failed");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard/transactions");
  redirect("/dashboard");
}

export async function deleteTransaction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/dashboard/transactions?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.rpc("delete_transaction_and_update_balance", { p_transaction_id: id });
  if (error) redirect("/dashboard/transactions?error=delete-failed");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard/transactions");
  redirect("/dashboard/transactions?message=transaction-deleted");
}

export async function updateTransaction(formData: FormData) {
  const parsed = transactionInputSchema.safeParse(Object.fromEntries(formData));
  const id = formData.get("id");
  if (!parsed.success || typeof id !== "string") redirect(`/dashboard/transactions/${id}/edit?error=invalid-input`);
  if (parsed.data.type === "transfer") redirect(`/dashboard/transactions/${id}/edit?error=transfer-edit-not-supported`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const description = parsed.data.description || "Transaksi";
  const { error } = await supabase.rpc("update_transaction_and_update_balance", { p_transaction_id: id, p_account_id: parsed.data.accountId, p_category_id: parsed.data.categoryId || null, p_type: parsed.data.type, p_amount: parsed.data.amount, p_description: description, p_transaction_date: parsed.data.transactionDate.toISOString().slice(0, 10) });
  if (error) redirect(`/dashboard/transactions/${id}/edit?error=save-failed`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/accounts"); revalidatePath("/dashboard/transactions");
  redirect("/dashboard/transactions?message=transaction-updated");
}
