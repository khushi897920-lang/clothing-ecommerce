import { Router } from "express";
import {
  createPayment,
  getPaymentById,
  handleStripeWebhook,
  refundPayment,
  getAdminPayments,
} from "../controllers/payment.controller";
import { authenticate, requireRole } from "../../../shared/auth/middleware";

const router = Router();

// Webhook endpoint (Raw body verification)
router.post("/webhook", handleStripeWebhook);

// Payment Operations
router.post("/create", authenticate, createPayment);
router.post("/", authenticate, createPayment);

// Refund Operations
router.post("/refund", authenticate, refundPayment);
router.post("/:id/refund", authenticate, refundPayment);

// Admin Payments
router.get("/admin/all", authenticate, requireRole("ADMIN"), getAdminPayments);
router.get("/admin/payments", authenticate, requireRole("ADMIN"), getAdminPayments);

// Dynamic Payment Details Lookup
router.get("/:id", authenticate, getPaymentById);

export default router;
