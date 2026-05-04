import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const SHIPPING_CENTS = 599;
const TAX_RATE = 0.08875; // 8.875% (NY rate)

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;
  const authSession = await getSession();
  if (!sessionId) {
    return NextResponse.json({ error: "No cart session" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0
  );
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + SHIPPING_CENTS + taxCents;

  const lineItems = cart.items.map((item) => ({
    productId: item.variant.product.id,
    productName: item.variant.product.name,
    variantId: item.variant.id,
    variantSize: item.variant.size,
    variantColor: item.variant.color,
    quantity: item.quantity,
    unitPriceCents: item.variant.product.price,
  }));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "usd",
    metadata: {
      cartSessionId: sessionId,
      subtotalCents: String(subtotalCents),
      shippingCents: String(SHIPPING_CENTS),
      taxCents: String(taxCents),
      lineItems: JSON.stringify(lineItems),
      ...(authSession?.userId ? { userId: authSession.userId } : {}),
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    subtotalCents,
    shippingCents: SHIPPING_CENTS,
    taxCents,
    totalCents,
  });
}
