export type Variant = {
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // cents
  images: string[];
  variants: Variant[];
  category: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "classic-white-tee",
    name: "Classic White Tee",
    description: "A timeless essential. 100% organic cotton, relaxed fit, perfect for any occasion.",
    price: 2900,
    images: ["/images/tee-white.jpg"],
    category: "Tops",
    variants: [
      { size: "XS", color: "White", stock: 10 },
      { size: "S", color: "White", stock: 15 },
      { size: "M", color: "White", stock: 20 },
      { size: "L", color: "White", stock: 12 },
      { size: "XL", color: "White", stock: 8 },
    ],
  },
  {
    id: "2",
    slug: "slim-black-jeans",
    name: "Slim Black Jeans",
    description: "Stretch denim in a slim straight cut. All-day comfort, night-out style.",
    price: 7900,
    images: ["/images/jeans-black.jpg"],
    category: "Bottoms",
    variants: [
      { size: "28", color: "Black", stock: 8 },
      { size: "30", color: "Black", stock: 12 },
      { size: "32", color: "Black", stock: 14 },
      { size: "34", color: "Black", stock: 10 },
      { size: "36", color: "Black", stock: 5 },
    ],
  },
  {
    id: "3",
    slug: "linen-summer-dress",
    name: "Linen Summer Dress",
    description: "Breathable linen blend. Midi length, adjustable straps, relaxed silhouette.",
    price: 8900,
    images: ["/images/dress-linen.jpg"],
    category: "Dresses",
    variants: [
      { size: "XS", color: "Sand", stock: 5 },
      { size: "S", color: "Sand", stock: 9 },
      { size: "M", color: "Sand", stock: 11 },
      { size: "L", color: "Sand", stock: 7 },
    ],
  },
  {
    id: "4",
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    description: "Ultra-soft fleece. Dropped shoulders, kangaroo pocket, unisex sizing.",
    price: 6900,
    images: ["/images/hoodie-grey.jpg"],
    category: "Tops",
    variants: [
      { size: "S", color: "Charcoal", stock: 10 },
      { size: "M", color: "Charcoal", stock: 18 },
      { size: "L", color: "Charcoal", stock: 15 },
      { size: "XL", color: "Charcoal", stock: 10 },
    ],
  },
  {
    id: "5",
    slug: "tailored-blazer",
    name: "Tailored Blazer",
    description: "Single-button, fully lined. Wear over a tee or with matching trousers.",
    price: 14900,
    images: ["/images/blazer-navy.jpg"],
    category: "Outerwear",
    variants: [
      { size: "XS", color: "Navy", stock: 4 },
      { size: "S", color: "Navy", stock: 6 },
      { size: "M", color: "Navy", stock: 8 },
      { size: "L", color: "Navy", stock: 6 },
      { size: "XL", color: "Navy", stock: 3 },
    ],
  },
  {
    id: "6",
    slug: "wide-leg-trousers",
    name: "Wide-Leg Trousers",
    description: "High-rise wide leg. Crepe fabric that drapes beautifully.",
    price: 9500,
    images: ["/images/trousers-camel.jpg"],
    category: "Bottoms",
    variants: [
      { size: "XS", color: "Camel", stock: 6 },
      { size: "S", color: "Camel", stock: 8 },
      { size: "M", color: "Camel", stock: 10 },
      { size: "L", color: "Camel", stock: 7 },
    ],
  },
  {
    id: "7",
    slug: "stripe-breton-top",
    name: "Stripe Breton Top",
    description: "Navy and cream stripe. Boat neck, three-quarter sleeves, French inspired.",
    price: 4500,
    images: ["/images/breton-stripe.jpg"],
    category: "Tops",
    variants: [
      { size: "XS", color: "Navy/Cream", stock: 7 },
      { size: "S", color: "Navy/Cream", stock: 12 },
      { size: "M", color: "Navy/Cream", stock: 14 },
      { size: "L", color: "Navy/Cream", stock: 9 },
      { size: "XL", color: "Navy/Cream", stock: 4 },
    ],
  },
  {
    id: "8",
    slug: "midi-wrap-skirt",
    name: "Midi Wrap Skirt",
    description: "Adjustable wrap tie. Fluid fabric that moves with you. Knee to midi length.",
    price: 5900,
    images: ["/images/skirt-wrap.jpg"],
    category: "Bottoms",
    variants: [
      { size: "XS", color: "Terracotta", stock: 5 },
      { size: "S", color: "Terracotta", stock: 8 },
      { size: "M", color: "Terracotta", stock: 10 },
      { size: "L", color: "Terracotta", stock: 6 },
    ],
  },
  {
    id: "9",
    slug: "trench-coat",
    name: "Classic Trench Coat",
    description: "Double-breasted cotton gabardine. Belt, storm flap, and epaulettes. A wardrobe investment.",
    price: 24900,
    images: ["/images/trench-beige.jpg"],
    category: "Outerwear",
    variants: [
      { size: "XS", color: "Beige", stock: 3 },
      { size: "S", color: "Beige", stock: 5 },
      { size: "M", color: "Beige", stock: 6 },
      { size: "L", color: "Beige", stock: 4 },
      { size: "XL", color: "Beige", stock: 2 },
    ],
  },
  {
    id: "10",
    slug: "knit-cardigan",
    name: "Chunky Knit Cardigan",
    description: "Oversized fit, deep V-neck, patch pockets. Cosy without the bulk.",
    price: 8900,
    images: ["/images/cardigan-oat.jpg"],
    category: "Tops",
    variants: [
      { size: "XS/S", color: "Oatmeal", stock: 8 },
      { size: "M/L", color: "Oatmeal", stock: 12 },
      { size: "XL/XXL", color: "Oatmeal", stock: 6 },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
