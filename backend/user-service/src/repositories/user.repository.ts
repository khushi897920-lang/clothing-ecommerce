import { prisma } from '../../../shared/prisma/client';
import { Address, User, WishlistItem } from '@prisma/client';

export class UserRepository {
  async findProfileById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getAddressesByUserId(userId: string): Promise<Address[]> {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAddressById(addressId: string): Promise<Address | null> {
    return prisma.address.findUnique({
      where: { id: addressId },
    });
  }

  async createAddress(userId: string, data: any): Promise<Address> {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        userId,
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country || 'India',
        isDefault: data.isDefault || false,
      },
    });
  }

  async updateAddress(addressId: string, userId: string, data: any): Promise<Address> {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(addressId: string): Promise<void> {
    await prisma.address.delete({
      where: { id: addressId },
    });
  }

  async getWishlistByUserId(userId: string) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
            },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addWishlistItem(userId: string, productId: string): Promise<WishlistItem> {
    return prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async removeWishlistItem(wishlistItemId: string, userId: string): Promise<void> {
    await prisma.wishlistItem.deleteMany({
      where: {
        id: wishlistItemId,
        userId,
      },
    });
  }

  async findWishlistItem(userId: string, productId: string): Promise<WishlistItem | null> {
    return prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
