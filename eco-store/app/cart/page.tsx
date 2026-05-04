"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCents } from "@/lib/format";

interface CartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    color: string;
    product: {
      id: string;
      name: string;
      price: number;
      slug: string;
      category: string;
    };
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function removeItem(cartItemId: string) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId }),
    });
    fetchCart();
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <Link
          href="/products"
          className="text-sm font-medium text-gray-900 underline"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <ul className="divide-y divide-gray-100 mb-8">
        {items.map((item) => (
          <li key={item.id} className="py-4 flex gap-4 items-start">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
              {categoryEmoji(item.variant.product.category)}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.variant.product.slug}`}
                className="font-medium hover:underline"
              >
                {item.variant.product.name}
              </Link>
              <p className="text-sm text-gray-400">
                {item.variant.color} · {item.variant.size}
              </p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCents(item.variant.product.price * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-gray-400 hover:text-red-500 mt-1"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between font-semibold text-lg">
          <span>Subtotal</span>
          <span>{formatCents(subtotal)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Shipping and taxes calculated at checkout</p>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-gray-900 text-white text-center py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}

function categoryEmoji(cat: string) {
  const map: Record<string, string> = {
    tops: "👕",
    bottoms: "👖",
    outerwear: "🧥",
    dresses: "👗",
  };
  return map[cat] ?? "🛍️";
}
