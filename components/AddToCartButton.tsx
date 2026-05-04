"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Product, Variant } from "@/lib/products";

type Props = {
  product: Product;
};

export default function AddToCartButton({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const selectedVariant: Variant | undefined = product.variants.find(
    (v) => v.size === selectedSize
  );
  const outOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  function handleAdd() {
    if (!selectedSize) return;
    if (outOfStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedVariant?.color ?? "",
      image: product.images[0] ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-stone-700 mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const variant = product.variants.find((v) => v.size === size);
            const soldOut = variant?.stock === 0;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={soldOut}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                  ${selectedSize === size
                    ? "border-stone-900 bg-stone-900 text-white"
                    : soldOut
                    ? "border-stone-200 text-stone-300 cursor-not-allowed line-through"
                    : "border-stone-300 text-stone-700 hover:border-stone-900"
                  }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={!selectedSize || outOfStock}
        className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all
          ${added
            ? "bg-green-600 text-white"
            : !selectedSize || outOfStock
            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
            : "bg-stone-900 text-white hover:bg-stone-700 active:scale-[0.98]"
          }`}
      >
        {added ? "Added to cart ✓" : outOfStock ? "Out of Stock" : !selectedSize ? "Select a size" : "Add to Cart"}
      </button>
    </div>
  );
}
