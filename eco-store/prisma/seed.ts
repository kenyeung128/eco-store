import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter } as any);

const products = [
  {
    slug: "classic-white-tee",
    name: "Classic White Tee",
    description: "A timeless white cotton t-shirt. Soft, breathable, and perfect for any occasion.",
    price: 2900,
    category: "tops",
    images: JSON.stringify(["/images/white-tee.jpg"]),
    variants: [
      { size: "XS", color: "White", stock: 10 },
      { size: "S", color: "White", stock: 15 },
      { size: "M", color: "White", stock: 20 },
      { size: "L", color: "White", stock: 15 },
      { size: "XL", color: "White", stock: 10 },
    ],
  },
  {
    slug: "indigo-slim-jeans",
    name: "Indigo Slim Jeans",
    description: "Slim-fit denim jeans in classic indigo wash. Durable and stylish for everyday wear.",
    price: 7900,
    category: "bottoms",
    images: JSON.stringify(["/images/indigo-jeans.jpg"]),
    variants: [
      { size: "28", color: "Indigo", stock: 8 },
      { size: "30", color: "Indigo", stock: 12 },
      { size: "32", color: "Indigo", stock: 15 },
      { size: "34", color: "Indigo", stock: 10 },
      { size: "36", color: "Indigo", stock: 5 },
    ],
  },
  {
    slug: "merino-crew-sweater",
    name: "Merino Crew Sweater",
    description: "Luxuriously soft merino wool crew neck. Warm without the bulk.",
    price: 12900,
    category: "tops",
    images: JSON.stringify(["/images/merino-sweater.jpg"]),
    variants: [
      { size: "S", color: "Navy", stock: 8 },
      { size: "M", color: "Navy", stock: 12 },
      { size: "L", color: "Navy", stock: 10 },
      { size: "S", color: "Oatmeal", stock: 6 },
      { size: "M", color: "Oatmeal", stock: 10 },
      { size: "L", color: "Oatmeal", stock: 8 },
    ],
  },
  {
    slug: "linen-wide-trousers",
    name: "Linen Wide-Leg Trousers",
    description: "Relaxed wide-leg trousers in breathable linen. Effortlessly elegant.",
    price: 8900,
    category: "bottoms",
    images: JSON.stringify(["/images/linen-trousers.jpg"]),
    variants: [
      { size: "XS", color: "Sand", stock: 5 },
      { size: "S", color: "Sand", stock: 8 },
      { size: "M", color: "Sand", stock: 10 },
      { size: "L", color: "Sand", stock: 8 },
      { size: "XL", color: "Sand", stock: 4 },
    ],
  },
  {
    slug: "bomber-jacket-olive",
    name: "Olive Bomber Jacket",
    description: "Classic bomber silhouette in olive ripstop. Lightweight and versatile.",
    price: 14900,
    category: "outerwear",
    images: JSON.stringify(["/images/bomber-jacket.jpg"]),
    variants: [
      { size: "S", color: "Olive", stock: 6 },
      { size: "M", color: "Olive", stock: 10 },
      { size: "L", color: "Olive", stock: 8 },
      { size: "XL", color: "Olive", stock: 4 },
    ],
  },
  {
    slug: "floral-midi-dress",
    name: "Floral Midi Dress",
    description: "Flowy midi dress in a vibrant floral print. Perfect for warm days.",
    price: 9900,
    category: "dresses",
    images: JSON.stringify(["/images/floral-dress.jpg"]),
    variants: [
      { size: "XS", color: "Floral", stock: 5 },
      { size: "S", color: "Floral", stock: 8 },
      { size: "M", color: "Floral", stock: 10 },
      { size: "L", color: "Floral", stock: 6 },
    ],
  },
  {
    slug: "striped-linen-shirt",
    name: "Striped Linen Shirt",
    description: "Relaxed-fit linen shirt with classic navy stripes. A summer essential.",
    price: 6900,
    category: "tops",
    images: JSON.stringify(["/images/linen-shirt.jpg"]),
    variants: [
      { size: "S", color: "Navy Stripe", stock: 10 },
      { size: "M", color: "Navy Stripe", stock: 15 },
      { size: "L", color: "Navy Stripe", stock: 12 },
      { size: "XL", color: "Navy Stripe", stock: 6 },
    ],
  },
  {
    slug: "chino-shorts",
    name: "Slim Chino Shorts",
    description: "Tailored chino shorts with a slim fit. Polished yet comfortable.",
    price: 5900,
    category: "bottoms",
    images: JSON.stringify(["/images/chino-shorts.jpg"]),
    variants: [
      { size: "28", color: "Khaki", stock: 10 },
      { size: "30", color: "Khaki", stock: 15 },
      { size: "32", color: "Khaki", stock: 12 },
      { size: "34", color: "Khaki", stock: 8 },
    ],
  },
  {
    slug: "cashmere-turtleneck",
    name: "Cashmere Turtleneck",
    description: "Whisper-soft cashmere turtleneck. The pinnacle of cosy luxury.",
    price: 19900,
    category: "tops",
    images: JSON.stringify(["/images/cashmere-turtleneck.jpg"]),
    variants: [
      { size: "S", color: "Camel", stock: 4 },
      { size: "M", color: "Camel", stock: 6 },
      { size: "L", color: "Camel", stock: 5 },
      { size: "S", color: "Black", stock: 4 },
      { size: "M", color: "Black", stock: 6 },
      { size: "L", color: "Black", stock: 5 },
    ],
  },
  {
    slug: "trench-coat-camel",
    name: "Classic Camel Trench",
    description: "A heritage trench coat in warm camel. Timeless outerwear done right.",
    price: 24900,
    category: "outerwear",
    images: JSON.stringify(["/images/trench-coat.jpg"]),
    variants: [
      { size: "S", color: "Camel", stock: 4 },
      { size: "M", color: "Camel", stock: 6 },
      { size: "L", color: "Camel", stock: 5 },
      { size: "XL", color: "Camel", stock: 3 },
    ],
  },
];

async function main() {
  console.log("Seeding products...");
  for (const p of products) {
    const { variants, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        variants: { create: variants },
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
