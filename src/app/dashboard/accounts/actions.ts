"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const accountSchema = z.object({
  name: z.string().trim().min(1).max(100),
  balance: z.coerce.number().int().min(0).max(9_000_000_000_000_000),
});

export async function createAccount(formData: FormData) {
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/accounts?error=invalid-input");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name: parsed.data.name,
    balance: parsed.data.balance,
    currency: "IDR",
  });

  if (error) redirect("/dashboard/accounts?error=save-failed");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  redirect("/dashboard/accounts");
}

export async function updateAccount(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  const parsed = accountSchema.pick({ name: true }).safeParse({ name: formData.get("name") });
  if (!id.success || !parsed.success) redirect("/dashboard/accounts?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("accounts").update({ name: parsed.data.name }).eq("id", id.data).eq("user_id", user.id);
  if (error) redirect("/dashboard/accounts?error=save-failed");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  redirect("/dashboard/accounts");
}

export async function deleteAccount(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/dashboard/accounts?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("accounts").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect("/dashboard/accounts?error=delete-failed");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  redirect("/dashboard/accounts");
}
