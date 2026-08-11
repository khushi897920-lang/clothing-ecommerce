import { userRepository, UserRepository } from '../repositories/user.repository';
import { UpdateProfileDTO, CreateAddressDTO, UpdateAddressDTO } from '../dtos/user.dto';
import { AppError } from '../../../shared/middleware/error.middleware';

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository = userRepository) {
    this.repository = repository;
  }

  async getProfile(userId: string) {
    const user = await this.repository.findProfileById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO) {
    const user = await this.repository.findProfileById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }

    const updated = await this.repository.updateProfile(userId, dto);
    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      updatedAt: updated.updatedAt,
    };
  }

  async getAddresses(userId: string) {
    return this.repository.getAddressesByUserId(userId);
  }

  async createAddress(userId: string, dto: CreateAddressDTO) {
    return this.repository.createAddress(userId, dto);
  }

  async updateAddress(addressId: string, userId: string, dto: UpdateAddressDTO) {
    const existing = await this.repository.findAddressById(addressId);
    if (!existing || existing.userId !== userId) {
      throw new AppError('Address not found', 404);
    }

    return this.repository.updateAddress(addressId, userId, dto);
  }

  async deleteAddress(addressId: string, userId: string) {
    const existing = await this.repository.findAddressById(addressId);
    if (!existing || existing.userId !== userId) {
      throw new AppError('Address not found', 404);
    }

    await this.repository.deleteAddress(addressId);
    return { message: 'Address deleted successfully' };
  }

  async getWishlist(userId: string) {
    return this.repository.getWishlistByUserId(userId);
  }

  async addWishlistItem(userId: string, productId: string) {
    const existing = await this.repository.findWishlistItem(userId, productId);
    if (existing) {
      return existing;
    }
    return this.repository.addWishlistItem(userId, productId);
  }

  async removeWishlistItem(wishlistItemId: string, userId: string) {
    await this.repository.removeWishlistItem(wishlistItemId, userId);
    return { message: 'Item removed from wishlist' };
  }
}

export const userService = new UserService();
