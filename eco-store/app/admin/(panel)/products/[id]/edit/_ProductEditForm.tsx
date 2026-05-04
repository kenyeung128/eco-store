"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/app/actions/admin";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    images: string;
  };
  updateAction: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
};

export function ProductEditForm({ product, updateAction }: Props) {
  const [state, action, pending] = useActionState(updateAction, undefined);

  const images = (() => {
    try {
      const arr = JSON.parse(product.images);
      return Array.isArray(arr) ? arr.join("\n") : "";
    } catch {
      return "";
    }
  })();

  return (
    <form action={action} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5 max-w-2xl">
      {state?.message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          {state.message}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          required
          defaultValue={product.name}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Slug (URL)</label>
        <input
          name="slug"
          defaultValue={product.slug}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product.description}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Price (USD) <span className="text-red-500">*</span>
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={(product.price / 100).toFixed(2)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        />
        {state?.errors?.price && (
          <p className="mt-1 text-xs text-red-600">{state.errors.price[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          required
          defaultValue={product.category}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        >
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="outerwear">Outerwear</option>
          <option value="dresses">Dresses</option>
        </select>
        {state?.errors?.category && (
          <p className="mt-1 text-xs text-red-600">{state.errors.category[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Image URLs <span className="text-zinc-400 font-normal">(one per line)</span>
        </label>
        <textarea
          name="images"
          rows={3}
          defaultValue={images}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
