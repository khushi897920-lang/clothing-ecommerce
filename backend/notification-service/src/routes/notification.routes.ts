import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";
import { authenticate } from "../../../shared/auth/middleware";

const router = Router();

router.get("/", authenticate, getNotifications);
router.patch("/read-all", authenticate, markAllAsRead);
router.put("/read-all", authenticate, markAllAsRead);
router.patch("/:id/read", authenticate, markAsRead);
router.put("/:id/read", authenticate, markAsRead);
router.get("/:id", authenticate, getNotificationById);

export default router;
