import { Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../../shared/errors/AppError";

// ----------------------------------------------------
// PROFILE
// ----------------------------------------------------
export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User profile not found");
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ADDRESSES
// ----------------------------------------------------
export async function getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });

    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}

export async function addAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      throw new ValidationError("Full name, phone, address line 1, city, state and postal code are required");
    }

    // Transaction for setting default address
    const result = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const count = await tx.address.count({ where: { userId } });
      const makeDefault = isDefault || count === 0;

      return tx.address.create({
        data: {
          userId,
          fullName,
          phone,
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state,
          postalCode,
          country: country || "India",
          isDefault: makeDefault,
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const addressId = req.params.id;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing) {
      throw new NotFoundError("Address not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError("You can only modify your own addresses");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (isDefault && !existing.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone }),
          ...(addressLine1 !== undefined && { addressLine1 }),
          ...(addressLine2 !== undefined && { addressLine2 }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(postalCode !== undefined && { postalCode }),
          ...(country !== undefined && { country }),
          ...(isDefault !== undefined && { isDefault }),
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const addressId = req.params.id;

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing) {
      throw new NotFoundError("Address not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError("You can only delete your own addresses");
    }

    await prisma.address.delete({ where: { id: addressId } });

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// WISHLIST
// ----------------------------------------------------
export async function getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            variants: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, items });
  } catch (error) {
    next(error);
  }
}

export async function addToWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { productId } = req.body;

    if (!productId) {
      throw new ValidationError("Product ID is required");
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found or unavailable");
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      throw new ConflictError("Product is already in your wishlist");
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: {
          include: { images: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlist(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;
    const productId = req.params.productId;

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existing) {
      throw new NotFoundError("Item not found in wishlist");
    }

    await prisma.wishlistItem.delete({
      where: { id: existing.id },
    });

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// ADMIN CUSTOMERS MANAGEMENT
// ----------------------------------------------------
export async function getAdminCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, customers });
  } catch (error) {
    next(error);
  }
}

export async function toggleCustomerStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Customer ${isActive ? "activated" : "deactivated"} successfully`,
      customer: updated,
    });
  } catch (error) {
    next(error);
  }
}
