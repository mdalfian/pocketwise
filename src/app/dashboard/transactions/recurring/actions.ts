"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function toggleRecurring(formData: FormData) {
  const id = formData.get("id");
  const active = formData.get("active") === "true";
  if (typeof id !== "string") redirect("/dashboard/transactions/recurring?error=invalid-input");
  const { supabase, user } = await getUser();
  const { error } = await supabase.from("recurring_transactions").update({ active }).eq("id", id).eq("user_id", user.id);
  if (error) redirect("/dashboard/transactions/recurring?error=save-failed");
  revalidatePath("/dashboard/transactions/recurring");
  redirect("/dashboard/transactions/recurring");
}

export async function deleteRecurring(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/dashboard/transactions/recurring?error=invalid-input");
  const { supabase, user } = await getUser();
  const { error } = await supabase.from("recurring_transactions").delete().eq("id", id).eq("user_id", user.id);
  if (error) redirect("/dashboard/transactions/recurring?error=delete-failed");
  revalidatePath("/dashboard/transactions/recurring");
  redirect("/dashboard/transactions/recurring");
}
