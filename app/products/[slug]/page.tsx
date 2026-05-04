import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, formatPrice, products } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← Back to shop
      </Link>
      <div className="grid md:grid-cols-2 gap-10 mt-4">
        {/* image */}
        <div className="aspect-[3/4] bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl flex items-end p-6">
          <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* details */}
        <div className="flex flex-col gap-6 py-2">
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">
              {product.category}
            </p>
            <h1 className="text-2xl font-semibold text-stone-900">{product.name}</h1>
            <p className="text-xl text-stone-700 mt-2">{formatPrice(product.price)}</p>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">{product.description}</p>

          {inStock ? (
            <AddToCartButton product={product} />
          ) : (
            <div className="py-3.5 rounded-xl bg-stone-100 text-center text-sm font-medium text-stone-400">
              Out of Stock
            </div>
          )}

          <div className="border-t border-stone-100 pt-4 text-xs text-stone-400 space-y-1">
            <p>Free shipping on orders over $75</p>
            <p>Easy returns within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
