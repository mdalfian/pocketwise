import Link from "next/link";
import { Suspense } from "react";
import { signIn } from "@/app/auth/actions";
import { FormAlert } from "@/components/form-alert";
import { LoginSubmitButton } from "./login-submit-button";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f7f1] px-4 py-8 text-[#17211b] sm:px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-[#173d2b] text-[#d8f37d] shadow-sm"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3 16.5v-9Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h13.5A2.5 2.5 0 0 1 19 10.5V12h-3.5a2 2 0 1 1 0-4H19M15.5 10h.01"/></svg></span>
          pocketwise
        </Link>
        <div className="mt-8 rounded-[2rem] border border-[#e1e9df] bg-white p-6 shadow-sm sm:mt-10 sm:p-8">
          <Suspense fallback={null}><FormAlert /></Suspense>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#6a9a5f]">Selamat datang kembali</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Uangmu sudah menunggu.</h1>
          <p className="mt-3 text-sm leading-6 text-[#718076]">Masuk untuk melihat ringkasan keuangan pribadimu.</p>
          <form action={signIn} className="mt-8 space-y-5">
            <label className="block text-sm font-medium">Email<input required type="email" name="email" placeholder="kamu@email.com" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-[#fbfdfb] px-4 py-3 outline-none transition focus:border-[#6a9a5f] focus:ring-2 focus:ring-[#d8f37d]" /></label>
            <label className="block text-sm font-medium">Kata sandi<input required type="password" name="password" placeholder="Masukkan password" className="mt-2 w-full rounded-xl border border-[#dce3dc] bg-[#fbfdfb] px-4 py-3 outline-none transition focus:border-[#6a9a5f] focus:ring-2 focus:ring-[#d8f37d]" /></label>
            <LoginSubmitButton />
          </form>
          <p className="mt-6 text-center text-sm text-[#718076]">Belum punya akun? <Link href="/signup" className="font-semibold text-[#173d2b] hover:text-[#5e8a54]">Buat akun</Link></p>
        </div>
      </div>
    </main>
  );
}
