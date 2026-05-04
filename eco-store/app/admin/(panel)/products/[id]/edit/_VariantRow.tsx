"use client";

import { useActionState } from "react";
import type { VariantFormState } from "@/app/actions/admin";

type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

type Props = {
  variant: Variant;
  updateAction: (state: VariantFormState, formData: FormData) => Promise<VariantFormState>;
  deleteAction: () => Promise<void>;
};

export function VariantRow({ variant, updateAction, deleteAction }: Props) {
  const [state, action, pending] = useActionState(updateAction, undefined);

  return (
    <form action={action} className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Size</label>
            <input
              name="size"
              defaultValue={variant.size}
              className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Color</label>
            <input
              name="color"
              defaultValue={variant.color}
              className="w-28 rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={variant.stock}
              className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div className="pt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50 transition-colors"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <form action={deleteAction}>
              <button
                type="submit"
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
                onClick={(e) => {
                  if (!confirm("Delete this variant?")) e.preventDefault();
                }}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        {(state?.errors?.size || state?.errors?.color || state?.errors?.stock) && (
          <p className="mt-1 text-xs text-red-600">
            {state.errors?.size?.[0] || state.errors?.color?.[0] || state.errors?.stock?.[0]}
          </p>
        )}
      </div>
    </form>
  );
}
