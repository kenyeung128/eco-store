import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ECO — Sustainable Clothing",
  description: "Shop conscious clothing. Sustainable materials, timeless style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-stone-900 antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-stone-200 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-400">
            © {new Date().getFullYear()} ECO. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
