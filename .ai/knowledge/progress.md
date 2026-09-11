## 2026-09-08 — Fix dark variant detail grup
- Menganalisis halaman rekening dan transaksi sebagai referensi.
- Menetapkan custom Tailwind dark variant berbasis class `.dark`, bukan preferensi sistem.
- Light mode kini tidak lagi terkena style `dark:` saat class `.dark` tidak aktif.
- Build berhasil.

## 2026-09-08 — Fix toggle light mode
- Menghapus fallback `prefers-color-scheme` yang memaksa theme kembali gelap saat OS menggunakan dark mode.
- Background root sekarang mengikuti CSS variable theme.
- Pilihan light/dark dari pengguna tetap tersimpan melalui localStorage.
- Build berhasil.

## 2026-09-08 — Redesign detail grup light/dark mode
- Menata ulang seluruh halaman detail grup, bukan hanya background.
- Header, summary cards, daftar transaksi, teks, border, CTA, dan empty state kini memiliki warna eksplisit untuk light dan dark mode.
- Menambahkan metrik saldo bersih agar ringkasan lebih informatif.
- Build berhasil.

## 2026-09-08 — Background light mode detail grup
- Background hero detail grup pada light mode diubah menjadi putih.
- Dark mode tidak diubah.

## 2026-09-08 — Kembalikan polish header detail grup
- Menambahkan kembali gradient lembut, shadow, dan dekorasi visual header pada light mode.
- Dark mode tetap menggunakan background hero sebelumnya.

## 2026-09-08 — Fix parser detail grup
- Memperbaiki ekspresi JSX summary cards yang menyebabkan error `Expected '</', got '}'`.
- Production build berhasil setelah perbaikan.

## 2026-09-08 — Perbaikan light mode detail grup
- Header detail grup menggunakan surface hijau muda, border halus, dan teks gelap pada light mode.
- Tombol CTA dibuat kontras; dark mode tetap memakai hero hijau gelap.
## 2026-09-08 — Polish header detail grup
- Header detail grup dibuat lebih user-friendly dengan hero section berwarna brand.
- Menambahkan periode yang diformat lokal, deskripsi yang lebih informatif, dekorasi warna grup, dan CTA tambah transaksi yang lebih jelas.
- Ringkasan transaksi dan daftar aktivitas tetap ditampilkan di bawah header.

## 2026-09-07 — Template import CSV Supabase
- Menambahkan `supabase/import-templates/transaction_groups.csv`.
- Menambahkan `supabase/import-templates/transactions.csv`.
- Menambahkan README berisi urutan import, UUID yang diperlukan, enum valid, dan catatan saldo rekening.

## 2026-09-07 — Seeder transaksi grup
- Menambahkan `supabase/seed.sql` untuk membuat data demo grup `Trip Semarang`.
- Seeder membuat rekening, kategori, grup, dan dua transaksi yang terhubung ke grup.
- Seeder aman dijalankan ulang untuk data demo berdasarkan nama dan deskripsi transaksi.

## 2026-09-07 — Polish konteks grup transaksi
- Menghapus label “Otomatis dipakai” dari form transaksi.
- Banner grup aktif dipoles dengan ikon, warna grup, border, shadow, dan dukungan dark mode.

## 2026-09-07 — Konteks grup pada transaksi
- Form Catat Transaksi dari kartu grup sekarang menampilkan nama dan warna grup aktif.
- Group ID tetap dikirim secara hidden agar user tidak perlu memilih grup manual.
- Validasi ownership grup dilakukan saat mengambil konteks halaman.

## 2026-09-07 — Tambah transaksi dari grup
- Menambahkan tombol tambah transaksi pada setiap kartu grup.
- Tombol membawa `groupId` secara internal sehingga user tidak perlu memilih grup manual.
- Tombol hapus grup diganti menjadi ikon trash dengan label aksesibilitas.
- Lint dan production build berhasil.

## 2026-09-07 — Konsistensi modal dan empty state grup
- Style modal grup disamakan dengan modal kategori dan rekening.
- Overlay, ukuran panel, tombol close, input, serta tombol aksi dibuat konsisten.
- Empty state grup diberi styling dark mode agar surface, border, dan teks tetap terbaca.

## 2026-09-07 — Polish halaman grup transaksi
- Form pembuatan grup dipindah dari halaman utama ke modal.
- Halaman grup sekarang fokus pada daftar dan ringkasan transaksi tiap grup.
- Layout halaman grup dipecah menjadi struktur JSX yang lebih mudah dirawat.
- Lint dan production build berhasil.

## 2026-09-07 — Perbaikan error Catat Transaksi
- Menghapus `groupId` dari schema transaksi karena field Grup transaksi sudah tidak ada di form.
- RPC transaksi baru sekarang mengirim `p_group_id: null` secara eksplisit.
- Lint dan production build berhasil.

## 2026-09-07 — Bersihkan form catat transaksi
- Menghapus field Grup transaksi dari halaman Catat transaksi sesuai arahan UI.
- Akses Grup transaksi tetap tersedia melalui Akses cepat di dashboard.

## 2026-09-07 — Akses grup di dashboard
- Menambahkan Grup transaksi ke bagian Akses cepat di dashboard.
- Menghapus link grup dari tombol navigasi Kembali agar tidak muncul di setiap halaman.

## 2026-09-07 — CRUD grup transaksi awal
- Menambahkan halaman `/dashboard/groups` untuk membuat dan melihat grup transaksi.
- Grup mendukung nama, deskripsi, warna, tanggal mulai, dan tanggal selesai.
- Menampilkan total pemasukan, pengeluaran, dan jumlah transaksi per grup.
- Menambahkan aksi hapus grup; transaksi tetap aman karena relasi memakai `ON DELETE SET NULL`.
- Transaksi baru sudah memiliki pilihan grup opsional.
- Lint dan production build berhasil.

## 2026-09-07 — Assign grup pada transaksi
- Form transaksi baru sekarang memuat pilihan grup transaksi opsional.
- Validasi transaksi mendukung `groupId`.
- RPC pencatatan transaksi diperbarui agar memvalidasi ownership grup dan menyimpan `group_id`.
- Migration tambahan dibuat di `014_transaction_group_rpc.sql`.
- Lint dan production build berhasil.

## 2026-09-07 — Migration transaction groups
- Menambahkan tabel `transaction_groups` untuk mengelompokkan transaksi berdasarkan konteks seperti perjalanan atau proyek.
- Menambahkan `transactions.group_id` dengan foreign key yang memastikan grup dan transaksi berasal dari user yang sama.
- Menambahkan RLS, index grup, validasi tanggal, dan opsi metadata warna/deskripsi.

## 2026-09-02 — Polish card rekening
- Menambahkan border halus dan hover state pada card rekening.
- Border dark mode disesuaikan agar tetap terlihat tanpa terlalu kontras.

## 2026-09-02 — Konsistensi background halaman rekening
- Background halaman rekening disamakan dengan halaman dashboard lain menggunakan surface hijau yang konsisten.
- Menghindari background dark mode yang terlalu gelap seperti hitam pada halaman rekening.

## 2026-09-02 — Konsistensi dark mode dashboard
- Merapikan warna surface dan border halaman dashboard sekunder melalui override dark mode.
- State kategori, status aktif/nonaktif, empty state, dan loading surface kini lebih konsisten.
- Lint dan production build berhasil.

## 2026-09-02 — Polish filter dan insight dashboard
- Layout filter riwayat transaksi dirapikan dengan label field, alignment konsisten, dan tombol sejajar.
- Tombol filter mobile tidak lagi memiliki jarak atas ganda.
- Kartu Insight dashboard diberi hierarchy visual, ikon, border, dan link yang lebih rapi.
- Menambahkan override khusus dark mode agar kartu Insight tidak tampil putih/kontras aneh.
- Lint dan production build berhasil.

## 2026-09-02 — Dashboard analytics
- Dashboard sekarang mengambil relasi kategori transaksi.
- Ditambahkan visual pengeluaran berdasarkan lima kategori terbesar.
- Ditambahkan insight otomatis untuk kategori dengan pengeluaran terbesar.
- Menyediakan fallback ketika belum ada pengeluaran yang dapat dianalisis.
- Lint dan production build berhasil.

## 2026-09-01 — Kontras filter light/dark mode
- Tombol filter mobile tidak lagi bergantung pada warna hardcoded yang sama untuk kedua tema.
- Light mode memakai permukaan putih dan highlight hijau lembut.
- Dark mode memakai permukaan hijau gelap, border kontras, dan teks terang.
- Lint dan production build berhasil.

## 2026-09-01 — Polish tombol filter
- Menghapus titik indikator yang terasa mengganggu.
- Status filter aktif kini memakai kombinasi border hijau, background tint, dan ring shadow yang halus.
- Menambahkan `aria-pressed` untuk status tombol yang lebih aksesibel.
- Lint dan production build berhasil.

## 2026-09-01 — Highlight filter minimal
- Label teks indikator filter aktif dihapus.
- Tombol mobile hanya memakai highlight hijau dan titik kecil sebagai penanda visual.
- Lint dan production build berhasil.

## 2026-09-01 — Refinement indikator filter
- Badge angka pada tombol filter mobile dihapus karena terlalu ramai.
- Diganti indikator minimal berupa titik hijau dan label `Aktif`, dengan perubahan warna tombol tetap dipertahankan.
- Lint dan production build berhasil.

## 2026-09-01 — Indikator filter mobile
- Tombol Filter pada mobile kini berubah warna saat filter aktif.
- Ditambahkan badge jumlah filter aktif, misalnya `2 aktif`.
- Perhitungan mengecualikan pilihan default `Semua jenis`.
- Lint dan production build berhasil.

## 2026-09-01 — Audit responsive dialog
- Footer seluruh `AlertDialog` kini memakai `items-stretch` pada mobile agar tombol aksi full-width dan konsisten.
- Pada desktop alignment kembali horizontal dan auto-width.
- Lint dan production build berhasil.

## 2026-09-01 — Tombol hapus modal kategori
- Tombol `Hapus kategori` pada modal konfirmasi dibuat full-width di mobile agar konsisten dengan tombol `Batal`.
- Form pembungkus tombol juga diberi lebar penuh pada mobile dan kembali auto-width di desktop.
- Lint dan production build berhasil.

## 2026-09-01 — Format budget pada edit kategori
- Field `Budget bulan ini` di modal Edit kategori kini memformat nominal otomatis dengan pemisah ribuan Indonesia.
- Nilai terformat hanya untuk tampilan; hidden input mengirim angka mentah ke server.
- Lint dan production build berhasil.

## 2026-09-01 — Format Rupiah budget
- Merefactor `src/app/dashboard/budgets/page.tsx` dan mengintegrasikan `BudgetAmountInput`.
- Field budget menampilkan pemisah ribuan Indonesia secara otomatis, sementara server menerima angka mentah.
- Lint dan production build berhasil.

## 2026-09-01 — Blur modal edit kategori
- Backdrop modal edit kategori diperkuat dari transparansi ringan menjadi `bg-[#173d2b]/40` dengan `backdrop-blur-md`.

## 2026-09-01 — Transaction list empty state
- Empty state daftar transaksi sekarang lebih informatif dan memiliki CTA `Reset filter` serta `Catat transaksi`.
- Pesan empty state menjelaskan apakah pengguna perlu mengubah filter atau membuat transaksi baru.
- Lint dan production build berhasil.

## 2026-09-01 — UX form transaksi
- Input jumlah transaksi sekarang memformat angka otomatis ke format Rupiah saat diketik.
- Nilai raw angka tetap dikirim melalui hidden input agar kompatibel dengan validasi server.
- Pending submit button tetap mencegah double submit.
- Lint dan production build berhasil.

## 2026-09-01 — Transaction return path
- Semua error pada `createTransaction` sekarang kembali ke `returnTo`, bukan selalu ke form transaksi baru.
- Tombol Batal pada form transaksi mengikuti halaman asal.
- Redirect sukses tetap membawa toast `transaction-saved` ke halaman tujuan.
- Lint dan production build berhasil.

## 2026-09-01 — Glass summary lebih terlihat
- Memperkuat transparansi panel Ringkasan dengan gradient hijau/lime halus, highlight border, inset shine, dan shadow.
- Class glass diterapkan lewat selector dashboard agar tidak kalah oleh utility `bg-white` lama saat development.

## 2026-09-01 — Dashboard glass visibility fix
- Memastikan header, panel ringkasan, dan kartu saldo dashboard benar-benar menerima glass styling melalui selector khusus.
- Memperbaiki implementasi sebelumnya yang hanya terlihat pada summary/chart sehingga perubahan visual terasa belum berubah.
- Lint dan production build berhasil.

## 2026-09-01 — Glassmorphism dashboard
- Menambahkan token `.glass-surface` dan `.glass-surface-strong` dengan blur, border transparan, shadow lembut, serta fallback browser.
- Menerapkan glass styling pada summary cards dan cashflow chart dashboard.
- Quick access links juga memakai glass surface tanpa mengubah struktur atau alur navigasi.
- Dark mode memiliki override khusus agar kontras dan keterbacaan tetap terjaga.
- Lint dan production build berhasil.

## 2026-09-01 — Perbaikan layar hitam saat launch
- Menetapkan background `html` dan `body` ke brand green `#173d2b` pada fase awal agar area viewport tidak fallback ke hitam sebelum CSS aplikasi ter-render.
- Mengubah Apple status bar ke `default` agar iOS tidak memaksakan kombinasi translucent/gelap yang terasa seperti layar hitam.
- Background aplikasi tetap mengikuti theme melalui `--background` setelah halaman ter-render.

## 2026-09-01 — PWA launch experience
- Menghapus custom splash React berbasis timer agar tidak flash pada setiap navigasi dan tidak menutupi aplikasi dengan delay arbitrer.
- Native PWA launch sekarang memakai branding `#173D2B`; loading state awal tetap ditangani route-level `loading.tsx` saat server/session state belum siap.
- Manifest dilengkapi `id`, orientation, nama aplikasi lengkap, serta ikon 192/512 dan Apple Touch Icon.
- Metadata Next.js dikonfigurasi untuk application name, Apple standalone mode, status bar, icon, theme color, dan light/dark color scheme.

## 2026-09-01
- Analisis splash: flash terjadi karena splash baru dirender setelah effect client berjalan, sementara native PWA memakai warna manifest yang berbeda.
- Splash custom sekarang dirender sejak awal, fade-out setelah 900ms, dan tidak menampilkan ulang pada session yang sama.
- Warna `themeColor`/`background_color` dikembalikan ke background aplikasi agar transisi native ke custom seamless.
- Lint dan production build berhasil.

## 2026-08-31
- Safari/iOS: memperbaiki filter bulan dengan `max-width`, `min-width`, `box-sizing`, dan appearance reset agar tidak melewati viewport.
- PWA: menyamakan background native splash Android dengan warna brand dan mengganti status bar iOS dari translucent hitam ke default.
- Catatan: splash native iOS/Android muncul sebelum JavaScript, jadi splash custom React tidak dapat menggantikan layar native pertama sepenuhnya.
- Lint dan production build berhasil.

## 2026-08-31
- Mengganti ikon arrow pada akses cepat “Lihat laporan” dengan ikon grafik yang lebih relevan.
- Memoles card ringkasan dashboard: padding mobile lebih lega, header responsif, grafik diberi panel latar, batang lebih proporsional, dan label bulan lebih rapi.
- Lint dan production build berhasil.

## 2026-08-31
- Menambahkan redirect dinamis untuk catat transaksi menggunakan parameter `returnTo`: dari dashboard kembali ke dashboard, dari riwayat kembali ke riwayat.
- Toast sukses sekarang dibersihkan setelah 4,5 detik, sehingga durasinya tidak langsung terpotong oleh pembersihan URL.

## 2026-08-31
- Toast sukses sekarang auto-dismiss setelah 4,5 detik.
- Query parameter `message` otomatis dihapus dari URL setelah toast diproses, sehingga tidak muncul lagi saat refresh.
- Lint berhasil.

## 2026-08-31
- Memperbaiki toast catat transaksi yang tidak muncul setelah redirect ke dashboard dengan meneruskan `searchParams.message` dari server page secara eksplisit ke `FormAlert`.
- Lint dan build berhasil.

## 2026-08-31
- Memperbaiki toast setelah catat transaksi: server action kini redirect ke dashboard dengan `message=transaction-saved`, dan dashboard merender `FormAlert`.

## 2026-08-31
- Notifikasi sukses dari `FormAlert` sekarang tampil sebagai toast fixed di kanan atas desktop dan tetap nyaman di mobile.
- Notifikasi error tetap inline agar dekat dengan konteks form.
- Lint dan production build berhasil.

## 2026-08-31
- Memulai peningkatan UX tahap berikutnya: empty state rekening dan kategori sekarang lebih informatif serta menyediakan aksi langsung untuk menambah data.
- Validasi lint dan production build berhasil.

## 2026-08-31
- Menambahkan loading skeleton khusus untuk accounts, categories, reports, recurring transactions, profile, form transaksi baru/edit, dan form rekening baru.
- Semua skeleton berhasil melewati lint dan production build.

## 2026-08-31
- Menambahkan `src/app/dashboard/transactions/loading.tsx` agar navigasi kembali dari form catat transaksi ke riwayat transaksi menampilkan skeleton yang sesuai layout halaman, bukan layar kosong saat data sedang dimuat.

## 2026-08-31
- Memperbaiki syntax error di `src/app/dashboard/page.tsx` akibat deklarasi `QuickLink` lama yang tertinggal setelah refactor ikon akses cepat.

## 2026-08-31
- Audit UX halaman catat transaksi: jenis transaksi kini dipilih eksplisit (pengeluaran, pemasukan, transfer), kategori otomatis terfilter, dan helper text ditambahkan untuk nominal, saldo, transfer, serta transaksi berulang.
- Audit akses cepat: jumlah menu tetap lima agar tidak makin ramai, tetapi setiap menu diberi ikon kontekstual dan focus state yang lebih jelas.

## 2026-08-31
- Riwayat transaksi sekarang mengurutkan transaksi berdasarkan tanggal transaksi terbaru, lalu `created_at` terbaru sebagai tie-breaker agar transaksi di tanggal yang sama tampil sesuai waktu dibuat.
- CSV export memakai urutan yang sama.

# Development Progress

## 2026-08-26

- Initialized Next.js App Router project with TypeScript, Tailwind CSS, ESLint, and npm.
- Replaced starter page with Pocketwise finance app landing page.
- Added initial `/login` route with validated browser-required email/password fields.
- Added `.env.example` placeholders for future Auth.js and PostgreSQL integration.
- Added Supabase SSR/browser clients, auth server actions, middleware cookie refresh, and protected `/dashboard` route.
- Connected the login form to `signInWithPassword`.
- Added initial Supabase migration for profiles, accounts, categories, transactions, RLS policies, and new-user profile creation.
- Added Zod transaction validation and an authenticated transaction creation server action.
- Added `/dashboard/transactions/new` UI and dashboard entry point.
- Aligned Supabase clients with the `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` environment variable.
- Added authenticated account creation and account listing pages.
- Dashboard now reads the user's real account balances and enforces ownership through Supabase RLS/query scoping.
- Set Indonesian as the primary UI language and redesigned the dashboard with one prominent action plus grouped navigation cards.
- Localized account and transaction list screens with friendlier mobile-first styling.
- Localized landing page, login, signup, and account/transaction forms into Indonesian.
- Added reusable Indonesian form alerts for invalid credentials, invalid input, signup failures, and confirmation messages.
- Added alerts to account and transaction forms and completed remaining visible landing/auth copy localization.
- Rebuilt the dashboard in Indonesian with polished cards, visible recent activity, account summaries, and a styled Keluar button.
- Aligned landing, login, signup, and metadata with the dashboard's Indonesian brand, colors, cards, and interactions.
- Added `/signup` with Supabase email/password registration and linked it from login.
- Replaced manual transaction account UUID input with a user-owned account selector.
- Added `/dashboard/transactions` list view.
- Improved dashboard and transaction forms for mobile layouts with stacked actions, responsive typography, and touch-friendly controls.
- Added atomic transaction balance updates through Supabase RPC migration `002_transaction_balance_rpc.sql`; apply this migration in Supabase SQL Editor before using new transactions.
- Added atomic transaction balance updates through Supabase RPC migration `002_transaction_balance_rpc.sql`.
- Dashboard now displays live recent transactions and income/spending summaries with interactive card hover states.
- Removed the duplicate activity section from the dashboard while keeping the compact activity summary card.
- Redesigned transaction history with summary metrics, account labels, formatted dates, transaction type icons, and clearer amounts.
- Set the new transaction form date field to today's date by default.
- Replaced the dashboard Aktivitas terakhir card with a useful Akses cepat panel for transaction history and account management.
- Added transaction history filters for type, account, start date, and end date, with filtered totals and result count.
- Restored the latest transaction history preview to the dashboard below the balance and quick-access cards.
- Improved the transaction filter presentation with a grouped panel, heading, helper text, and reset action.
- Tightened the transaction filter panel for mobile with smaller spacing, controls, and clearer grouping.
- Kept dashboard history visible and tuned its action layout to remain compact on mobile.
- Added a reusable mobile filter bottom-sheet component for transaction filtering and prepared compact icon-style dashboard actions.
- Applied icon-only arrow and settings actions for dashboard history and account controls, with accessible labels and tooltips.
- Separated transaction filters from the history content: desktop uses a dedicated sidebar and mobile uses a bottom-sheet filter modal.
- Restored the preferred single horizontal desktop filter panel and removed the duplicate mobile-trigger behavior from the filter component.
- Rebuilt the transaction history page with exactly one responsive filter instance: horizontal panel on desktop and bottom-sheet trigger on mobile.
- Reformatted the transaction history page and repositioned the Catat transaksi button below the heading on mobile, while keeping it right-aligned on desktop.
- Removed the arrow from the Catat transaksi button and made the mobile filter trigger display without a surrounding card.
- Polished the landing page Masuk and Mulai sekarang controls with consistent button styling, hover motion, arrow affordances, and a trust badge.
- Added a subtle landing hero ornament and upgraded the dashboard rekening Kelola action with a bordered interactive button.
- Redesigned the new transaction page with a branded guidance panel, polished form card, responsive two-column layout, and clearer empty-account state.
- Simplified the new transaction page into a focused single card with subtle header separation, accessible focus states, and clear Batal/Simpan actions.
- Added optional user-owned transaction category selection to the entry form and validated category ownership in the server action.
- Added migration `003_default_categories_for_new_users.sql` to seed starter income and expense categories during signup.
- Added category labels and category filtering to the transaction history page.
- Added `/dashboard/categories` with user-owned category listing and a simple form to create income or expense categories.
- Added a dashboard shortcut to category management and a safe backfill migration for existing users.
- Changed category creation from an inline form to a responsive modal opened by the Tambah kategori button.
- Added category edit and delete actions with ownership validation, plus consistent hover/focus motion for category controls.
- Rebuilt the dashboard markup with encoding-safe labels, removing mojibake symbols from the visible view and retaining category navigation.
- Added an inline wallet SVG app logo and restored the logout icon on the dashboard header.
- Standardized cursor, hover lift, shadow, active, and focus states for category and transaction filter primary buttons.
- Added delete confirmation for categories and normalized interaction styling on the remaining transaction/category actions.
- Added reusable pending submit behavior for category create, edit, and delete actions, including disabled states to prevent duplicate submissions.
- Replaced the native category delete confirmation with a polished shadcn-style AlertDialog using Radix UI.
- Fixed the destructive AlertDialog button by wiring it through `AlertDialogAction` with the existing server-action form.
- Fixed mobile AlertDialog footer actions so `Batal` and `Hapus kategori` share consistent full-width sizing, while remaining compact on desktop.
- Added category-page failure alerts for invalid input, duplicate categories, save failures, and delete failures.
- Updated transaction entry so users choose a category first and the transaction type is derived automatically from the category kind.
- Simplified transaction entry by hiding the derived type field and making the description optional.
- Fixed transaction submission failure caused by the non-UUID `transfer` pseudo-option being sent as `categoryId`.
- Added atomic transfer support with source/destination accounts, balance checks, paired transaction records, and friendlier dashboard greeting/logout interactions.
- Refined the dashboard greeting by removing the visible email and adding a warmer user-focused welcome layout.
- Added profile settings at `/dashboard/profile` so users can edit their display name with validation and success/error alerts.
- Added direct password change in profile settings with current-password verification, confirmation validation, and responsive dashboard profile/logout controls.
- Replaced the profile pencil action with a user icon, removed the redundant profile cancel button, and kept the profile save action right-aligned.
- Fixed transaction saves with an empty optional description by normalizing it to a valid fallback before calling the balance RPC; added a migration to ensure the description constraint is consistent.
- Initialized Supabase CLI, added local `supabase` dev dependency, and documented `db:link`, `db:push`, and `db:status` workflows for running SQL migrations from the project.
- Updated transfer entry so the destination account excludes the selected source account and resets when the source changes.
- Restyled the dashboard `Catat transaksi` button with a stronger CTA treatment, plus icon, hover lift, and improved focus state.
- Improved transfer diagnostics by validating both owned accounts before the RPC, logging the underlying RPC error, and showing a specific message when the transfer function is missing.
- Added transaction deletion with an atomic Supabase RPC that reverses the original income/expense balance impact, plus confirmation and pending UI in transaction history.
- Integrated the supplied Pocketwise logo on the login page, registered the 192px and 512px PWA icons in the manifest, and added the Apple touch icon metadata reference.
- Restored the original inline wallet icon on the login page after deciding not to use the supplied SVG logo in the UI.
- Added persistent dark mode with a theme toggle on the login page, saved theme preference, system-theme detection, and global dark color overrides.
- Moved the dark-mode toggle into the global layout so it is available on every page, and tuned shared light-palette colors for dark-mode contrast.
- Improved dark mode for the quick-access card and transaction CTA, added dark styling for the accounts page background/cards, and moved the global theme toggle to avoid overlapping logout controls.
- Increased dark-mode contrast for the Akses Cepat heading and CTA plus icon, and darkened income/expense transaction icon backgrounds.
- Fixed the hydration mismatch that prevented client interactions by stabilizing the theme toggle's initial render and using Next's `beforeInteractive` script handling.
- Suppressed the intentional root `<html>` class difference caused by applying the saved theme before hydration.
- Removed pre-hydration theme initialization after Android still reported client interaction failures; theme selection now initializes only after hydration to keep the React tree stable.
- Hardened theme toggling for Android/PWA contexts by handling restricted localStorage without preventing the current theme change.
- Allowed the Android LAN origin `192.168.5.197` to load Next.js development resources, including client chunks and HMR.
- Added consistent icon-only edit and delete controls to account cards, with an edit modal and shared Radix alert confirmation backed by ownership-validated server actions.
- Removed temporary theme debugging logs before production use.
- Added a responsive six-month cash-flow chart to the dashboard, showing income and expense bars from transaction data.
- Added mobile-friendly six-month totals for total income, total expense, and net cash flow, with dark-mode card colors.
- Added transaction search across description, account, and category in the history filters.
- Added a Reset button to clear all transaction search and filter parameters.
- Fixed the mobile filter modal so its fields reset visually after using Reset.
- Improved dark-mode contrast for shared confirmation dialogs and edit/filter modal surfaces.
- Declared `zod` as a direct dependency because the application imports it in validation and server actions.
- Started category-based monthly budgets with a Supabase migration, per-user RLS, budget CRUD, and current-month spending progress.
- Integrated budget management into category editing and displayed each expense category's current-month budget on the category card.
- Fixed category budget editing validation: empty budget now clears the current budget, and numeric values update correctly.
- Ensured the category edit modal visibly includes the Budget bulan ini field.
- Made the budget field conditional in the category edit modal; it is hidden when the selected type is Pemasukan.
- Restored the trash-can SVG icon and added explicit dark-mode styling for the desktop transaction filter panel.
- Replaced the account creation page link with an inline dark-mode-compatible account creation modal; retained the old route as a fallback.
- Expanded the dashboard cash-flow chart from 6 to 12 months with responsive twelve-point bar layout and updated period totals.
- Restored the dashboard chart to 6 months and added period insights: monthly average expense, best surplus month, and highest expense month.
- Added `/dashboard/reports` for monthly cashflow summaries, including income, expenses, net cashflow, transaction count, and category expense breakdown.
- Added a visible `Lihat laporan` shortcut to the dashboard quick-access menu.
- Refactored the dashboard into readable helper components and replaced quick-access text arrows with SVG icons.
- Restored the dashboard topbar wallet logo and icon-only Profile/Logout buttons with accessible labels.
- Prepared the Next.js configuration for production by limiting the Android LAN origin to development mode only.
- Improved mobile/PWA theme-toggle touch behavior with a larger touch target, touch manipulation, and a higher non-blocking overlay layer.
- Added migration `007_ensure_transfer_rpc.sql` to recreate and grant the transfer RPC safely when migration history says it is applied but the function is missing.
- Standardized dashboard back navigation with a shared touch-friendly `DashboardBackLink` component and added the initial PWA manifest/theme metadata foundation.
- Fixed Next.js `themeColor` metadata warning by moving it to `viewport`, narrowed Supabase middleware matching to app routes, and added a dashboard loading skeleton for faster perceived navigation.
- Cleaned transaction-history mojibake, restored account/category relation rendering through `relationName`, and simplified the shared back button label to `Kembali`.
- Changed transaction edit/delete actions to accessible icon-only buttons matching category management, kept browser delete confirmation, and simplified mobile transaction cards.
- Added a branded Pocketwise startup splash overlay with wallet icon, light/dark styling, and iOS-compatible app-shell behavior.
- Differentiated dashboard quick-access cards in dark mode with a lighter green surface distinct from the balance card.
- Increased the dark-mode quick-access card contrast further with a brighter green surface and hover state.
- Added the recurring transactions database foundation with weekly/monthly schedules, ownership RLS, and automatic due processing when the dashboard opens.
- Added recurring transaction setup fields to the new transaction form and persist the schedule after creating the initial transaction.
- Added recurring transaction management page with active/inactive toggles, deletion, account/category context, and transaction-history navigation.
- Added a direct dashboard Akses cepat shortcut to the recurring transactions management page.
- Converted recurring schedule actions to compact icon-style pause and delete controls while retaining accessible text labels.
- Added confirmation alerts and pending states for recurring activate/deactivate and delete actions.
- Added current-month budget usage and safe/warning/over-budget indicators directly to category cards.
- Polished category budget progress with percentage labels, color-coded progress bars, status text, and spent totals.
- Added filtered CSV export for transactions with user-scoped data and UTF-8 compatibility.
- Polished transaction page action button layout for clearer responsive grouping and consistent row controls.
- Refined transaction header actions with cohesive SVG icons, shorter labels, and improved responsive spacing.
- Simplified transaction header actions and added dark-mode styling for the mobile filter sheet.
- Removed the mobile filter wrapper container and refined download/add transaction button sizing and alignment.
- Moved the CSV download control beside the transaction filter with responsive desktop-safe sizing.
- Positioned CSV download beside the add-transaction button on desktop while retaining filter adjacency on mobile.
- Fixed CSV export returning headers only by removing the nonexistent `notes` column from its query and rows.
- Made CSV export more readable for everyday users with an Indonesian summary, translated transaction types, readable dates, and clearer headers.
- Restored desktop corner positioning for transaction edit and delete controls without affecting mobile layout.
- Updated the shared back control to return to browser history, with a dashboard fallback for direct visits.
- Limited the custom PWA splash screen to the initial app session so normal client-side navigation does not show it again.
- Polished the PWA splash screen with brand tagline, animated wallet mark, loading indicator, and subtle decorative orbs for light/dark mode.
- Prevented the splash screen light-mode flash by adding an early system dark-mode fallback before the theme class hydrates.
- Fixed splash theme initialization to use the same `theme` storage key as the theme toggle, preventing incorrect light/dark flashes when switching modes.
- Replaced the shared dashboard back-link text arrow with an accessible SVG icon and polished the monthly report month filter styling, including dark mode.
- Aligned desktop transaction edit/delete icons to the far right edge of each card while preserving mobile placement.
- Confirmed transaction edit is better kept as a dedicated page for a full, reliable form; fixed the desktop action wrapper so right-edge positioning is active.
- Moved desktop transaction actions to the lower-right corner to avoid covering the amount; retained the edit flow as a dedicated page.
- Replaced transaction deletion browser confirm with the same Radix alert dialog pattern used for category deletion.
- Cleaned confirmed leftovers: removed the unused browser Supabase client and default create-next-app public assets; retained all database migrations.
- Fixed transaction history relationship rendering so account names display correctly for Supabase object or array responses; transfers now show a clear transfer label instead of appearing category-less.
- Updated transfer RPC so the source records an expense and the destination records income, while balances continue moving atomically.
- Added a login submit loading state with an animated spinner, `Memproses...` label, and disabled submit behavior.
- Replaced mojibake password placeholder, brand symbol, and profile back icon with encoding-safe characters.
- Replaced the remaining corrupted login password placeholder with `Masukkan password`.
- Replaced text-only category controls with icon buttons and applied the wallet SVG logo to the landing page.

## Next steps

- Add account and transaction tables in Supabase/PostgreSQL.
- Build transaction creation and balance calculation flows.
- Add signup UI and email confirmation handling.