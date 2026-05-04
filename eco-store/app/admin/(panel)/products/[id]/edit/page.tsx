import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateProduct, addVariant, deleteVariant, updateVariant } from "@/app/actions/admin";
import { ProductEditForm } from "./_ProductEditForm";
import { AddVariantForm } from "./_AddVariantForm";
import { VariantRow } from "./_VariantRow";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { size: "asc" } } },
  });
  if (!product) notFound();

  const updateProductAction = updateProduct.bind(null, product.id);
  const addVariantAction = addVariant.bind(null, product.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Products
        </Link>
        <span className="text-zinc-300">/</span>
        <h1 className="text-xl font-semibold text-zinc-900">{product.name}</h1>
      </div>

      <section>
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">
          Product details
        </h2>
        <ProductEditForm product={product} updateAction={updateProductAction} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">
          Variants ({product.variants.length})
        </h2>
        <div className="bg-white rounded-xl border border-zinc-200 px-4">
          {product.variants.length === 0 ? (
            <p className="py-4 text-sm text-zinc-400">No variants yet.</p>
          ) : (
            product.variants.map((v) => {
              const updateVariantAction = updateVariant.bind(null, v.id, product.id);
              const deleteVariantAction = deleteVariant.bind(null, v.id, product.id);
              return (
                <VariantRow
                  key={v.id}
                  variant={v}
                  updateAction={updateVariantAction}
                  deleteAction={deleteVariantAction}
                />
              );
            })
          )}
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 px-4 py-4 mt-3">
          <p className="text-xs font-medium text-zinc-500 mb-3">Add variant</p>
          <AddVariantForm addAction={addVariantAction} />
        </div>
      </section>
    </div>
  );
}
