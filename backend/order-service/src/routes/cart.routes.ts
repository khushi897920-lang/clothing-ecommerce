import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { authenticate } from "../../../shared/auth/middleware";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/items", authenticate, addToCart);
router.post("/", authenticate, addToCart);
router.patch("/items/:id", authenticate, updateCartItem);
router.put("/items/:id", authenticate, updateCartItem);
router.delete("/items/:id", authenticate, removeCartItem);
router.delete("/", authenticate, clearCart);

export default router;
