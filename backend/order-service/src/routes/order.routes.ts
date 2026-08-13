import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderByIdOrTracking,
  cancelMyOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { authenticate, requireRole } from "../../../shared/auth/middleware";

const router = Router();

// Customer Order Routes
router.post("/", authenticate, createOrder);
router.post("/checkout", authenticate, createOrder);
router.get("/me", authenticate, getMyOrders);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/track/:id", authenticate, getOrderByIdOrTracking);
router.post("/:id/cancel", authenticate, cancelMyOrder);

// Admin Order Management Routes
router.get("/admin/all", authenticate, requireRole("ADMIN"), getAdminOrders);
router.get("/admin/orders", authenticate, requireRole("ADMIN"), getAdminOrders);
router.get("/admin/analytics", authenticate, requireRole("ADMIN"), getAdminOrders);
router.get("/admin", authenticate, requireRole("ADMIN"), getAdminOrders);

router.get("/admin/orders/:id", authenticate, requireRole("ADMIN"), getOrderByIdOrTracking);

router.patch("/admin/orders/:id/status", authenticate, requireRole("ADMIN"), updateOrderStatus);
router.put("/admin/orders/:id/status", authenticate, requireRole("ADMIN"), updateOrderStatus);
router.patch("/admin/:id/status", authenticate, requireRole("ADMIN"), updateOrderStatus);
router.put("/admin/:id/status", authenticate, requireRole("ADMIN"), updateOrderStatus);
router.patch("/:id/status", authenticate, requireRole("ADMIN"), updateOrderStatus);
router.put("/:id/status", authenticate, requireRole("ADMIN"), updateOrderStatus);

// Dynamic Order Lookup (placed at the end)
router.get("/:id", authenticate, getOrderByIdOrTracking);

export default router;
