import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAdminCustomers,
  toggleCustomerStatus,
} from "../controllers/user.controller";
import { authenticate, requireRole } from "../../../shared/auth/middleware";

const router = Router();

// Profile
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfile);

// Addresses
router.get("/me/addresses", authenticate, getAddresses);
router.post("/me/addresses", authenticate, addAddress);
router.patch("/me/addresses/:id", authenticate, updateAddress);
router.put("/me/addresses/:id", authenticate, updateAddress);
router.delete("/me/addresses/:id", authenticate, deleteAddress);

router.get("/addresses", authenticate, getAddresses);
router.post("/addresses", authenticate, addAddress);
router.put("/addresses/:id", authenticate, updateAddress);
router.patch("/addresses/:id", authenticate, updateAddress);
router.delete("/addresses/:id", authenticate, deleteAddress);

// Wishlist
router.get("/me/wishlist", authenticate, getWishlist);
router.post("/me/wishlist", authenticate, addToWishlist);
router.delete("/me/wishlist/:productId", authenticate, removeFromWishlist);

router.get("/wishlist", authenticate, getWishlist);
router.post("/wishlist", authenticate, addToWishlist);
router.delete("/wishlist/:productId", authenticate, removeFromWishlist);

// Admin Routes
router.get("/admin/customers", authenticate, requireRole("ADMIN"), getAdminCustomers);
router.put("/admin/customers/:id/status", authenticate, requireRole("ADMIN"), toggleCustomerStatus);

export default router;
