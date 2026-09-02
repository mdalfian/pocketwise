import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pocketwise — Keuangan lebih jelas",
  description: "Cara yang lebih tenang untuk mengatur dan memahami uangmu.",
  manifest: "/manifest.webmanifest",
  applicationName: "Pocketwise",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pocketwise",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#173d2b" },
    { media: "(prefers-color-scheme: dark)", color: "#173d2b" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head><Script id="theme-init" strategy="beforeInteractive">{`try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`}</Script></head>
      <body className="min-h-full flex flex-col"><div className="fixed bottom-4 right-4 z-[9999]"><ThemeToggle /></div>{children}</body>
    </html>
  );
}
