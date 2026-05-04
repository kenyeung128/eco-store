import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> }
) {
  const { paymentIntentId } = await params;
  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: {
      items: { include: { product: true } },
    },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
