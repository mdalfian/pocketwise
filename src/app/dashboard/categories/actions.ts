"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  kind: z.enum(["income", "expense"]),
});

export async function createCategory(formData: FormData) {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/categories?error=invalid-input");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name: parsed.data.name,
    kind: parsed.data.kind,
  });

  if (error) redirect(`/dashboard/categories?error=${error.code === "23505" ? "duplicate" : "save-failed"}`);
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/transactions/new");
  redirect("/dashboard/categories");
}

export async function updateCategory(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  const parsed = categorySchema.safeParse({ name: formData.get("name"), kind: formData.get("kind") });
  if (!id.success || !parsed.success) redirect("/dashboard/categories?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("categories").update({ name: parsed.data.name, kind: parsed.data.kind }).eq("id", id.data).eq("user_id", user.id);
  if (error) redirect(`/dashboard/categories?error=${error.code === "23505" ? "duplicate" : "save-failed"}`);
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/transactions/new");
  redirect("/dashboard/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/dashboard/categories?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("categories").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect("/dashboard/categories?error=delete-failed");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/transactions/new");
  redirect("/dashboard/categories");
}
