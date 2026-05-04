import Link from "next/link";
import { adminLogout } from "@/app/actions/admin-auth";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-zinc-200 px-4">
        <div className="max-w-5xl mx-auto h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-zinc-900">Admin</span>
            <Link
              href="/admin/products"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Orders
            </Link>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
