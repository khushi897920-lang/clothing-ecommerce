import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticateJwt, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { asyncHandler } from '../../../shared/middleware/error.middleware';
import {
  addCartItemSchema,
  updateCartItemSchema,
  checkoutSchema,
  updateOrderStatusSchema,
} from '../dtos/order.dto';

const router = Router();

router.use(authenticateJwt);

// Cart routes
router.get('/cart', asyncHandler(orderController.getCart));
router.post('/cart/items', validateRequest(addCartItemSchema), asyncHandler(orderController.addToCart));
router.put('/cart/items/:itemId', validateRequest(updateCartItemSchema), asyncHandler(orderController.updateCartItem));
router.delete('/cart/items/:itemId', asyncHandler(orderController.removeCartItem));

// Order routes
router.post('/checkout', validateRequest(checkoutSchema), asyncHandler(orderController.checkout));
router.get('/', asyncHandler(orderController.getUserOrders));
router.get('/:id', asyncHandler(orderController.getOrderById));

// Admin order status management
router.put(
  '/:id/status',
  authorizeRoles('ADMIN'),
  validateRequest(updateOrderStatusSchema),
  asyncHandler(orderController.updateOrderStatus)
);

export default router;
