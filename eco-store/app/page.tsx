import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6 tracking-tight">
        Clothes that last.
      </h1>
      <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
        Premium essentials designed for everyday life. Made with care, built to
        endure.
      </p>
      <Link
        href="/products"
        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Shop now
      </Link>
    </div>
  );
}
