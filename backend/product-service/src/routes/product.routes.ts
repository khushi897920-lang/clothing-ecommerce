import { Router } from "express";
import multer from "multer";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getProductBySlugOrId,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadProductImage,
} from "../controllers/product.controller";
import { authenticate, requireRole } from "../../../shared/auth/middleware";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

// Public Category Routes
router.get("/categories", getCategories);
router.get("/categories/list", getCategories);
router.get("/categories/:slug", getCategoryBySlug);

// Admin Product & Category Operations (Supporting /admin/products, /products/admin/all, and /admin/products/:id)
router.get("/admin/all", authenticate, requireRole("ADMIN"), getAdminProducts);
router.get("/admin/products", authenticate, requireRole("ADMIN"), getAdminProducts);
router.get("/admin/products/:id", authenticate, requireRole("ADMIN"), getProductBySlugOrId);

router.post("/admin/products", authenticate, requireRole("ADMIN"), createProduct);
router.post("/products/admin", authenticate, requireRole("ADMIN"), createProduct);

router.patch("/admin/products/:id", authenticate, requireRole("ADMIN"), updateProduct);
router.put("/admin/products/:id", authenticate, requireRole("ADMIN"), updateProduct);
router.patch("/products/admin/:id", authenticate, requireRole("ADMIN"), updateProduct);
router.put("/products/admin/:id", authenticate, requireRole("ADMIN"), updateProduct);

router.delete("/admin/products/:id", authenticate, requireRole("ADMIN"), deleteProduct);
router.delete("/products/admin/:id", authenticate, requireRole("ADMIN"), deleteProduct);

// Admin Category Routes
router.post("/admin/categories", authenticate, requireRole("ADMIN"), createCategory);
router.patch("/admin/categories/:id", authenticate, requireRole("ADMIN"), updateCategory);
router.put("/admin/categories/:id", authenticate, requireRole("ADMIN"), updateCategory);
router.delete("/admin/categories/:id", authenticate, requireRole("ADMIN"), deleteCategory);

router.post(
  "/admin/products/upload-image",
  authenticate,
  requireRole("ADMIN"),
  upload.single("image"),
  uploadProductImage
);

// Public Product Catalog Routes (search and slug/ID lookup)
router.get("/", getProducts);
router.get("/search", getProducts);
router.get("/:slugOrId", getProductBySlugOrId);

export default router;
