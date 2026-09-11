"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const groupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(240).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
}).refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, { message: "invalid-date" });

export async function createGroup(formData: FormData) {
  const parsed = groupSchema.safeParse({
    name: formData.get("name"), description: formData.get("description") || undefined,
    startDate: formData.get("startDate") || undefined, endDate: formData.get("endDate") || undefined,
    color: formData.get("color") || "#6a9a5f",
  });
  if (!parsed.success) redirect("/dashboard/groups?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("transaction_groups").insert({ user_id: user.id, name: parsed.data.name, description: parsed.data.description || null, start_date: parsed.data.startDate || null, end_date: parsed.data.endDate || null, color: parsed.data.color });
  if (error) redirect("/dashboard/groups?error=save-failed");
  revalidatePath("/dashboard/groups"); revalidatePath("/dashboard/transactions/new");
  redirect("/dashboard/groups?message=group-created");
}

export async function deleteGroup(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/dashboard/groups?error=invalid-input");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("transaction_groups").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect("/dashboard/groups?error=delete-failed");
  revalidatePath("/dashboard/groups"); revalidatePath("/dashboard/transactions");
  redirect("/dashboard/groups?message=group-deleted");
}
