import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

async function getOrCreateCart(sessionId: string) {
  let cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId } });
  }
  return cart;
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) return NextResponse.json({ items: [] });

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
  });
  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(req: NextRequest) {
  const { variantId, quantity = 1 } = await req.json();
  if (!variantId) return NextResponse.json({ error: "variantId required" }, { status: 400 });

  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;
  const isNew = !sessionId;
  if (!sessionId) sessionId = uuidv4();

  const cart = await getOrCreateCart(sessionId);

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, variantId, quantity },
  });

  const response = NextResponse.json({ success: true });
  if (isNew) {
    response.cookies.set("cart_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }
  return response;
}

export async function DELETE(req: NextRequest) {
  const { cartItemId } = await req.json();
  if (!cartItemId) return NextResponse.json({ error: "cartItemId required" }, { status: 400 });

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) return NextResponse.json({ error: "No cart" }, { status: 404 });

  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) return NextResponse.json({ error: "No cart" }, { status: 404 });

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cartId: cart.id },
  });
  return NextResponse.json({ success: true });
}
