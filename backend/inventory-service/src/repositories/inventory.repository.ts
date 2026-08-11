import { prisma } from '../../../shared/prisma/client';
import { ProductVariant } from '@prisma/client';

export class InventoryRepository {
  async findVariantById(variantId: string): Promise<ProductVariant | null> {
    return prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });
  }

  async updateStock(variantId: string, stockQuantity: number): Promise<ProductVariant> {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity },
    });
  }

  async reserveVariantStock(variantId: string, quantity: number): Promise<ProductVariant> {
    return prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) {
        throw new Error(`Variant ${variantId} not found`);
      }

      const available = (variant.stockQuantity || 0) - (variant.reservedQuantity || 0);
      if (available < quantity) {
        throw new Error(`Insufficient stock for variant SKU ${variant.sku}. Available: ${available}, Requested: ${quantity}`);
      }

      return tx.productVariant.update({
        where: { id: variantId },
        data: {
          reservedQuantity: { increment: quantity },
        },
      });
    });
  }

  async releaseVariantStock(variantId: string, quantity: number): Promise<ProductVariant> {
    return prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) {
        throw new Error(`Variant ${variantId} not found`);
      }

      const currentReserved = variant.reservedQuantity || 0;
      const decrementBy = Math.min(currentReserved, quantity);

      return tx.productVariant.update({
        where: { id: variantId },
        data: {
          reservedQuantity: { decrement: decrementBy },
        },
      });
    });
  }

  async finalizeDeduction(variantId: string, quantity: number): Promise<ProductVariant> {
    return prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) {
        throw new Error(`Variant ${variantId} not found`);
      }

      const currentReserved = variant.reservedQuantity || 0;
      const decrementReserved = Math.min(currentReserved, quantity);

      return tx.productVariant.update({
        where: { id: variantId },
        data: {
          stockQuantity: { decrement: quantity },
          reservedQuantity: { decrement: decrementReserved },
        },
      });
    });
  }
}

export const inventoryRepository = new InventoryRepository();
