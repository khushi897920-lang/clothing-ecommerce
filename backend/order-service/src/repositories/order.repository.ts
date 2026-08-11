import { prisma } from '../../../shared/prisma/client';
import { Cart, Order, OrderStatus } from '@prisma/client';

export class OrderRepository {
  // Cart operations
  async findActiveCartByUserId(userId: string): Promise<Cart | null> {
    return prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createCart(userId: string): Promise<Cart> {
    return prisma.cart.create({
      data: {
        userId,
        status: 'ACTIVE',
      },
      include: { items: true },
    });
  }

  async addOrUpdateCartItem(cartId: string, variantId: string, quantity: number) {
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId, variantId },
      },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        variantId,
        quantity,
      },
    });
  }

  async updateCartItemQuantity(itemId: string, cartId: string, quantity: number) {
    return prisma.cartItem.updateMany({
      where: { id: itemId, cartId },
      data: { quantity },
    });
  }

  async removeCartItem(itemId: string, cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { id: itemId, cartId },
    });
  }

  async markCartConverted(cartId: string) {
    return prisma.cart.update({
      where: { id: cartId },
      data: { status: 'CONVERTED' },
    });
  }

  // Order operations
  async createOrder(data: {
    orderNumber: string;
    userId: string;
    subtotal: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    shippingAddress: {
      name: string;
      phone: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    items: Array<{
      productId: string;
      variantId: string;
      productName: string;
      sku: string;
      size: string;
      color: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }>;
  }): Promise<Order> {
    return prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal: data.subtotal,
        shippingAmount: data.shippingAmount,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        shippingName: data.shippingAddress.name,
        shippingPhone: data.shippingAddress.phone,
        shippingAddress1: data.shippingAddress.address1,
        shippingAddress2: data.shippingAddress.address2,
        shippingCity: data.shippingAddress.city,
        shippingState: data.shippingAddress.state,
        shippingPostalCode: data.shippingAddress.postalCode,
        shippingCountry: data.shippingAddress.country,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            sku: item.sku,
            size: item.size,
            color: item.color,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findOrderById(orderId: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: true },
    });
  }

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    const updateData: any = { status };
    if (status === 'CONFIRMED') updateData.confirmedAt = new Date();
    if (status === 'PACKED') updateData.packedAt = new Date();
    if (status === 'SHIPPED') updateData.shippedAt = new Date();
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (status === 'CANCELLED') updateData.cancelledAt = new Date();

    return prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true },
    });
  }

  async updateOrderPaymentStatus(orderId: string, paymentStatus: 'PAID' | 'FAILED' | 'REFUNDED'): Promise<Order> {
    return prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
      include: { items: true },
    });
  }
}

export const orderRepository = new OrderRepository();
