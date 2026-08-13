import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import { cacheManager } from "../../../shared/redis/cache";
import { eventBus } from "../../../shared/rabbitmq/rabbitmq";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../../shared/errors/AppError";

const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

// ----------------------------------------------------
// CHECKOUT & ORDER CREATION
// ----------------------------------------------------
export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { addressId, shippingAddress } = req.body;

    // Load active cart
    const cart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ValidationError("Your cart is empty. Add items before checkout.");
    }

    // Resolve Shipping Address
    let addr = shippingAddress;
    if (addressId) {
      const dbAddr = await prisma.address.findUnique({ where: { id: addressId } });
      if (dbAddr && dbAddr.userId === userId) {
        addr = dbAddr;
      }
    }

    if (!addr && !addressId) {
      // Fallback to default address
      const defaultAddr = await prisma.address.findFirst({
        where: { userId, isDefault: true },
      });
      if (defaultAddr) addr = defaultAddr;
    }

    if (!addr || !addr.fullName || !addr.addressLine1 || !addr.city || !addr.state || !addr.postalCode) {
      throw new ValidationError("Valid shipping address is required for checkout");
    }

    // Transactional Order Creation & Inventory Reservation
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify Stock & Reserve Inventory
      const lineItemsToCreate = [];
      let subtotal = 0;

      for (const item of cart.items) {
        const v = item.variant;
        if (!v || !v.product || !v.product.isActive) {
          throw new NotFoundError(`Product variant ${item.variantId} is no longer available.`);
        }

        const available = (v.stockQuantity || 0) - (v.reservedQuantity || 0);
        if (available < item.quantity) {
          throw new ConflictError(
            `Insufficient stock for ${v.product.name} (${v.size}/${v.color}). Requested: ${item.quantity}, Available: ${available}`
          );
        }

        // Reserve Stock
        await tx.productVariant.update({
          where: { id: v.id },
          data: {
            reservedQuantity: { increment: item.quantity },
          },
        });

        const unitPrice = Number(v.product.price);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        lineItemsToCreate.push({
          productId: v.productId,
          variantId: v.id,
          productName: v.product.name,
          sku: v.sku,
          size: v.size,
          color: v.color,
          unitPrice,
          quantity: item.quantity,
          lineTotal,
        });
      }

      const shippingAmount = subtotal >= 2000 ? 0 : 150;
      const discountAmount = 0;
      const totalAmount = subtotal + shippingAmount - discountAmount;
      const orderNumber = `YUGEN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal,
          shippingAmount,
          discountAmount,
          totalAmount,
          shippingName: addr.fullName,
          shippingPhone: addr.phone || addr.shippingPhone || "+919876543210",
          shippingAddress1: addr.addressLine1 || addr.shippingAddress1,
          shippingAddress2: addr.addressLine2 || addr.shippingAddress2 || null,
          shippingCity: addr.city || addr.shippingCity,
          shippingState: addr.state || addr.shippingState,
          shippingPostalCode: addr.postalCode || addr.shippingPostalCode,
          shippingCountry: addr.country || addr.shippingCountry || "India",
          items: {
            create: lineItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Mark Cart CONVERTED & Delete Active Cart Items
      await tx.cart.update({
        where: { id: cart.id },
        data: { status: "CONVERTED" },
      });
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    // Invalidate Redis Cache
    await cacheManager.delByPattern("products:*");

    // Publish OrderPlaced Event to RabbitMQ
    await eventBus.publish("order.placed", {
      eventId: `evt_ord_place_${result.id}`,
      timestamp: new Date().toISOString(),
      eventType: "OrderPlaced",
      orderId: result.id,
      orderNumber: result.orderNumber,
      userId: result.userId!,
      totalAmount: Number(result.totalAmount),
      items: result.items.map((i) => ({ variantId: i.variantId!, quantity: i.quantity })),
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// CUSTOMER ORDER APIS
// ----------------------------------------------------
export async function getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByIdOrTracking(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { id } = req.params;

    const isUuid = /^[0-9a-fA-F-]{36}$/.test(id);
    const order = await prisma.order.findFirst({
      where: isUuid ? { id } : { orderNumber: id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (userRole !== "ADMIN" && order.userId !== userId) {
      throw new ForbiddenError("You can only view your own orders");
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

export async function cancelMyOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new ForbiddenError("You can only cancel your own orders");
    }

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      throw new ValidationError(`Order cannot be cancelled in status ${order.status}`);
    }

    // Release Reserved Stock
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.variantId) {
          const v = await tx.productVariant.findUnique({ where: { id: item.variantId } });
          if (v) {
            const releaseQty = Math.min(item.quantity, v.reservedQuantity || 0);
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { reservedQuantity: { decrement: releaseQty } },
            });
          }
        }
      }

      await tx.order.update({
        where: { id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });
    });

    await cacheManager.delByPattern("products:*");

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ADMIN ORDER MANAGEMENT APIS
// ----------------------------------------------------
export async function getAdminOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new ValidationError("Order status is required");
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const allowedNext = VALID_STATUS_TRANSITIONS[order.status] || [];
    if (!allowedNext.includes(status)) {
      throw new ValidationError(
        `Invalid status transition from ${order.status} to ${status}. Allowed: [${allowedNext.join(", ")}]`
      );
    }

    const timestampField: any = {};
    if (status === "CONFIRMED") timestampField.confirmedAt = new Date();
    if (status === "PACKED") timestampField.packedAt = new Date();
    if (status === "SHIPPED") timestampField.shippedAt = new Date();
    if (status === "DELIVERED") timestampField.deliveredAt = new Date();
    if (status === "CANCELLED") timestampField.cancelledAt = new Date();

    const updated = await prisma.$transaction(async (tx) => {
      // If cancelled by admin, release reserved inventory
      if (status === "CANCELLED") {
        for (const item of order.items) {
          if (item.variantId) {
            const v = await tx.productVariant.findUnique({ where: { id: item.variantId } });
            if (v) {
              const releaseQty = Math.min(item.quantity, v.reservedQuantity || 0);
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { reservedQuantity: { decrement: releaseQty } },
              });
            }
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: {
          status,
          ...timestampField,
        },
        include: { items: true },
      });
    });

    await cacheManager.delByPattern("products:*");

    // Publish ShipmentUpdated Event to RabbitMQ
    await eventBus.publish("shipment.updated", {
      eventId: `evt_ship_upd_${updated.id}_${status}`,
      timestamp: new Date().toISOString(),
      eventType: "ShipmentUpdated",
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      userId: updated.userId!,
      status: status as any,
    });

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (error) {
    next(error);
  }
}
