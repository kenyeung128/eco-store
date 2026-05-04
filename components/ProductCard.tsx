import Link from "next/link";
import { Product, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden mb-3 relative">
        {/* placeholder colour block since we have no real images */}
        <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-end p-4">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium text-stone-500">Sold Out</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-stone-900 group-hover:underline">
          {product.name}
        </h3>
        <p className="text-sm text-stone-500 mt-0.5">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
