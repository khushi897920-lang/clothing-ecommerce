import { Response } from 'express';
import { userService, UserService } from '../services/user.service';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';

export class UserController {
  private service: UserService;

  constructor(service: UserService = userService) {
    this.service = service;
  }

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const profile = await this.service.getProfile(req.user!.id);
    res.status(200).json({
      success: true,
      data: { profile },
    });
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const profile = await this.service.updateProfile(req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile },
    });
  };

  getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
    const addresses = await this.service.getAddresses(req.user!.id);
    res.status(200).json({
      success: true,
      data: { addresses },
    });
  };

  createAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    const address = await this.service.createAddress(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { address },
    });
  };

  updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    const address = await this.service.updateAddress(req.params.id, req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: { address },
    });
  };

  deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this.service.deleteAddress(req.params.id, req.user!.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    const wishlist = await this.service.getWishlist(req.user!.id);
    res.status(200).json({
      success: true,
      data: { wishlist },
    });
  };

  addWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    const item = await this.service.addWishlistItem(req.user!.id, req.body.productId);
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: { item },
    });
  };

  deleteWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this.service.removeWishlistItem(req.params.id, req.user!.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  };
}

export const userController = new UserController();
