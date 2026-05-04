import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) {
    sessionId = uuidv4();
  }
  return sessionId;
}

export async function getCart(sessionId: string) {
  return prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });
}

export function cartTotal(cart: Awaited<ReturnType<typeof getCart>>) {
  if (!cart) return 0;
  return cart.items.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0
  );
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
