"use client";

import { useActionState, useRef } from "react";
import type { VariantFormState } from "@/app/actions/admin";

type Props = {
  addAction: (state: VariantFormState, formData: FormData) => Promise<VariantFormState>;
};

export function AddVariantForm({ addAction }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function actionWithReset(state: VariantFormState, formData: FormData) {
    const result = await addAction(state, formData);
    if (!result?.errors) {
      formRef.current?.reset();
    }
    return result;
  }

  const [state, action, pending] = useActionState(actionWithReset, undefined);

  return (
    <form ref={formRef} action={action} className="flex items-start gap-3 pt-4 flex-wrap">
      <div>
        <label className="block text-xs text-zinc-500 mb-0.5">Size</label>
        <input
          name="size"
          placeholder="M"
          className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
        {state?.errors?.size && (
          <p className="mt-0.5 text-xs text-red-600">{state.errors.size[0]}</p>
        )}
      </div>
      <div>
        <label className="block text-xs text-zinc-500 mb-0.5">Color</label>
        <input
          name="color"
          placeholder="Black"
          className="w-28 rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
        {state?.errors?.color && (
          <p className="mt-0.5 text-xs text-red-600">{state.errors.color[0]}</p>
        )}
      </div>
      <div>
        <label className="block text-xs text-zinc-500 mb-0.5">Stock</label>
        <input
          name="stock"
          type="number"
          min="0"
          defaultValue="0"
          className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
        {state?.errors?.stock && (
          <p className="mt-0.5 text-xs text-red-600">{state.errors.stock[0]}</p>
        )}
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-600 disabled:opacity-60 transition-colors"
        >
          {pending ? "Adding…" : "+ Add variant"}
        </button>
      </div>
    </form>
  );
}
