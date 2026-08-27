"use client";

import { useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  "invalid-input": "Data belum sesuai. Periksa kembali semua isian.",
  "invalid-credentials": "Email atau kata sandi salah. Silakan coba lagi.",
  "signup-failed": "Akun belum berhasil dibuat. Email mungkin sudah terdaftar.",
  "save-failed": "Data belum berhasil disimpan. Coba lagi beberapa saat.",
  duplicate: "Kategori dengan nama dan jenis tersebut sudah ada.",
  "delete-failed": "Kategori belum berhasil dihapus. Coba lagi beberapa saat.",
  "transaction-deleted": "Transaksi berhasil dihapus dan saldo sudah disesuaikan.",
  "transaction-updated": "Transaksi berhasil diperbarui.",
  "transfer-edit-not-supported": "Transaksi transfer belum bisa diedit. Hapus lalu catat ulang jika diperlukan.",
  "invalid-transfer": "Pilih rekening tujuan yang berbeda dari rekening asal.",
  "insufficient-balance": "Saldo rekening asal tidak mencukupi untuk transfer.",
  "transfer-not-ready": "Fitur transfer belum aktif di database. Jalankan migration Supabase terbaru lalu coba lagi.",
  "invalid-profile": "Nama tampilan belum sesuai. Periksa kembali isianmu.",
  "profile-save-failed": "Profil belum berhasil disimpan. Coba lagi beberapa saat.",
  "profile-saved": "Profil berhasil diperbarui.",
  "invalid-password": "Password baru minimal 8 karakter dan harus sama dengan konfirmasinya.",
  "wrong-current-password": "Password saat ini salah.",
  "password-save-failed": "Password belum berhasil diubah. Coba lagi beberapa saat.",
  "password-saved": "Password berhasil diubah.",
  "account-not-found": "Rekening tidak ditemukan atau bukan milik akun ini.",
  "check-email": "Pendaftaran berhasil. Cek emailmu untuk konfirmasi akun.",
};

export function FormAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const text = (error && messages[error]) || (message && messages[message]);

  if (!text) return null;

  const isError = Boolean(error);
  return <div role={isError ? "alert" : "status"} className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${isError ? "border-[#f0c9c2] bg-[#fff4f1] text-[#9f3f32]" : "border-[#c8dfbf] bg-[#f2faed] text-[#386b35]"}`}><span className="text-lg" aria-hidden="true">{isError ? "⚠" : "✓"}</span><p>{text}</p></div>;
}
