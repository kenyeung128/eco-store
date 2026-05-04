"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";
import CartLineItem from "@/components/CartLineItem";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  const shipping = totalPrice >= 7500 ? 0 : 499;
  const orderTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 mb-3">Your cart is empty</h1>
        <p className="text-stone-500 text-sm mb-8">
          You haven&apos;t added anything yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-stone-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">
        Your cart
      </h1>
      <p className="text-sm text-stone-400 mb-8">
        {totalItems} item{totalItems !== 1 ? "s" : ""}
      </p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* line items */}
        <div>
          {items.map((item) => (
            <CartLineItem
              key={`${item.productId}-${item.size}-${item.color}`}
              item={item}
            />
          ))}
          <Link
            href="/"
            className="inline-block mt-6 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* order summary */}
        <div className="bg-stone-50 rounded-2xl p-6 sticky top-24">
          <h2 className="text-base font-semibold text-stone-900 mb-5">Order summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>
                Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-stone-400">
                Spend {formatPrice(7500 - totalPrice)} more for free shipping
              </p>
            )}
            <div className="border-t border-stone-200 pt-3 flex justify-between font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full bg-stone-900 text-white text-center py-3.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors active:scale-[0.98]"
          >
            Proceed to Checkout
          </Link>
          <p className="text-xs text-stone-400 text-center mt-3">
            Secure checkout · Free returns · SSL encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
