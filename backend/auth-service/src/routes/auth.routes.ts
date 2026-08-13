import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { authenticate, requireRole } from "../../../shared/auth/middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Test endpoints for role middleware authorization validation
router.get("/admin-only", authenticate, requireRole("ADMIN"), (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Admin" });
});

router.get("/customer-only", authenticate, requireRole("CUSTOMER"), (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Customer" });
});

export default router;
