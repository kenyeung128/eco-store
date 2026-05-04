"use client";

import { useCartStore, CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";
import { Minus, Plus, Trash } from "./icons";

export default function CartLineItem({ item }: { item: CartItem }) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex gap-4 py-5 border-b border-stone-100">
      {/* image placeholder */}
      <div className="w-20 h-24 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-sm font-medium text-stone-900 truncate">{item.name}</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {item.color} · {item.size}
            </p>
          </div>
          <p className="text-sm font-medium text-stone-900 shrink-0">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 border border-stone-200 rounded-lg">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
              }
              className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-stone-900">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
              }
              className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.size, item.color)}
            className="text-stone-400 hover:text-red-500 transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
