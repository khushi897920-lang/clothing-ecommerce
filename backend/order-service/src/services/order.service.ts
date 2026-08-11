import { orderRepository, OrderRepository } from '../repositories/order.repository';
import { AddCartItemDTO, UpdateCartItemDTO, CheckoutDTO, UpdateOrderStatusDTO } from '../dtos/order.dto';
import { AppError } from '../../../shared/middleware/error.middleware';
import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { ROUTING_KEYS } from '../../../shared/rabbitmq/events';
import { OrderStatus } from '@prisma/client';
import crypto from 'crypto';

export class OrderService {
  private repository: OrderRepository;

  constructor(repository: OrderRepository = orderRepository) {
    this.repository = repository;
  }

  async getCart(userId: string) {
    let cart = await this.repository.findActiveCartByUserId(userId);
    if (!cart) {
      cart = await this.repository.createCart(userId);
    }
    return cart;
  }

  async addToCart(userId: string, dto: AddCartItemDTO) {
    const cart = await this.getCart(userId);
    await this.repository.addOrUpdateCartItem(cart.id, dto.variantId, dto.quantity);
    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDTO) {
    const cart = await this.getCart(userId);
    await this.repository.updateCartItemQuantity(itemId, cart.id, dto.quantity);
    return this.getCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    await this.repository.removeCartItem(itemId, cart.id);
    return this.getCart(userId);
  }

  async checkout(userId: string, dto: CheckoutDTO) {
    const cart = await this.repository.findActiveCartByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('Cannot checkout with an empty cart', 400);
    }

    if (!dto.shippingAddress) {
      throw new AppError('Shipping address is required for checkout', 400);
    }

    const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      const variant = item.variant;
      const product = variant?.product;
      const unitPrice = product?.discountPrice ? Number(product.discountPrice) : Number(product?.price || 0);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      return {
        productId: product?.id || '',
        variantId: item.variantId || '',
        productName: product?.name || 'Product',
        sku: variant?.sku || 'SKU',
        size: variant?.size || 'N/A',
        color: variant?.color || 'N/A',
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const shippingAmount = subtotal > 1000 ? 0 : 50; // Free shipping over 1000
    const totalAmount = subtotal + shippingAmount;

    const order = await this.repository.createOrder({
      orderNumber,
      userId,
      subtotal,
      shippingAmount,
      discountAmount: 0,
      totalAmount,
      shippingAddress: dto.shippingAddress,
      items: orderItems,
    });

    await this.repository.markCartConverted(cart.id);

    // Emit OrderCreated event
    await rabbitMQService.publish(ROUTING_KEYS.ORDER_CREATED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId || userId,
      totalAmount: Number(order.totalAmount),
      items: orderItems,
      shippingAddress: dto.shippingAddress,
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
    });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.repository.findOrdersByUserId(userId);
  }

  async getOrderById(orderId: string, userId: string, userRole?: string) {
    const order = await this.repository.findOrderById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (userRole !== 'ADMIN' && order.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return order;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDTO) {
    const order = await this.repository.findOrderById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    this.validateStateTransition(order.status, dto.status);

    const updated = await this.repository.updateOrderStatus(orderId, dto.status, dto.reason);

    // Publish state transition events
    if (dto.status === 'CONFIRMED') {
      await rabbitMQService.publish(ROUTING_KEYS.ORDER_CONFIRMED, {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        userId: updated.userId!,
        confirmedAt: updated.confirmedAt?.toISOString() || new Date().toISOString(),
      });
    } else if (dto.status === 'SHIPPED') {
      await rabbitMQService.publish(ROUTING_KEYS.ORDER_SHIPPED, {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        userId: updated.userId!,
        shippedAt: updated.shippedAt?.toISOString() || new Date().toISOString(),
      });
    } else if (dto.status === 'DELIVERED') {
      await rabbitMQService.publish(ROUTING_KEYS.ORDER_DELIVERED, {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        userId: updated.userId!,
        deliveredAt: updated.deliveredAt?.toISOString() || new Date().toISOString(),
      });
    } else if (dto.status === 'CANCELLED') {
      await rabbitMQService.publish(ROUTING_KEYS.ORDER_CANCELLED, {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        userId: updated.userId!,
        reason: dto.reason || 'Order cancelled',
        cancelledAt: updated.cancelledAt?.toISOString() || new Date().toISOString(),
      });
    }

    return updated;
  }

  private validateStateTransition(current: OrderStatus, next: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PACKED', 'CANCELLED'],
      PACKED: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new AppError(
        `Invalid order status transition from ${current} to ${next}`,
        400
      );
    }
  }
}

export const orderService = new OrderService();
