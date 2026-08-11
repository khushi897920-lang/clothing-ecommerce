import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticateJwt } from '../../../shared/middleware/auth.middleware';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { asyncHandler } from '../../../shared/middleware/error.middleware';
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  addWishlistSchema,
} from '../dtos/user.dto';

const router = Router();

router.use(authenticateJwt);

// Profile
router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', validateRequest(updateProfileSchema), asyncHandler(userController.updateProfile));

// Addresses
router.get('/addresses', asyncHandler(userController.getAddresses));
router.post('/addresses', validateRequest(createAddressSchema), asyncHandler(userController.createAddress));
router.put('/addresses/:id', validateRequest(updateAddressSchema), asyncHandler(userController.updateAddress));
router.delete('/addresses/:id', asyncHandler(userController.deleteAddress));

// Wishlist
router.get('/wishlist', asyncHandler(userController.getWishlist));
router.post('/wishlist', validateRequest(addWishlistSchema), asyncHandler(userController.addWishlist));
router.delete('/wishlist/:id', asyncHandler(userController.deleteWishlist));

export default router;
