"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({ displayName: z.string().trim().min(1).max(80) });
const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8), confirmPassword: z.string().min(8) }).refine((data) => data.newPassword === data.confirmPassword, { path: ["confirmPassword"] });

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({ displayName: formData.get("displayName") });
  if (!parsed.success) redirect("/dashboard/profile?error=invalid-profile");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("profiles").update({ display_name: parsed.data.displayName, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) redirect("/dashboard/profile?error=profile-save-failed");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?message=profile-saved");
}

export async function updatePassword(formData: FormData) {
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/profile?error=invalid-password");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: parsed.data.currentPassword });
  if (signInError) redirect("/dashboard/profile?error=wrong-current-password");
  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) redirect("/dashboard/profile?error=password-save-failed");
  redirect("/dashboard/profile?message=password-saved");
}
