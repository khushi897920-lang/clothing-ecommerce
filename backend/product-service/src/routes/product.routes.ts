import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticateJwt, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { asyncHandler } from '../../../shared/middleware/error.middleware';
import {
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
} from '../dtos/product.dto';

const router = Router();

// Public routes
router.get('/', validateRequest(productQuerySchema), asyncHandler(productController.getProducts));
router.get('/featured', asyncHandler(productController.getFeaturedProducts));
router.get('/categories', asyncHandler(productController.getCategories));
router.get('/:id', asyncHandler(productController.getProductById));

// Admin routes
router.post(
  '/',
  authenticateJwt,
  authorizeRoles('ADMIN'),
  validateRequest(createProductSchema),
  asyncHandler(productController.createProduct)
);

router.put(
  '/:id',
  authenticateJwt,
  authorizeRoles('ADMIN'),
  validateRequest(updateProductSchema),
  asyncHandler(productController.updateProduct)
);

router.delete(
  '/:id',
  authenticateJwt,
  authorizeRoles('ADMIN'),
  asyncHandler(productController.deleteProduct)
);

router.post(
  '/categories',
  authenticateJwt,
  authorizeRoles('ADMIN'),
  validateRequest(createCategorySchema),
  asyncHandler(productController.createCategory)
);

export default router;
