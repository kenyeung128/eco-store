import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { updateOrderStatus } from "@/app/actions/admin";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  fulfilled: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const updateAction = updateOrderStatus.bind(null, order.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Orders
        </Link>
        <span className="text-zinc-300">/</span>
        <h1 className="text-xl font-semibold text-zinc-900">{order.orderNumber}</h1>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? ""}`}
        >
          {order.status}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
          Update status
        </h2>
        <form action={updateAction} className="flex items-center gap-3">
          <select
            name="status"
            defaultValue={order.status}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Save
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
          Customer & shipping
        </h2>
        <dl className="space-y-1 text-sm">
          <Row label="Name" value={order.shippingName} />
          <Row label="Email" value={order.email} />
          <Row
            label="Address"
            value={[
              order.shippingAddressLine1,
              order.shippingAddressLine2,
              `${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}`,
              order.shippingCountry,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Items</h2>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 text-zinc-900 font-medium">
                  {item.product.name}
                  <span className="ml-2 text-xs text-zinc-400">
                    {item.variantSize} / {item.variantColor}
                  </span>
                </td>
                <td className="px-5 py-3 text-zinc-500 text-right">×{item.quantity}</td>
                <td className="px-5 py-3 text-zinc-700 text-right">
                  {formatCents(item.unitPriceCents * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-zinc-200 bg-zinc-50 text-sm">
            <tr>
              <td colSpan={2} className="px-5 py-2 text-zinc-500">Subtotal</td>
              <td className="px-5 py-2 text-right text-zinc-700">{formatCents(order.subtotalCents)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="px-5 py-2 text-zinc-500">Shipping</td>
              <td className="px-5 py-2 text-right text-zinc-700">{formatCents(order.shippingCents)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="px-5 py-2 text-zinc-500">Tax</td>
              <td className="px-5 py-2 text-right text-zinc-700">{formatCents(order.taxCents)}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={2} className="px-5 py-3 text-zinc-900">Total</td>
              <td className="px-5 py-3 text-right text-zinc-900">{formatCents(order.totalCents)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-20 text-zinc-400 shrink-0">{label}</dt>
      <dd className="text-zinc-700">{value}</dd>
    </div>
  );
}
