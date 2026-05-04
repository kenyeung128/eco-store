import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  const { paymentIntentId, shipping } = await req.json();
  if (!paymentIntentId || !shipping) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: {
      email: shipping.email,
      shippingName: shipping.name,
      shippingAddressLine1: shipping.line1,
      shippingAddressLine2: shipping.line2 ?? "",
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingPostalCode: shipping.postalCode,
      shippingCountry: shipping.country,
    },
  });

  return NextResponse.json({ success: true });
}
