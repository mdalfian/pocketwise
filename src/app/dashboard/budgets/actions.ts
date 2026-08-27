"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().int().positive().max(9_000_000_000_000),
});

export async function saveBudget(formData: FormData) {
  const parsed = budgetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/budgets?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: category } = await supabase.from("categories").select("id").eq("id", parsed.data.categoryId).eq("user_id", user.id).eq("kind", "expense").single();
  if (!category) redirect("/dashboard/budgets?error=category-not-found");
  const { error } = await supabase.from("category_budgets").upsert({ user_id: user.id, category_id: parsed.data.categoryId, month: `${parsed.data.month}-01`, amount: parsed.data.amount, updated_at: new Date().toISOString() }, { onConflict: "user_id,category_id,month" });
  if (error) redirect("/dashboard/budgets?error=save-failed");
  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
  redirect("/dashboard/budgets");
}

export async function deleteBudget(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/dashboard/budgets?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("category_budgets").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect("/dashboard/budgets?error=delete-failed");
  revalidatePath("/dashboard/budgets");
  redirect("/dashboard/budgets");
}
