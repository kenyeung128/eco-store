"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProduct } from "@/app/actions/admin";

export default function NewProductPage() {
  const [state, action, pending] = useActionState(createProduct, undefined);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Products
        </Link>
        <span className="text-zinc-300">/</span>
        <h1 className="text-xl font-semibold text-zinc-900">New product</h1>
      </div>

      {state?.message && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          {state.message}
        </p>
      )}

      <form action={action} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5 max-w-2xl">
        <ProductFields state={state} />
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 transition-colors"
          >
            {pending ? "Creating…" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProductFields({ state }: { state: Parameters<typeof createProduct>[0] }) {
  return (
    <>
      <Field label="Name" name="name" required error={state?.errors?.name?.[0]} />
      <Field label="Slug (URL)" name="slug" placeholder="auto-generated from name" />
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
        />
      </div>
      <Field
        label="Price (USD)"
        name="price"
        type="number"
        step="0.01"
        min="0"
        placeholder="29.99"
        required
        error={state?.errors?.price?.[0]}
      />
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        >
          <option value="">Select…</option>
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
          placeholder="https://example.com/image1.jpg"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
        />
      </div>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  placeholder,
  step,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        step={step}
        min={min}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
