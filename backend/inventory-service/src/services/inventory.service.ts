import { inventoryRepository, InventoryRepository } from '../repositories/inventory.repository';
import { UpdateStockDTO, ReserveStockDTO, ReleaseStockDTO } from '../dtos/inventory.dto';
import { AppError } from '../../../shared/middleware/error.middleware';
import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { ROUTING_KEYS } from '../../../shared/rabbitmq/events';

export class InventoryService {
  private repository: InventoryRepository;

  constructor(repository: InventoryRepository = inventoryRepository) {
    this.repository = repository;
  }

  async getVariantInventory(variantId: string) {
    const variant = await this.repository.findVariantById(variantId);
    if (!variant) {
      throw new AppError('Product variant not found', 404);
    }
    const available = (variant.stockQuantity || 0) - (variant.reservedQuantity || 0);
    return {
      variantId: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      reservedQuantity: variant.reservedQuantity,
      availableQuantity: Math.max(0, available),
    };
  }

  async updateStock(variantId: string, dto: UpdateStockDTO) {
    const variant = await this.repository.findVariantById(variantId);
    if (!variant) {
      throw new AppError('Product variant not found', 404);
    }

    const updated = await this.repository.updateStock(variantId, dto.stockQuantity);

    // Emit InventoryUpdated event
    await rabbitMQService.publish(ROUTING_KEYS.INVENTORY_UPDATED, {
      variantId: updated.id,
      sku: updated.sku,
      newStockQuantity: updated.stockQuantity,
      updatedAt: new Date().toISOString(),
    });

    return updated;
  }

  async reserveStock(dto: ReserveStockDTO) {
    const reservedItems = [];
    for (const item of dto.items) {
      const updatedVariant = await this.repository.reserveVariantStock(item.variantId, item.quantity);
      reservedItems.push({ variantId: item.variantId, quantity: item.quantity, sku: updatedVariant.sku });
    }

    // Publish InventoryReserved event
    await rabbitMQService.publish(ROUTING_KEYS.INVENTORY_RESERVED, {
      orderId: dto.orderId,
      items: dto.items,
      reservedAt: new Date().toISOString(),
    });

    return {
      orderId: dto.orderId,
      status: 'RESERVED',
      items: reservedItems,
    };
  }

  async releaseStock(dto: ReleaseStockDTO) {
    const releasedItems = [];
    for (const item of dto.items) {
      const updatedVariant = await this.repository.releaseVariantStock(item.variantId, item.quantity);
      releasedItems.push({ variantId: item.variantId, quantity: item.quantity, sku: updatedVariant.sku });
    }

    // Publish InventoryReleased event
    await rabbitMQService.publish(ROUTING_KEYS.INVENTORY_RELEASED, {
      orderId: dto.orderId,
      items: dto.items,
      reason: dto.reason || 'Stock released',
      releasedAt: new Date().toISOString(),
    });

    return {
      orderId: dto.orderId,
      status: 'RELEASED',
      items: releasedItems,
    };
  }
}

export const inventoryService = new InventoryService();
