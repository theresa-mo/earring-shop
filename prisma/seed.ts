import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type ColorKey = "black" | "red" | "blue" | "orange" | "pink";

const COLOR_DATA: Record<ColorKey, { fr: string; hex: string; img: string }> = {
  black:  { fr: "Noir",   hex: "#000000", img: "/products/black.png"  },
  red:    { fr: "Rouge",  hex: "#D0211C", img: "/products/red.png"    },
  blue:   { fr: "Bleu",   hex: "#1C32D0", img: "/products/blue.png"   },
  orange: { fr: "Orange", hex: "#C87030", img: "/products/orange.png" },
  pink:   { fr: "Rose",   hex: "#E8B7C8", img: "/products/pink.png"   },
};

const BASE_DESC =
  "Boucles d’oreilles volumineuses en laine faites main (style fleur/pompon). Légères, hypoallergéniques. Chaque paire est nouée à la main et contrôlée avant envoi.";

async function main() {
  const priceCents = 3000; // 30,00 €
  const baseTags = ["fait-main", "statement", "flower", "laine"];

  // crée/actualise 1 produit par couleur
  for (const key of Object.keys(COLOR_DATA) as ColorKey[]) {
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
          // on remplace les images existantes par la principale
          deleteMany: {},
          create: [{ url: c.img, alt: `Goatela ${c.fr}`, sortOrder: 0 }],
        },
        variants: {
          deleteMany: {},
          create: [
            { name: "Crochet", priceDiffCents: 0,   stock: 10 },
            { name: "Clip",    priceDiffCents: 200, stock: 5 },
          ],
        },
        stock: 15, // total indicatif (crochet + clip)
      },
      create: {
        slug: `goatela-${key}`,
        name: `Goatela — ${c.fr}`,
        description: BASE_DESC,
        priceCents,
        currency: "EUR",
        materials: "Fil textile (laine), attaches acier inox",
        colors: key,                // utile pour filtrer /shop?color=red
        tags: baseTags,
        stock: 15,
        isActive: true,
        images: { create: [{ url: c.img, alt: `Goatela ${c.fr}`, sortOrder: 0 }] },
        variants: {
          create: [
            { name: "Crochet", priceDiffCents: 0,   stock: 10 },
            { name: "Clip",    priceDiffCents: 200, stock: 5 },
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
