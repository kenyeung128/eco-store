"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { formatCents } from "@/lib/format";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CartItem {
  id: string;
  quantity: number;
  variant: {
    size: string;
    color: string;
    product: { name: string; price: number; category: string };
  };
}

interface CheckoutSummary {
  clientSecret: string;
  paymentIntentId: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

type Step = "shipping" | "review" | "payment";

interface ShippingForm {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const EMPTY_SHIPPING: ShippingForm = {
  email: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("shipping");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<ShippingForm>(EMPTY_SHIPPING);
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        if (!data.items || data.items.length === 0) {
          router.push("/cart");
        } else {
          setCartItems(data.items);
        }
        setLoading(false);
      });
  }, [router]);

  async function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("review");
  }

  async function handleReviewSubmit() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.clientSecret) {
      setSummary(data);
      setStep("payment");
    }
    setLoading(false);
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0
  );

  if (loading && step === "shipping") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Progress */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        {(["shipping", "review", "payment"] as Step[]).map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            {i > 0 && <span>›</span>}
            <span
              className={
                step === s
                  ? "text-gray-900 font-medium"
                  : "capitalize"
              }
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </span>
        ))}
      </nav>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Left: form area */}
        <div className="md:col-span-3">
          {step === "shipping" && (
            <ShippingStep
              shipping={shipping}
              onChange={setShipping}
              onSubmit={handleShippingSubmit}
            />
          )}
          {step === "review" && (
            <ReviewStep
              cartItems={cartItems}
              shipping={shipping}
              subtotal={subtotal}
              onBack={() => setStep("shipping")}
              onConfirm={handleReviewSubmit}
              loading={loading}
            />
          )}
          {step === "payment" && summary && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: summary.clientSecret }}
            >
              <PaymentStep
                summary={summary}
                shipping={shipping}
                paymentIntentId={summary.paymentIntentId}
                onBack={() => setStep("review")}
              />
            </Elements>
          )}
        </div>

        {/* Right: order summary */}
        <aside className="md:col-span-2 bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Order summary</h2>
          <ul className="space-y-2 text-sm mb-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.variant.product.name} × {item.quantity}
                  <br />
                  <span className="text-xs text-gray-400">
                    {item.variant.color} · {item.variant.size}
                  </span>
                </span>
                <span>{formatCents(item.variant.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCents(summary?.subtotalCents ?? subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{summary ? formatCents(summary.shippingCents) : "—"}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>{summary ? formatCents(summary.taxCents) : "—"}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{summary ? formatCents(summary.totalCents) : "—"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShippingStep({
  shipping,
  onChange,
  onSubmit,
}: {
  shipping: ShippingForm;
  onChange: (s: ShippingForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  function field(key: keyof ShippingForm) {
    return {
      value: shipping[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange({ ...shipping, [key]: e.target.value }),
    };
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">Shipping address</h2>
      <InputField label="Email" type="email" required {...field("email")} />
      <InputField label="Full name" required {...field("name")} />
      <InputField label="Address line 1" required {...field("line1")} />
      <InputField label="Address line 2 (optional)" {...field("line2")} />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="City" required {...field("city")} />
        <InputField label="State / Province" required {...field("state")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Postal code" required {...field("postalCode")} />
        <InputField label="Country" required {...field("country")} />
      </div>
      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors mt-2"
      >
        Continue to review
      </button>
    </form>
  );
}

function ReviewStep({
  cartItems,
  shipping,
  subtotal,
  onBack,
  onConfirm,
  loading,
}: {
  cartItems: CartItem[];
  shipping: ShippingForm;
  subtotal: number;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Review your order</h2>
      <section className="mb-6 p-4 border border-gray-200 rounded-xl">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
          Shipping to
        </p>
        <p className="text-sm">{shipping.name}</p>
        <p className="text-sm">{shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ""}</p>
        <p className="text-sm">{shipping.city}, {shipping.state} {shipping.postalCode}</p>
        <p className="text-sm">{shipping.country}</p>
        <p className="text-sm text-gray-500 mt-1">{shipping.email}</p>
      </section>

      <section className="mb-8 p-4 border border-gray-200 rounded-xl">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
          Items ({cartItems.length})
        </p>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>
              {item.variant.product.name} × {item.quantity}{" "}
              <span className="text-gray-400">
                ({item.variant.color}, {item.variant.size})
              </span>
            </span>
            <span>{formatCents(item.variant.product.price * item.quantity)}</span>
          </div>
        ))}
      </section>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 py-3 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Loading…" : "Continue to payment"}
        </button>
      </div>
    </div>
  );
}

function PaymentStep({
  summary,
  shipping,
  paymentIntentId,
  onBack,
}: {
  summary: CheckoutSummary;
  shipping: ShippingForm;
  paymentIntentId: string;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg(null);

    // Update payment intent metadata with shipping info before confirming
    await fetch("/api/checkout/update-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId, shipping }),
    });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation?payment_intent=${paymentIntentId}`,
      },
    });

    if (error) {
      setErrorMsg(error.message ?? "Payment failed");
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6">Payment</h2>
      <p className="text-sm text-gray-500 mb-4">
        Total: <strong>{formatCents(summary.totalCents)}</strong>
      </p>
      <div className="mb-6">
        <PaymentElement />
      </div>
      {errorMsg && (
        <p className="text-sm text-red-600 mb-4">{errorMsg}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 py-3 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={processing || !stripe}
          className="flex-1 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {processing ? "Processing…" : `Pay ${formatCents(summary.totalCents)}`}
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">
        Powered by Stripe · Test mode
      </p>
    </form>
  );
}

function InputField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 mb-1 block">{label}</span>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </label>
  );
}
