// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
// Seeds the clothing catalogue from dataset/products.csv (50 products).
// Uses upsert everywhere, so this is safe to re-run without creating duplicates
// or violating the composite-unique / partial-unique constraints in the DB.
async function main() {
  console.log("Seeding categories...");
  const categoryMap: Record<string, string> = {};
  {
    const c = await prisma.category.upsert({
      where: { name: "Activewear" },
      update: {},
      create: { name: "Activewear", slug: "activewear" },
    });
    categoryMap["Activewear"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Outerwear" },
      update: {},
      create: { name: "Outerwear", slug: "outerwear" },
    });
    categoryMap["Outerwear"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Oversized Tshirts" },
      update: {},
      create: { name: "Oversized Tshirts", slug: "oversized-tshirts" },
    });
    categoryMap["Oversized Tshirts"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Pants" },
      update: {},
      create: { name: "Pants", slug: "pants" },
    });
    categoryMap["Pants"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Shirts" },
      update: {},
      create: { name: "Shirts", slug: "shirts" },
    });
    categoryMap["Shirts"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Bottomwear" },
      update: {},
      create: { name: "Bottomwear", slug: "bottomwear" },
    });
    categoryMap["Bottomwear"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Co-ord" },
      update: {},
      create: { name: "Co-ord", slug: "co-ord" },
    });
    categoryMap["Co-ord"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Dresses" },
      update: {},
      create: { name: "Dresses", slug: "dresses" },
    });
    categoryMap["Dresses"] = c.id;
  }
  {
    const c = await prisma.category.upsert({
      where: { name: "Jacket" },
      update: {},
      create: { name: "Jacket", slug: "jacket" },
    });
    categoryMap["Jacket"] = c.id;
  }
  console.log("Seeding products, images, and variants...");
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-acti-0001" },
      update: {},
      create: {
        categoryId: categoryMap["Activewear"],
        name: "Black Men\'s Tank Top",
        slug: "m-acti-0001",
        description: "Black solid tank top, regular fit.",
        audience: "MEN",
        price: 1140,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-ACTI-0001.jpg",
        publicId: "M-ACTI-0001",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0001-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0001-S",
        size: "S",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0001-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0001-M",
        size: "M",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0001-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0001-L",
        size: "L",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0001-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0001-XL",
        size: "XL",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0001-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0001-XXL",
        size: "XXL",
        color: "Black",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-acti-0002" },
      update: {},
      create: {
        categoryId: categoryMap["Activewear"],
        name: "White Men\'s Shorts",
        slug: "m-acti-0002",
        description: "White solid shorts, regular fit.",
        audience: "MEN",
        price: 1120,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-ACTI-0002.jpg",
        publicId: "M-ACTI-0002",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0002-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0002-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0002-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0002-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0002-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0002-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0002-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0002-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-ACTI-0002-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-ACTI-0002-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-oute-0003" },
      update: {},
      create: {
        categoryId: categoryMap["Outerwear"],
        name: "Beige Men\'s Overshirt",
        slug: "m-oute-0003",
        description: "Beige solid overshirt, regular fit.",
        audience: "MEN",
        price: 2010,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OUTE-0003.jpg",
        publicId: "M-OUTE-0003",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0003-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0003-S",
        size: "S",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0003-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0003-M",
        size: "M",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0003-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0003-L",
        size: "L",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0003-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0003-XL",
        size: "XL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0003-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0003-XXL",
        size: "XXL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-oute-0004" },
      update: {},
      create: {
        categoryId: categoryMap["Outerwear"],
        name: "Blue Men\'s Jacket",
        slug: "m-oute-0004",
        description: "Blue graphic jacket, regular fit.",
        audience: "MEN",
        price: 3180,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OUTE-0004.jpg",
        publicId: "M-OUTE-0004",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0004-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0004-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0004-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0004-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0004-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0004-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0004-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0004-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0004-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0004-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-oute-0005" },
      update: {},
      create: {
        categoryId: categoryMap["Outerwear"],
        name: "Brown Men\'s Jacket",
        slug: "m-oute-0005",
        description: "Brown solid jacket, regular fit.",
        audience: "MEN",
        price: 2080,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OUTE-0005.jpg",
        publicId: "M-OUTE-0005",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0005-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0005-S",
        size: "S",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0005-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0005-M",
        size: "M",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0005-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0005-L",
        size: "L",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0005-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0005-XL",
        size: "XL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OUTE-0005-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OUTE-0005-XXL",
        size: "XXL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0006" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Purple Men\'s Oversized Tshirt",
        slug: "m-over-0006",
        description: "Purple striped tshirts, oversized fit.",
        audience: "MEN",
        price: 790,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0006.jpg",
        publicId: "M-OVER-0006",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0006-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0006-S",
        size: "S",
        color: "Purple",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0006-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0006-M",
        size: "M",
        color: "Purple",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0006-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0006-L",
        size: "L",
        color: "Purple",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0006-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0006-XL",
        size: "XL",
        color: "Purple",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0006-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0006-XXL",
        size: "XXL",
        color: "Purple",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0007" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Beige Men\'s Oversized Tshirt",
        slug: "m-over-0007",
        description: "Beige solid tshirts, oversized fit.",
        audience: "MEN",
        price: 890,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0007.jpg",
        publicId: "M-OVER-0007",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0007-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0007-S",
        size: "S",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0007-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0007-M",
        size: "M",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0007-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0007-L",
        size: "L",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0007-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0007-XL",
        size: "XL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0007-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0007-XXL",
        size: "XXL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0008" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Pink Men\'s Oversized Tshirt",
        slug: "m-over-0008",
        description: "Pink tie-dye tshirts, oversized fit.",
        audience: "MEN",
        price: 740,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0008.jpg",
        publicId: "M-OVER-0008",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0008-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0008-S",
        size: "S",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0008-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0008-M",
        size: "M",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0008-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0008-L",
        size: "L",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0008-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0008-XL",
        size: "XL",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0008-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0008-XXL",
        size: "XXL",
        color: "Pink",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0009" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Pink Men\'s Oversized Tshirt",
        slug: "m-over-0009",
        description: "Pink graphic tshirts, oversized fit.",
        audience: "MEN",
        price: 610,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0009.jpg",
        publicId: "M-OVER-0009",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0009-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0009-S",
        size: "S",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0009-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0009-M",
        size: "M",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0009-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0009-L",
        size: "L",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0009-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0009-XL",
        size: "XL",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0009-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0009-XXL",
        size: "XXL",
        color: "Pink",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0010" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Black Men\'s Oversized Tshirt",
        slug: "m-over-0010",
        description: "Black graphic tshirts, oversized fit.",
        audience: "MEN",
        price: 800,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0010.jpg",
        publicId: "M-OVER-0010",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0010-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0010-S",
        size: "S",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0010-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0010-M",
        size: "M",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0010-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0010-L",
        size: "L",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0010-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0010-XL",
        size: "XL",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0010-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0010-XXL",
        size: "XXL",
        color: "Black",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0011" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Black Men\'s Oversized Tshirt",
        slug: "m-over-0011",
        description: "Black graphic tshirts, oversized fit.",
        audience: "MEN",
        price: 620,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0011.jpg",
        publicId: "M-OVER-0011",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0011-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0011-S",
        size: "S",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0011-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0011-M",
        size: "M",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0011-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0011-L",
        size: "L",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0011-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0011-XL",
        size: "XL",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0011-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0011-XXL",
        size: "XXL",
        color: "Black",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0012" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Grey Men\'s Oversized Tshirt",
        slug: "m-over-0012",
        description: "Grey tie-dye tshirts, oversized fit.",
        audience: "MEN",
        price: 780,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0012.jpg",
        publicId: "M-OVER-0012",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0012-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0012-S",
        size: "S",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0012-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0012-M",
        size: "M",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0012-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0012-L",
        size: "L",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0012-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0012-XL",
        size: "XL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0012-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0012-XXL",
        size: "XXL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-over-0013" },
      update: {},
      create: {
        categoryId: categoryMap["Oversized Tshirts"],
        name: "Grey Men\'s Oversized Tshirt",
        slug: "m-over-0013",
        description: "Grey solid tshirts, oversized fit.",
        audience: "MEN",
        price: 720,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-OVER-0013.jpg",
        publicId: "M-OVER-0013",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0013-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0013-S",
        size: "S",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0013-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0013-M",
        size: "M",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0013-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0013-L",
        size: "L",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0013-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0013-XL",
        size: "XL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-OVER-0013-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-OVER-0013-XXL",
        size: "XXL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-pant-0014" },
      update: {},
      create: {
        categoryId: categoryMap["Pants"],
        name: "Grey Men\'s Trousers",
        slug: "m-pant-0014",
        description: "Grey solid trousers, wide-leg fit.",
        audience: "MEN",
        price: 1580,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-PANT-0014.jpg",
        publicId: "M-PANT-0014",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0014-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0014-S",
        size: "S",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0014-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0014-M",
        size: "M",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0014-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0014-L",
        size: "L",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0014-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0014-XL",
        size: "XL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0014-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0014-XXL",
        size: "XXL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-pant-0015" },
      update: {},
      create: {
        categoryId: categoryMap["Pants"],
        name: "Blue Men\'s Trousers",
        slug: "m-pant-0015",
        description: "Blue solid trousers, wide-leg fit.",
        audience: "MEN",
        price: 1450,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-PANT-0015.jpg",
        publicId: "M-PANT-0015",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0015-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0015-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0015-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0015-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0015-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0015-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0015-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0015-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0015-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0015-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-pant-0016" },
      update: {},
      create: {
        categoryId: categoryMap["Pants"],
        name: "Green Men\'s Trousers",
        slug: "m-pant-0016",
        description: "Green solid trousers, wide-leg fit.",
        audience: "MEN",
        price: 1770,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-PANT-0016.jpg",
        publicId: "M-PANT-0016",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0016-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0016-S",
        size: "S",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0016-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0016-M",
        size: "M",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0016-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0016-L",
        size: "L",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0016-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0016-XL",
        size: "XL",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0016-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0016-XXL",
        size: "XXL",
        color: "Green",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-pant-0017" },
      update: {},
      create: {
        categoryId: categoryMap["Pants"],
        name: "Brown Men\'s Trousers",
        slug: "m-pant-0017",
        description: "Brown solid trousers, wide-leg fit.",
        audience: "MEN",
        price: 1580,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-PANT-0017.jpg",
        publicId: "M-PANT-0017",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0017-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0017-S",
        size: "S",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0017-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0017-M",
        size: "M",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0017-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0017-L",
        size: "L",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0017-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0017-XL",
        size: "XL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0017-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0017-XXL",
        size: "XXL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-pant-0018" },
      update: {},
      create: {
        categoryId: categoryMap["Pants"],
        name: "White Men\'s Trousers",
        slug: "m-pant-0018",
        description: "White solid trousers, wide-leg fit.",
        audience: "MEN",
        price: 1240,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-PANT-0018.jpg",
        publicId: "M-PANT-0018",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0018-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0018-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0018-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0018-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0018-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0018-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0018-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0018-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0018-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0018-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-pant-0019" },
      update: {},
      create: {
        categoryId: categoryMap["Pants"],
        name: "Grey Men\'s Trousers",
        slug: "m-pant-0019",
        description: "Grey solid trousers, regular fit.",
        audience: "MEN",
        price: 1800,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-PANT-0019.jpg",
        publicId: "M-PANT-0019",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0019-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0019-S",
        size: "S",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0019-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0019-M",
        size: "M",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0019-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0019-L",
        size: "L",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0019-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0019-XL",
        size: "XL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-PANT-0019-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-PANT-0019-XXL",
        size: "XXL",
        color: "Grey",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-shir-0020" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Red Men\'s Shirt",
        slug: "m-shir-0020",
        description: "Red plaid shirt, regular fit.",
        audience: "MEN",
        price: 1790,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-SHIR-0020.jpg",
        publicId: "M-SHIR-0020",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0020-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0020-S",
        size: "S",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0020-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0020-M",
        size: "M",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0020-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0020-L",
        size: "L",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0020-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0020-XL",
        size: "XL",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0020-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0020-XXL",
        size: "XXL",
        color: "Red",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-shir-0021" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Blue Men\'s Shirt",
        slug: "m-shir-0021",
        description: "Blue solid shirt, regular fit.",
        audience: "MEN",
        price: 900,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-SHIR-0021.jpg",
        publicId: "M-SHIR-0021",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0021-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0021-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0021-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0021-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0021-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0021-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0021-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0021-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0021-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0021-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-shir-0022" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Blue Men\'s Shirt",
        slug: "m-shir-0022",
        description: "Blue solid shirt, regular fit.",
        audience: "MEN",
        price: 1110,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-SHIR-0022.jpg",
        publicId: "M-SHIR-0022",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0022-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0022-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0022-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0022-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0022-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0022-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0022-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0022-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0022-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0022-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-shir-0023" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Brown Men\'s Shirt",
        slug: "m-shir-0023",
        description: "Brown solid shirt, regular fit.",
        audience: "MEN",
        price: 1360,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-SHIR-0023.jpg",
        publicId: "M-SHIR-0023",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0023-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0023-S",
        size: "S",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0023-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0023-M",
        size: "M",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0023-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0023-L",
        size: "L",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0023-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0023-XL",
        size: "XL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0023-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0023-XXL",
        size: "XXL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-shir-0024" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Black Men\'s Shirt",
        slug: "m-shir-0024",
        description: "Black solid shirt, regular fit.",
        audience: "MEN",
        price: 1230,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-SHIR-0024.jpg",
        publicId: "M-SHIR-0024",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0024-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0024-S",
        size: "S",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0024-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0024-M",
        size: "M",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0024-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0024-L",
        size: "L",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0024-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0024-XL",
        size: "XL",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0024-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0024-XXL",
        size: "XXL",
        color: "Black",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "m-shir-0025" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "White Men\'s Shirt",
        slug: "m-shir-0025",
        description: "White solid shirt, regular fit.",
        audience: "MEN",
        price: 1520,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/M-SHIR-0025.jpg",
        publicId: "M-SHIR-0025",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0025-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0025-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0025-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0025-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0025-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0025-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0025-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0025-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "M-SHIR-0025-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "M-SHIR-0025-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-bott-0026" },
      update: {},
      create: {
        categoryId: categoryMap["Bottomwear"],
        name: "Blue Women\'s Jeans",
        slug: "w-bott-0026",
        description: "Blue solid jeans, wide-leg fit.",
        audience: "WOMEN",
        price: 1750,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-BOTT-0026.jpg",
        publicId: "W-BOTT-0026",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0026-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0026-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0026-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0026-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0026-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0026-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0026-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0026-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0026-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0026-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-bott-0027" },
      update: {},
      create: {
        categoryId: categoryMap["Bottomwear"],
        name: "Blue Women\'s Skirt",
        slug: "w-bott-0027",
        description: "Blue solid skirt, regular fit.",
        audience: "WOMEN",
        price: 1840,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-BOTT-0027.jpg",
        publicId: "W-BOTT-0027",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0027-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0027-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0027-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0027-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0027-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0027-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0027-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0027-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0027-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0027-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-bott-0028" },
      update: {},
      create: {
        categoryId: categoryMap["Bottomwear"],
        name: "Blue Women\'s Jeans",
        slug: "w-bott-0028",
        description: "Blue solid jeans, flared fit.",
        audience: "WOMEN",
        price: 1030,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-BOTT-0028.jpg",
        publicId: "W-BOTT-0028",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0028-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0028-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0028-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0028-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0028-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0028-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0028-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0028-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0028-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0028-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-bott-0029" },
      update: {},
      create: {
        categoryId: categoryMap["Bottomwear"],
        name: "Blue Women\'s Trousers",
        slug: "w-bott-0029",
        description: "Blue solid trousers, wide-leg fit.",
        audience: "WOMEN",
        price: 1060,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-BOTT-0029.jpg",
        publicId: "W-BOTT-0029",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0029-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0029-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0029-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0029-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0029-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0029-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0029-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0029-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0029-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0029-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-bott-0030" },
      update: {},
      create: {
        categoryId: categoryMap["Bottomwear"],
        name: "Blue Women\'s Jeans",
        slug: "w-bott-0030",
        description: "Blue solid jeans, wide-leg fit.",
        audience: "WOMEN",
        price: 1400,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-BOTT-0030.jpg",
        publicId: "W-BOTT-0030",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0030-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0030-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0030-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0030-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0030-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0030-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0030-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0030-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0030-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0030-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-bott-0031" },
      update: {},
      create: {
        categoryId: categoryMap["Bottomwear"],
        name: "White Women\'s Trousers",
        slug: "w-bott-0031",
        description: "White solid trousers, wide-leg fit.",
        audience: "WOMEN",
        price: 1470,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-BOTT-0031.jpg",
        publicId: "W-BOTT-0031",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0031-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0031-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0031-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0031-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0031-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0031-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0031-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0031-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-BOTT-0031-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-BOTT-0031-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-co-o-0032" },
      update: {},
      create: {
        categoryId: categoryMap["Co-ord"],
        name: "Beige Women\'s Co-ord Set",
        slug: "w-co-o-0032",
        description: "Beige solid co-ord set, regular fit.",
        audience: "WOMEN",
        price: 2520,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-CO-O-0032.jpg",
        publicId: "W-CO-O-0032",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0032-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0032-S",
        size: "S",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0032-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0032-M",
        size: "M",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0032-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0032-L",
        size: "L",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0032-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0032-XL",
        size: "XL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0032-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0032-XXL",
        size: "XXL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-co-o-0033" },
      update: {},
      create: {
        categoryId: categoryMap["Co-ord"],
        name: "Pink Women\'s Co-ord Set",
        slug: "w-co-o-0033",
        description: "Pink solid co-ord set, regular fit.",
        audience: "WOMEN",
        price: 2740,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-CO-O-0033.jpg",
        publicId: "W-CO-O-0033",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0033-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0033-S",
        size: "S",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0033-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0033-M",
        size: "M",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0033-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0033-L",
        size: "L",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0033-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0033-XL",
        size: "XL",
        color: "Pink",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-CO-O-0033-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-CO-O-0033-XXL",
        size: "XXL",
        color: "Pink",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-dres-0034" },
      update: {},
      create: {
        categoryId: categoryMap["Dresses"],
        name: "Blue Women\'s Dress",
        slug: "w-dres-0034",
        description: "Blue floral dress, regular fit.",
        audience: "WOMEN",
        price: 2540,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-DRES-0034.jpg",
        publicId: "W-DRES-0034",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0034-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0034-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0034-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0034-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0034-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0034-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0034-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0034-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0034-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0034-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-dres-0035" },
      update: {},
      create: {
        categoryId: categoryMap["Dresses"],
        name: "Black Women\'s Dress",
        slug: "w-dres-0035",
        description: "Black solid dress, regular fit.",
        audience: "WOMEN",
        price: 1570,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-DRES-0035.jpg",
        publicId: "W-DRES-0035",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0035-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0035-S",
        size: "S",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0035-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0035-M",
        size: "M",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0035-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0035-L",
        size: "L",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0035-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0035-XL",
        size: "XL",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0035-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0035-XXL",
        size: "XXL",
        color: "Black",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-dres-0036" },
      update: {},
      create: {
        categoryId: categoryMap["Dresses"],
        name: "Blue Women\'s Dress",
        slug: "w-dres-0036",
        description: "Blue solid dress, regular fit.",
        audience: "WOMEN",
        price: 1660,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-DRES-0036.jpg",
        publicId: "W-DRES-0036",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0036-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0036-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0036-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0036-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0036-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0036-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0036-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0036-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0036-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0036-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-dres-0037" },
      update: {},
      create: {
        categoryId: categoryMap["Dresses"],
        name: "Brown Women\'s Dress",
        slug: "w-dres-0037",
        description: "Brown solid dress, regular fit.",
        audience: "WOMEN",
        price: 2220,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-DRES-0037.jpg",
        publicId: "W-DRES-0037",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0037-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0037-S",
        size: "S",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0037-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0037-M",
        size: "M",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0037-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0037-L",
        size: "L",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0037-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0037-XL",
        size: "XL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0037-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0037-XXL",
        size: "XXL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-dres-0038" },
      update: {},
      create: {
        categoryId: categoryMap["Dresses"],
        name: "White Women\'s Dress",
        slug: "w-dres-0038",
        description: "White floral dress, regular fit.",
        audience: "WOMEN",
        price: 2000,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-DRES-0038.jpg",
        publicId: "W-DRES-0038",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0038-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0038-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0038-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0038-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0038-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0038-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0038-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0038-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0038-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0038-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-dres-0039" },
      update: {},
      create: {
        categoryId: categoryMap["Dresses"],
        name: "Red Women\'s Dress",
        slug: "w-dres-0039",
        description: "Red solid dress, regular fit.",
        audience: "WOMEN",
        price: 1700,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-DRES-0039.jpg",
        publicId: "W-DRES-0039",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0039-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0039-S",
        size: "S",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0039-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0039-M",
        size: "M",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0039-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0039-L",
        size: "L",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0039-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0039-XL",
        size: "XL",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-DRES-0039-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-DRES-0039-XXL",
        size: "XXL",
        color: "Red",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-jack-0040" },
      update: {},
      create: {
        categoryId: categoryMap["Jacket"],
        name: "White Women\'s Jacket",
        slug: "w-jack-0040",
        description: "White colorblock jacket, cropped fit.",
        audience: "WOMEN",
        price: 2540,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-JACK-0040.jpg",
        publicId: "W-JACK-0040",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0040-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0040-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0040-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0040-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0040-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0040-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0040-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0040-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0040-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0040-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-jack-0041" },
      update: {},
      create: {
        categoryId: categoryMap["Jacket"],
        name: "Brown Women\'s Jacket",
        slug: "w-jack-0041",
        description: "Brown solid jacket, regular fit.",
        audience: "WOMEN",
        price: 2060,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-JACK-0041.jpg",
        publicId: "W-JACK-0041",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0041-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0041-S",
        size: "S",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0041-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0041-M",
        size: "M",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0041-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0041-L",
        size: "L",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0041-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0041-XL",
        size: "XL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0041-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0041-XXL",
        size: "XXL",
        color: "Brown",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-jack-0042" },
      update: {},
      create: {
        categoryId: categoryMap["Jacket"],
        name: "Blue Women\'s Jacket",
        slug: "w-jack-0042",
        description: "Blue graphic jacket, regular fit.",
        audience: "WOMEN",
        price: 2250,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-JACK-0042.jpg",
        publicId: "W-JACK-0042",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0042-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0042-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0042-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0042-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0042-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0042-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0042-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0042-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-JACK-0042-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-JACK-0042-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0043" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Red Women\'s Cami Top",
        slug: "w-shir-0043",
        description: "Red printed cami top, regular fit.",
        audience: "WOMEN",
        price: 1710,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0043.jpg",
        publicId: "W-SHIR-0043",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0043-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0043-S",
        size: "S",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0043-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0043-M",
        size: "M",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0043-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0043-L",
        size: "L",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0043-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0043-XL",
        size: "XL",
        color: "Red",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0043-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0043-XXL",
        size: "XXL",
        color: "Red",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0044" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Blue Women\'s Vest Top",
        slug: "w-shir-0044",
        description: "Blue printed vest top, regular fit.",
        audience: "WOMEN",
        price: 1390,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0044.jpg",
        publicId: "W-SHIR-0044",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0044-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0044-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0044-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0044-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0044-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0044-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0044-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0044-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0044-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0044-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0045" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Green Women\'s Crop Top",
        slug: "w-shir-0045",
        description: "Green graphic crop top, cropped fit.",
        audience: "WOMEN",
        price: 1140,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0045.jpg",
        publicId: "W-SHIR-0045",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0045-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0045-S",
        size: "S",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0045-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0045-M",
        size: "M",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0045-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0045-L",
        size: "L",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0045-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0045-XL",
        size: "XL",
        color: "Green",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0045-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0045-XXL",
        size: "XXL",
        color: "Green",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0046" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Beige Women\'s Sweater Vest",
        slug: "w-shir-0046",
        description: "Beige argyle sweater vest, regular fit.",
        audience: "WOMEN",
        price: 930,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0046.jpg",
        publicId: "W-SHIR-0046",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0046-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0046-S",
        size: "S",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0046-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0046-M",
        size: "M",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0046-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0046-L",
        size: "L",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0046-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0046-XL",
        size: "XL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0046-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0046-XXL",
        size: "XXL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0047" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "White Women\'s Polo Top",
        slug: "w-shir-0047",
        description: "White solid polo top, regular fit.",
        audience: "WOMEN",
        price: 1520,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0047.jpg",
        publicId: "W-SHIR-0047",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0047-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0047-S",
        size: "S",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0047-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0047-M",
        size: "M",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0047-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0047-L",
        size: "L",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0047-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0047-XL",
        size: "XL",
        color: "White",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0047-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0047-XXL",
        size: "XXL",
        color: "White",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0048" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Beige Women\'s Sweater Vest",
        slug: "w-shir-0048",
        description: "Beige solid sweater vest, regular fit.",
        audience: "WOMEN",
        price: 950,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0048.jpg",
        publicId: "W-SHIR-0048",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0048-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0048-S",
        size: "S",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0048-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0048-M",
        size: "M",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0048-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0048-L",
        size: "L",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0048-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0048-XL",
        size: "XL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0048-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0048-XXL",
        size: "XXL",
        color: "Beige",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0049" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Black Women\'s Top",
        slug: "w-shir-0049",
        description: "Black solid top, slim fit.",
        audience: "WOMEN",
        price: 1240,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0049.jpg",
        publicId: "W-SHIR-0049",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0049-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0049-S",
        size: "S",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0049-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0049-M",
        size: "M",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0049-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0049-L",
        size: "L",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0049-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0049-XL",
        size: "XL",
        color: "Black",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0049-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0049-XXL",
        size: "XXL",
        color: "Black",
        stockQuantity: 50,
      },
    });
  }
  {
    const product = await prisma.product.upsert({
      where: { slug: "w-shir-0050" },
      update: {},
      create: {
        categoryId: categoryMap["Shirts"],
        name: "Blue Women\'s Polo Top",
        slug: "w-shir-0050",
        description: "Blue colorblock polo top, regular fit.",
        audience: "WOMEN",
        price: 1060,
        isActive: true,
      },
    });

    await prisma.productImage.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        imageUrl: "images/W-SHIR-0050.jpg",
        publicId: "W-SHIR-0050",
        isPrimary: true,
        displayOrder: 0,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0050-S" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0050-S",
        size: "S",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0050-M" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0050-M",
        size: "M",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0050-L" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0050-L",
        size: "L",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0050-XL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0050-XL",
        size: "XL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: "W-SHIR-0050-XXL" },
      update: {},
      create: {
        productId: product.id,
        sku: "W-SHIR-0050-XXL",
        size: "XXL",
        color: "Blue",
        stockQuantity: 50,
      },
    });
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
