"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/format";

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;
  variants: Variant[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const selectedColor = selectedVariant?.color ?? colors[0];
  const sizesForColor = product.variants.filter(
    (v) => v.color === selectedColor
  );

  async function addToCart() {
    if (!selectedVariant) return;
    setAdding(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: selectedVariant.id, quantity: 1 }),
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 mb-6 hover:text-gray-700"
      >
        ← Back
      </button>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-8xl">
          {categoryEmoji(product.category)}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">
            {formatCents(product.price)}
          </p>
          <p className="text-gray-500 mb-6">{product.description}</p>

          {/* Color selector */}
          {colors.length > 1 && (
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide mb-2">
                Color — {selectedColor}
              </p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      const variant = product.variants.find(
                        (v) => v.color === c
                      );
                      if (variant) setSelectedVariant(variant);
                    }}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      selectedColor === c
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide mb-2">
              Size
            </p>
            <div className="flex gap-2 flex-wrap">
              {sizesForColor.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  disabled={v.stock === 0}
                  className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                    selectedVariant?.id === v.id
                      ? "bg-gray-900 text-white border-gray-900"
                      : v.stock === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={adding || !selectedVariant || selectedVariant.stock === 0}
            className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added
              ? "Added ✓"
              : adding
              ? "Adding…"
              : selectedVariant?.stock === 0
              ? "Out of stock"
              : "Add to cart"}
          </button>
        </div>
      </div>
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
