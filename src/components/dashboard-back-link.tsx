import Link from "next/link";

export function DashboardBackLink({ href = "/dashboard", label = "Kembali" }: { href?: string; label?: string }) {
  return <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#526057] transition hover:bg-white hover:text-[#173d2b] focus:outline-none focus:ring-2 focus:ring-[#d8f37d] focus:ring-offset-2"><span aria-hidden="true">&lt;</span>{label}</Link>;
}
