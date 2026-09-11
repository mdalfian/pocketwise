"use client";
import { useRouter } from "next/navigation";

export function DashboardBackLink({ href = "/dashboard", label = "Kembali" }: { href?: string; label?: string }) {
  const router = useRouter();
  const goBack = () => window.history.length > 1 ? router.back() : router.push(href);
  return <button type="button" onClick={goBack} aria-label={label} title={label} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#526057] transition hover:bg-white hover:text-[#173d2b] focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>{label}</button>;
}
