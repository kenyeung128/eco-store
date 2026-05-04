import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear"];

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const filtered =
    !category || category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-stone-900 mb-1">Shop</h1>
        <p className="text-stone-500 text-sm">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const active = (category ?? "All") === cat;
          return (
            <a
              key={cat}
              href={cat === "All" ? "/" : `/?category=${cat}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                ${active
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
                }`}
            >
              {cat}
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
