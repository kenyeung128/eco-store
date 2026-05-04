import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

function generateOrderNumber(): string {
  return "ECO-" + Date.now().toString(36).toUpperCase();
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await handlePaymentSuccess(pi);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(pi: Stripe.PaymentIntent) {
  const existing = await prisma.order.findUnique({
    where: { stripePaymentIntentId: pi.id },
  });
  if (existing) return; // idempotent

  const meta = pi.metadata;
  const lineItems: Array<{
    productId: string;
    variantSize: string;
    variantColor: string;
    quantity: number;
    unitPriceCents: number;
  }> = JSON.parse(meta.lineItems ?? "[]");

  await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      ...(meta.userId ? { userId: meta.userId } : {}),
      email: meta.email ?? "",
      shippingName: meta.shippingName ?? "",
      shippingAddressLine1: meta.shippingAddressLine1 ?? "",
      shippingAddressLine2: meta.shippingAddressLine2 ?? null,
      shippingCity: meta.shippingCity ?? "",
      shippingState: meta.shippingState ?? "",
      shippingPostalCode: meta.shippingPostalCode ?? "",
      shippingCountry: meta.shippingCountry ?? "US",
      subtotalCents: Number(meta.subtotalCents),
      shippingCents: Number(meta.shippingCents),
      taxCents: Number(meta.taxCents),
      totalCents: pi.amount,
      stripePaymentIntentId: pi.id,
      status: "paid",
      items: {
        create: lineItems.map((li) => ({
          productId: li.productId,
          variantSize: li.variantSize,
          variantColor: li.variantColor,
          quantity: li.quantity,
          unitPriceCents: li.unitPriceCents,
        })),
      },
    },
  });

  // Clear the cart
  const cartSessionId = meta.cartSessionId;
  if (cartSessionId) {
    const cart = await prisma.cart.findUnique({ where: { sessionId: cartSessionId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }
}
