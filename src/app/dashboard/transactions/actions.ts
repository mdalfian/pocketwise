"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { transactionInputSchema } from "@/lib/validation/transaction";

export async function createTransaction(formData: FormData) {
  const requestedReturnTo = formData.get("returnTo");
  const returnTo = typeof requestedReturnTo === "string" && requestedReturnTo.startsWith("/dashboard") ? requestedReturnTo : "/dashboard";
  const withError = (error: string): never => redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}error=${error}`);
  const parsed = transactionInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) withError("invalid-input");
  const transaction = parsed.data!;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // The database requires a non-empty description, while the form makes it optional.
  // Keep the field optional for users but always send a valid value to the RPC.
  const description = transaction.description || "Transaksi";

  if (transaction.type === "transfer") {
    const toAccountId = transaction.toAccountId;
    if (!toAccountId || toAccountId === transaction.accountId) withError("invalid-transfer");
    const { data: transferAccounts } = await supabase
      .from("accounts")
      .select("id")
      .in("id", [transaction.accountId, toAccountId])
      .eq("user_id", user.id);
    if (!transferAccounts || transferAccounts.length !== 2) withError("account-not-found");
    const { error } = await supabase.rpc("create_transfer_and_update_balances", {
      p_from_account_id: transaction.accountId,
      p_to_account_id: toAccountId,
      p_amount: transaction.amount,
      p_description: description,
      p_transaction_date: transaction.transactionDate.toISOString().slice(0, 10),
    });
    if (error) {
      console.error("Transfer transaction failed:", error);
      const message = error.message.toLowerCase();
      const errorKey = message.includes("insufficient") ? "insufficient-balance" : message.includes("function") ? "transfer-not-ready" : "save-failed";
      withError(errorKey);
    }
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/accounts");
    revalidatePath("/dashboard/transactions");
    redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}message=transaction-saved`);
  }

  const { data: account } = await supabase.from("accounts").select("id").eq("id", transaction.accountId).eq("user_id", user.id).single();
  if (!account) withError("account-not-found");

  if (transaction.categoryId) {
    const { data: category } = await supabase.from("categories").select("id").eq("id", transaction.categoryId).eq("user_id", user.id).single();
    if (!category) withError("category-not-found");
  }

  const { error } = await supabase.rpc("create_transaction_and_update_balance", {
    p_account_id: transaction.accountId,
    p_category_id: transaction.categoryId || null,
    p_group_id: transaction.groupId || null,
    p_type: transaction.type,
    p_amount: transaction.amount,
    p_description: description,
    p_transaction_date: transaction.transactionDate.toISOString().slice(0, 10),
  });

  if (error) withError("save-failed");
  if (formData.get("recurring") === "yes") {
    const frequency = formData.get("frequency");
    const nextRun = formData.get("nextRun");
    const endDate = formData.get("endDate");
    if ((frequency !== "weekly" && frequency !== "monthly") || typeof nextRun !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(nextRun)) withError("invalid-input");
    const scheduledDate = new Date(`${nextRun}T00:00:00`);
    const transactionDate = new Date(`${transaction.transactionDate.toISOString().slice(0, 10)}T00:00:00`);
    if (scheduledDate <= transactionDate) scheduledDate.setDate(scheduledDate.getDate() + (frequency === "weekly" ? 7 : 31));
    const nextRunDate = scheduledDate.toISOString().slice(0, 10);
    const { error: recurringError } = await supabase.from("recurring_transactions").insert({ user_id: user.id, account_id: transaction.accountId, category_id: transaction.categoryId || null, type: transaction.type, amount: transaction.amount, description, frequency, next_run: nextRunDate, end_date: typeof endDate === "string" && endDate ? endDate : null });
    if (recurringError) withError("save-failed");
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard/transactions");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}message=transaction-saved`);
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
