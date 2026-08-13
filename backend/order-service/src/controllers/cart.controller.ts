import { Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../../../shared/errors/AppError";

// Helper to get or create active cart for authenticated user
async function getOrCreateActiveCart(userId: string) {
  let cart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId, status: "ACTIVE" },
    });
  }

  return cart;
}

export async function getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const cart = await getOrCreateActiveCart(userId);

    const fullCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: true },
                },
              },
            },
          },
        },
      },
    });

    const items = (fullCart?.items || []).map((item) => {
      const p = item.variant?.product;
      const unitPrice = p ? Number(p.price) : 0;
      const lineTotal = unitPrice * item.quantity;
      const primaryImg = p?.images ? (Array.isArray(p.images) ? p.images[0]?.imageUrl : (p.images as any).imageUrl) : null;

      return {
        id: item.id,
        cartId: item.cartId,
        variantId: item.variantId,
        productId: p?.id,
        productName: p?.name || "Unknown Product",
        slug: p?.slug,
        sku: item.variant?.sku,
        size: item.variant?.size,
        color: item.variant?.color,
        imageUrl: primaryImg,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
        availableStock: Math.max(0, (item.variant?.stockQuantity || 0) - (item.variant?.reservedQuantity || 0)),
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

    return res.status(200).json({
      success: true,
      cart: {
        id: cart.id,
        userId: cart.userId,
        status: cart.status,
        items,
        subtotal,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { variantId, productId, size, color, quantity = 1 } = req.body;

    if (quantity <= 0) {
      throw new ValidationError("Quantity must be greater than zero");
    }

    let targetVariantId = variantId;

    // If productId, size, and color supplied instead of direct variantId
    if (!targetVariantId && productId) {
      const v = await prisma.productVariant.findFirst({
        where: {
          productId,
          ...(size && { size }),
          ...(color && { color }),
        },
      });
      if (v) targetVariantId = v.id;
    }

    if (!targetVariantId) {
      // Fallback to primary variant of product
      if (productId) {
        const firstVar = await prisma.productVariant.findFirst({ where: { productId } });
        if (firstVar) targetVariantId = firstVar.id;
      }
    }

    if (!targetVariantId) {
      throw new ValidationError("Valid variantId or productId is required");
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: targetVariantId },
      include: { product: true },
    });

    if (!variant || !variant.product || !variant.product.isActive) {
      throw new NotFoundError("Product or variant not available");
    }

    const availableStock = (variant.stockQuantity || 0) - (variant.reservedQuantity || 0);
    if (availableStock < quantity) {
      throw new ValidationError(`Insufficient stock available (Available: ${availableStock})`);
    }

    const cart = await getOrCreateActiveCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId: cart.id, variantId: targetVariantId },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (availableStock < newQty) {
        throw new ValidationError(`Cannot add more items. Max available stock is ${availableStock}`);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: targetVariantId,
          quantity,
        },
      });
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const itemId = req.params.id;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      throw new ValidationError("Valid quantity is required");
    }

    const cart = await getOrCreateActiveCart(userId);
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true },
    });

    if (!existingItem) {
      throw new NotFoundError("Cart item not found");
    }

    if (existingItem.cartId !== cart.id) {
      throw new ForbiddenError("You can only modify items in your own cart");
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const available = (existingItem.variant?.stockQuantity || 0) - (existingItem.variant?.reservedQuantity || 0);
      if (available < quantity) {
        throw new ValidationError(`Insufficient stock available (Available: ${available})`);
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const itemId = req.params.id;

    const cart = await getOrCreateActiveCart(userId);
    const existingItem = await prisma.cartItem.findUnique({ where: { id: itemId } });

    if (!existingItem) {
      throw new NotFoundError("Cart item not found");
    }

    if (existingItem.cartId !== cart.id) {
      throw new ForbiddenError("You can only remove items from your own cart");
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const cart = await getOrCreateActiveCart(userId);

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
}
