"use client";

import { useFormStatus } from "react-dom";

export function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#173d2b] py-3.5 font-semibold text-white shadow-lg shadow-[#173d2b]/10 transition hover:-translate-y-0.5 hover:bg-[#24573c] active:translate-y-0 disabled:cursor-wait disabled:opacity-75"
    >
      {pending && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
      <span>{pending ? "Memproses..." : "Masuk"}</span>
    </button>
  );
}
