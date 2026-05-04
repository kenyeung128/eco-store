import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "ECO — Clothing Store",
  description: "Premium clothing, thoughtfully made.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight">ECO</Link>
            <div className="flex gap-6 text-sm items-center">
              <Link href="/products" className="hover:text-gray-500 transition-colors">Shop</Link>
              <Link href="/cart" className="hover:text-gray-500 transition-colors">Cart</Link>
              {session ? (
                <>
                  <Link href="/account/orders" className="hover:text-gray-500 transition-colors">
                    My orders
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="hover:text-gray-500 transition-colors">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="hover:text-gray-500 transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-md bg-gray-900 px-3 py-1.5 text-white text-xs hover:bg-gray-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 text-center text-xs text-gray-400 py-6">
          © {new Date().getFullYear()} ECO. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
