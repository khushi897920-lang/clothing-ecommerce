import { Router } from "express";
import {
  checkStock,
  getAdminInventory,
  updateAdminStock,
  handleReserveStock,
  handleReleaseStock,
} from "../controllers/inventory.controller";
import { authenticate, requireRole } from "../../../shared/auth/middleware";

const router = Router();

// Reservation & Release Operations
router.post("/reserve", handleReserveStock);
router.post("/release", handleReleaseStock);
router.post("/items/reserve", handleReserveStock);
router.post("/items/release", handleReleaseStock);

// Admin Stock Operations
router.get("/admin/stock", authenticate, requireRole("ADMIN"), getAdminInventory);
router.get("/admin/inventory", authenticate, requireRole("ADMIN"), getAdminInventory);
router.get("/stock", authenticate, requireRole("ADMIN"), getAdminInventory);

router.patch("/admin/stock/:variantId", authenticate, requireRole("ADMIN"), updateAdminStock);
router.put("/admin/stock/:variantId", authenticate, requireRole("ADMIN"), updateAdminStock);
router.patch("/admin/inventory/:variantId", authenticate, requireRole("ADMIN"), updateAdminStock);
router.put("/admin/inventory/:variantId", authenticate, requireRole("ADMIN"), updateAdminStock);
router.patch("/stock/:variantId", authenticate, requireRole("ADMIN"), updateAdminStock);
router.put("/stock/:variantId", authenticate, requireRole("ADMIN"), updateAdminStock);

// Stock Check (explicit paths)
router.get("/check/:productId", checkStock);
router.get("/product/:productId", checkStock);

export default router;
