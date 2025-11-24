// Seed script (JS) to avoid needing ts-node in dev
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const COLOR_DATA = {
  black: { fr: "Noir", hex: "#000000", img: "/products/black.png" },
  red: { fr: "Rouge", hex: "#D0211C", img: "/products/red.png" },
  blue: { fr: "Bleu", hex: "#1C32D0", img: "/products/blue.png" },
  orange: { fr: "Orange", hex: "#C87030", img: "/products/orange.png" },
  pink: { fr: "Rose", hex: "#E8B7C8", img: "/products/pink.png" },
};

const BASE_DESC =
  "Boucles d’oreilles volumineuses en laine faites main (style fleur/pompon). Légères, hypoallergéniques. Chaque paire est nouée à la main et contrôlée avant envoi.";

async function main() {
  const priceCents = 3000; // 30,00 €
  const baseTags = ["fait-main", "statement", "flower", "laine"];

  for (const key of Object.keys(COLOR_DATA)) {
    const c = COLOR_DATA[key];

    await prisma.product.upsert({
      where: { slug: `goatela-${key}` },
      update: {
        name: `Goatela — ${c.fr}`,
        description: BASE_DESC,
        priceCents,
        materials: "Fil textile (laine), attaches acier inox",
        colors: key,
        tags: baseTags,
        isActive: true,
        images: {
          deleteMany: {},
          create: [{ url: c.img, alt: `Goatela ${c.fr}`, sortOrder: 0 }],
        },
        variants: {
          deleteMany: {},
          create: [
            { name: "Crochet", priceDiffCents: 0, stock: 10 },
            { name: "Clip", priceDiffCents: 200, stock: 5 },
          ],
        },
        stock: 15,
      },
      create: {
        slug: `goatela-${key}`,
        name: `Goatela — ${c.fr}`,
        description: BASE_DESC,
        priceCents,
        currency: "EUR",
        materials: "Fil textile (laine), attaches acier inox",
        colors: key,
        tags: baseTags,
        stock: 15,
        isActive: true,
        images: { create: [{ url: c.img, alt: `Goatela ${c.fr}`, sortOrder: 0 }] },
        variants: {
          create: [
            { name: "Crochet", priceDiffCents: 0, stock: 10 },
            { name: "Clip", priceDiffCents: 200, stock: 5 },
          ],
        },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
