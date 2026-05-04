import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logout } from "@/app/actions/auth";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) redirect("/auth/signin");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-zinc-900">
          ECO
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600">Hi, {user.name}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">Your orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
            <p className="text-zinc-500 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-zinc-200 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                        order.status === "paid" || order.status === "fulfilled"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-sm font-semibold text-zinc-900 mt-1">
                      ${(order.totalCents / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-zinc-100">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-700">
                        {item.product.name} &mdash; {item.variantSize} / {item.variantColor} &times;{" "}
                        {item.quantity}
                      </span>
                      <span className="text-zinc-500">
                        ${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
