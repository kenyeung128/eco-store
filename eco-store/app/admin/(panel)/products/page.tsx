import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { deleteProduct } from "@/app/actions/admin";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          + New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-zinc-500">No products yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => {
                const deleteAction = deleteProduct.bind(null, p.id);
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{p.name}</td>
                    <td className="px-4 py-3 text-zinc-500 capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-zinc-500">{formatCents(p.price)}</td>
                    <td className="px-4 py-3 text-zinc-500">{p.variants.length}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <form action={deleteAction}>
                          <button
                            type="submit"
                            className="text-red-500 hover:text-red-700 transition-colors"
                            onClick={(e) => {
                              if (!confirm(`Delete "${p.name}"?`)) e.preventDefault();
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
