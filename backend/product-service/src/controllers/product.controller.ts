import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import { cacheManager } from "../../../shared/redis/cache";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../../../shared/cloudinary/uploader";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../../../shared/errors/AppError";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";

// ----------------------------------------------------
// PUBLIC CATEGORIES API
// ----------------------------------------------------
export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const cacheKey = "categories:list";
    const cached = await cacheManager.get<any>(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, categories: cached, source: "cache" });
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    await cacheManager.set(cacheKey, categories, 600); // 10m cache
    return res.status(200).json({ success: true, categories, source: "db" });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { images: true, variants: true },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundError("Category not found");
    }

    return res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// PUBLIC PRODUCTS API
// ----------------------------------------------------
export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const skip = (page - 1) * limit;

    const {
      q,
      category,
      audience,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      sort,
    } = req.query;

    const cacheKey = `products:list:${JSON.stringify(req.query)}`;
    const cached = await cacheManager.get<any>(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, ...cached, source: "cache" });
    }

    const targetAudience = (audience || gender) as string;

    const whereClause: any = {
      isActive: true,
      ...(q && {
        OR: [
          { name: { contains: q as string, mode: "insensitive" } },
          { description: { contains: q as string, mode: "insensitive" } },
        ],
      }),
      ...(category && {
        category: {
          OR: [
            ...(typeof category === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category) ? [{ id: category }] : []),
            { slug: category as string },
            { name: { contains: category as string, mode: "insensitive" } },
          ],
        },
      }),
      ...(targetAudience && {
        audience: (targetAudience.toUpperCase() === "MEN" ? "MEN" : targetAudience.toUpperCase() === "WOMEN" ? "WOMEN" : "UNISEX") as any,
      }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: parseFloat(minPrice as string) }),
          ...(maxPrice && { lte: parseFloat(maxPrice as string) }),
        },
      }),
      ...((size || color) && {
        variants: {
          some: {
            ...(size && { size: { equals: size as string, mode: "insensitive" } }),
            ...(color && { color: { contains: color as string, mode: "insensitive" } }),
          },
        },
      }),
    };

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc" || sort === "low-high") orderBy = { price: "asc" };
    if (sort === "price_desc" || sort === "high-low") orderBy = { price: "desc" };
    if (sort === "name_asc") orderBy = { name: "asc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          images: true,
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // Calculate available stock for each variant
    const formattedProducts = products.map((p) => ({
      ...p,
      variants: p.variants.map((v) => ({
        ...v,
        availableStock: Math.max(0, (v.stockQuantity || 0) - (v.reservedQuantity || 0)),
      })),
    }));

    const responsePayload = {
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await cacheManager.set(cacheKey, responsePayload, 300); // 5m cache
    return res.status(200).json({ success: true, ...responsePayload, source: "db" });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlugOrId(req: Request, res: Response, next: NextFunction) {
  try {
    const { slugOrId } = req.params;

    const cacheKey = `product:${slugOrId}`;
    const cached = await cacheManager.get<any>(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, product: cached, source: "cache" });
    }

    const isUuid = /^[0-9a-fA-F-]{36}$/.test(slugOrId);

    const product = await prisma.product.findFirst({
      where: isUuid ? { id: slugOrId } : { slug: slugOrId },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found");
    }

    const formattedProduct = {
      ...product,
      variants: product.variants.map((v) => ({
        ...v,
        availableStock: Math.max(0, (v.stockQuantity || 0) - (v.reservedQuantity || 0)),
      })),
    };

    await cacheManager.set(cacheKey, formattedProduct, 300);
    return res.status(200).json({ success: true, product: formattedProduct, source: "db" });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ADMIN PRODUCT MANAGEMENT API
// ----------------------------------------------------
export async function getAdminProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = products.map((p) => ({
      ...p,
      totalStock: p.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0),
      variants: p.variants.map((v) => ({
        ...v,
        availableStock: Math.max(0, (v.stockQuantity || 0) - (v.reservedQuantity || 0)),
      })),
    }));

    return res.status(200).json({ success: true, products: formatted });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const {
      name,
      slug,
      description,
      categoryId,
      audience,
      price,
      discountPrice,
      isActive,
      variants,
      imageUrl,
      publicId,
    } = req.body;

    if (!name || !description || !price || !audience) {
      throw new ValidationError("Name, description, price and audience (MEN/WOMEN/UNISEX) are required");
    }

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now();

    // Check slug duplicate
    const existingSlug = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (existingSlug) {
      throw new ConflictError("A product with this slug already exists");
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: productSlug,
          description,
          categoryId: categoryId || null,
          audience: audience.toUpperCase(),
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      // Variants
      if (Array.isArray(variants) && variants.length > 0) {
        for (const v of variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku || `${product.slug.toUpperCase()}-${v.size}-${v.color}`,
              size: v.size || "M",
              color: v.color || "Standard",
              stockQuantity: v.stockQuantity !== undefined ? parseInt(v.stockQuantity, 10) : 50,
            },
          });
        }
      }

      // Primary Image
      if (imageUrl) {
        await tx.productImage.create({
          data: {
            productId: product.id,
            imageUrl,
            publicId: publicId || `pub_${Date.now()}`,
            isPrimary: true,
            displayOrder: 0,
          },
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { category: true, images: true, variants: true },
      });
    });

    // Invalidate product caches
    await cacheManager.delByPattern("products:*");
    await cacheManager.delByPattern("categories:*");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      categoryId,
      audience,
      price,
      discountPrice,
      isActive,
      variants,
      imageUrl,
      publicId,
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Product not found");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.product.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(description !== undefined && { description }),
          ...(categoryId !== undefined && { categoryId }),
          ...(audience !== undefined && { audience: audience.toUpperCase() }),
          ...(price !== undefined && { price: parseFloat(price) }),
          ...(discountPrice !== undefined && { discountPrice: parseFloat(discountPrice) }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      // Update image if supplied
      if (imageUrl) {
        await tx.productImage.upsert({
          where: { productId: id },
          update: { imageUrl, publicId: publicId || `pub_${Date.now()}` },
          create: {
            productId: id,
            imageUrl,
            publicId: publicId || `pub_${Date.now()}`,
            isPrimary: true,
          },
        });
      }

      return tx.product.findUnique({
        where: { id },
        include: { category: true, images: true, variants: true },
      });
    });

    // Invalidate product caches
    await cacheManager.delByPattern("products:*");
    await cacheManager.del(`product:${id}`);
    if (existing.slug) await cacheManager.del(`product:${existing.slug}`);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Product not found");
    }

    // Soft delete/deactivate to preserve historical orders & cart references
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    await cacheManager.delByPattern("products:*");
    await cacheManager.del(`product:${id}`);
    if (existing.slug) await cacheManager.del(`product:${existing.slug}`);

    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ADMIN CATEGORIES MANAGEMENT API
// ----------------------------------------------------
export async function createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { name, slug, description, imageUrl } = req.body;
    if (!name) {
      throw new ValidationError("Category name is required");
    }

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug: categorySlug }] },
    });

    if (existing) {
      throw new ConflictError("Category with this name or slug already exists");
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        description: description || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    await cacheManager.delByPattern("categories:*");

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, slug, description, imageUrl, isActive } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await cacheManager.delByPattern("categories:*");

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const productCount = await prisma.product.count({
      where: { categoryId: id, isActive: true },
    });

    if (productCount > 0) {
      throw new ConflictError(`Cannot delete category because ${productCount} active products reference it.`);
    }

    await prisma.category.delete({ where: { id } });
    await cacheManager.delByPattern("categories:*");

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// CLOUDINARY IMAGE UPLOAD API
// ----------------------------------------------------
export async function uploadProductImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new ValidationError("No image file provided");
    }

    const uploadResult = await uploadImageToCloudinary(req.file.buffer, "yugen/products");

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error) {
    next(error);
  }
}
