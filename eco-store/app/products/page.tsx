import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
              <span className="text-5xl">{categoryEmoji(product.category)}</span>
            </div>
            <div className="text-sm font-medium group-hover:underline">{product.name}</div>
            <div className="text-sm text-gray-500">{formatCents(product.price)}</div>
          </Link>
        ))}
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
