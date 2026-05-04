"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingBag } from "./icons";

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
          ECO
        </Link>
        <nav className="hidden md:flex gap-8 text-sm text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">Shop</Link>
          <Link href="/?category=Tops" className="hover:text-stone-900 transition-colors">Tops</Link>
          <Link href="/?category=Bottoms" className="hover:text-stone-900 transition-colors">Bottoms</Link>
          <Link href="/?category=Dresses" className="hover:text-stone-900 transition-colors">Dresses</Link>
          <Link href="/?category=Outerwear" className="hover:text-stone-900 transition-colors">Outerwear</Link>
        </nav>
        <Link href="/cart" className="relative flex items-center gap-1.5 text-stone-700 hover:text-stone-900 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
          <span className="text-sm hidden sm:inline">Cart</span>
        </Link>
      </div>
    </header>
  );
}
