import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticateJwt, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { asyncHandler } from '../../../shared/middleware/error.middleware';
import { updateStockSchema, reserveStockSchema, releaseStockSchema } from '../dtos/inventory.dto';

const router = Router();

router.get('/variants/:variantId', asyncHandler(inventoryController.getVariantInventory));

router.put(
  '/variants/:variantId',
  authenticateJwt,
  authorizeRoles('ADMIN'),
  validateRequest(updateStockSchema),
  asyncHandler(inventoryController.updateStock)
);

router.post(
  '/reserve',
  authenticateJwt,
  validateRequest(reserveStockSchema),
  asyncHandler(inventoryController.reserveStock)
);

router.post(
  '/release',
  authenticateJwt,
  validateRequest(releaseStockSchema),
  asyncHandler(inventoryController.releaseStock)
);

export default router;
