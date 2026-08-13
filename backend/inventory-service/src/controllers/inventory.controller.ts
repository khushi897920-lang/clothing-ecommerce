import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import { cacheManager } from "../../../shared/redis/cache";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../../../shared/errors/AppError";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";

const LOW_STOCK_THRESHOLD = 10;

// ----------------------------------------------------
// READ & CHECK STOCK
// ----------------------------------------------------
export async function checkStock(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId } = req.params;
    const variants = await prisma.productVariant.findMany({
      where: { productId },
    });

    const stockInfo = variants.map((v) => ({
      variantId: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stockQuantity: v.stockQuantity || 0,
      reservedQuantity: v.reservedQuantity || 0,
      availableStock: Math.max(0, (v.stockQuantity || 0) - (v.reservedQuantity || 0)),
      isLowStock: Math.max(0, (v.stockQuantity || 0) - (v.reservedQuantity || 0)) <= LOW_STOCK_THRESHOLD,
    }));

    return res.status(200).json({ success: true, stockInfo });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ADMIN INVENTORY LISTING & UPDATE
// ----------------------------------------------------
export async function getAdminInventory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const inventory = variants.map((v) => {
      const stock = v.stockQuantity || 0;
      const reserved = v.reservedQuantity || 0;
      const available = Math.max(0, stock - reserved);

      return {
        id: v.id,
        variantId: v.id,
        productId: v.productId,
        productName: v.product?.name || "Unknown Product",
        categoryName: v.product?.category?.name || "Uncategorized",
        sku: v.sku,
        size: v.size,
        color: v.color,
        stockQuantity: stock,
        reservedQuantity: reserved,
        availableStock: available,
        isLowStock: available <= LOW_STOCK_THRESHOLD,
      };
    });

    return res.status(200).json({ success: true, inventory });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { variantId } = req.params;
    const { stockQuantity, quantity } = req.body;

    const newStock = stockQuantity !== undefined ? stockQuantity : quantity;
    if (newStock === undefined || isNaN(parseInt(newStock, 10)) || parseInt(newStock, 10) < 0) {
      throw new ValidationError("Valid non-negative stock quantity is required");
    }

    const existing = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) {
      throw new NotFoundError("Product variant not found");
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: parseInt(newStock, 10) },
      include: { product: true },
    });

    // Invalidate Redis product cache
    await cacheManager.delByPattern("products:*");
    if (updated.productId) await cacheManager.del(`product:${updated.productId}`);
    if (updated.product?.slug) await cacheManager.del(`product:${updated.product.slug}`);

    const available = Math.max(0, (updated.stockQuantity || 0) - (updated.reservedQuantity || 0));

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      variant: {
        ...updated,
        availableStock: available,
        isLowStock: available <= LOW_STOCK_THRESHOLD,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ATOMIC STOCK RESERVATION & RELEASE
// ----------------------------------------------------
export async function reserveStockItems(items: Array<{ variantId: string; quantity: number }>) {
  if (!items || items.length === 0) {
    throw new ValidationError("No reservation items provided");
  }

  return prisma.$transaction(async (tx) => {
    for (const item of items) {
      if (item.quantity <= 0) {
        throw new ValidationError("Reservation quantity must be greater than zero");
      }

      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant) {
        throw new NotFoundError(`Variant ${item.variantId} not found`);
      }

      const available = (variant.stockQuantity || 0) - (variant.reservedQuantity || 0);
      if (available < item.quantity) {
        throw new ConflictError(
          `Insufficient stock for SKU ${variant.sku}. Requested: ${item.quantity}, Available: ${available}`
        );
      }

      // Atomic reservation update in PostgreSQL
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          reservedQuantity: { increment: item.quantity },
        },
      });
    }
  });
}

export async function releaseStockItems(items: Array<{ variantId: string; quantity: number }>) {
  if (!items || items.length === 0) return;

  return prisma.$transaction(async (tx) => {
    for (const item of items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant) continue;

      const releaseQty = Math.min(item.quantity, variant.reservedQuantity || 0);

      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          reservedQuantity: { decrement: releaseQty },
        },
      });
    }
  });
}

export async function handleReserveStock(req: Request, res: Response, next: NextFunction) {
  try {
    const { items } = req.body;
    await reserveStockItems(items);
    await cacheManager.delByPattern("products:*");

    return res.status(200).json({
      success: true,
      message: "Stock reserved successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function handleReleaseStock(req: Request, res: Response, next: NextFunction) {
  try {
    const { items } = req.body;
    await releaseStockItems(items);
    await cacheManager.delByPattern("products:*");

    return res.status(200).json({
      success: true,
      message: "Stock released successfully",
    });
  } catch (error) {
    next(error);
  }
}
