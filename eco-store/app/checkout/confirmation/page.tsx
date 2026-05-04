"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Order {
  id: string;
  orderNumber: string;
  email: string;
  totalCents: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    variantSize: string;
    variantColor: string;
    quantity: number;
    unitPriceCents: number;
    product: { name: string };
  }>;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get("payment_intent");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!paymentIntentId) {
      router.push("/");
      return;
    }

    // Poll for order (webhook may take a moment)
    let attempts = 0;
    const poll = async () => {
      const res = await fetch(`/api/orders/by-payment-intent/${paymentIntentId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setLoading(false);
      } else if (attempts < 5) {
        attempts++;
        setTimeout(poll, 1500);
      } else {
        setNotFound(true);
        setLoading(false);
      }
    };
    poll();
  }, [paymentIntentId, router]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-400">
        Confirming your order…
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">
          Payment received — your order is being processed. You'll receive an
          email confirmation shortly.
        </p>
        <Link href="/products" className="text-sm font-medium underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Order confirmed!</h1>
        <p className="text-gray-500">
          Thanks! We've received your order and will send a confirmation to{" "}
          <strong>{order.email}</strong>.
        </p>
      </div>

      <div className="border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">Order</span>
          <span className="font-medium">{order.orderNumber}</span>
        </div>
        <ul className="space-y-2 text-sm mb-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product.name} × {item.quantity}
                <span className="text-gray-400 ml-1">
                  ({item.variantColor}, {item.variantSize})
                </span>
              </span>
              <span>
                ${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${(order.totalCents / 100).toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/products"
        className="block w-full text-center bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-400">
          Loading…
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
