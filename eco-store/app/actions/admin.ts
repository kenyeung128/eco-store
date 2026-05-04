"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";

async function requireAdmin() {
  const ok = await getAdminSession();
  if (!ok) throw new Error("Unauthorized");
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── Products ─────────────────────────────────────────────────────────────────

export type ProductFormState =
  | { errors?: { name?: string[]; price?: string[]; category?: string[] }; message?: string }
  | undefined;

export async function createProduct(
  state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const imagesStr = ((formData.get("images") as string) ?? "").trim();

  if (!name) return { errors: { name: ["Name is required"] } };
  if (!priceStr || isNaN(parseFloat(priceStr)) || parseFloat(priceStr) < 0)
    return { errors: { price: ["Valid price is required"] } };
  if (!category) return { errors: { category: ["Category is required"] } };

  const baseSlug = slugInput || toSlug(name);
  let slug = baseSlug;
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = baseSlug + "-" + Date.now().toString(36);

  const price = Math.round(parseFloat(priceStr) * 100);
  const images = imagesStr
    ? imagesStr.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const product = await prisma.product.create({
    data: { name, slug, description, price, category, images: JSON.stringify(images) },
  });

  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProduct(
  id: string,
  state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const imagesStr = ((formData.get("images") as string) ?? "").trim();

  if (!name) return { errors: { name: ["Name is required"] } };
  if (!priceStr || isNaN(parseFloat(priceStr)) || parseFloat(priceStr) < 0)
    return { errors: { price: ["Valid price is required"] } };
  if (!category) return { errors: { category: ["Category is required"] } };

  const slug = slugInput || toSlug(name);
  const price = Math.round(parseFloat(priceStr) * 100);
  const images = imagesStr
    ? imagesStr.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  await prisma.product.update({
    where: { id },
    data: { name, slug, description, price, category, images: JSON.stringify(images) },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  return { message: "Saved." };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const variants = await prisma.variant.findMany({ where: { productId: id } });
  const variantIds = variants.map((v) => v.id);

  await prisma.cartItem.deleteMany({ where: { variantId: { in: variantIds } } });
  await prisma.variant.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  redirect("/admin/products");
}

// ── Variants ──────────────────────────────────────────────────────────────────

export type VariantFormState =
  | { errors?: { size?: string[]; color?: string[]; stock?: string[] } }
  | undefined;

export async function addVariant(
  productId: string,
  state: VariantFormState,
  formData: FormData
): Promise<VariantFormState> {
  await requireAdmin();

  const size = (formData.get("size") as string)?.trim();
  const color = (formData.get("color") as string)?.trim();
  const stockStr = (formData.get("stock") as string)?.trim();

  if (!size) return { errors: { size: ["Size is required"] } };
  if (!color) return { errors: { color: ["Color is required"] } };
  const stock = parseInt(stockStr ?? "0", 10);
  if (isNaN(stock) || stock < 0) return { errors: { stock: ["Valid stock count required"] } };

  await prisma.variant.create({ data: { productId, size, color, stock } });
  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function updateVariant(
  id: string,
  productId: string,
  state: VariantFormState,
  formData: FormData
): Promise<VariantFormState> {
  await requireAdmin();

  const size = (formData.get("size") as string)?.trim();
  const color = (formData.get("color") as string)?.trim();
  const stockStr = (formData.get("stock") as string)?.trim();

  if (!size) return { errors: { size: ["Size is required"] } };
  if (!color) return { errors: { color: ["Color is required"] } };
  const stock = parseInt(stockStr ?? "0", 10);
  if (isNaN(stock) || stock < 0) return { errors: { stock: ["Valid stock count required"] } };

  await prisma.variant.update({ where: { id }, data: { size, color, stock } });
  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteVariant(id: string, productId: string) {
  await requireAdmin();

  await prisma.cartItem.deleteMany({ where: { variantId: id } });
  await prisma.variant.delete({ where: { id } });
  revalidatePath(`/admin/products/${productId}/edit`);
}

// ── Orders ────────────────────────────────────────────────────────────────────

const VALID_STATUSES = ["pending", "paid", "fulfilled", "cancelled"] as const;

export async function updateOrderStatus(id: string, formData: FormData) {
  await requireAdmin();

  const status = formData.get("status") as string;
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
