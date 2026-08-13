import { Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";
import { NotFoundError, ForbiddenError } from "../../../shared/errors/AppError";

export async function getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNotificationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("You can only view your own notifications");
    }

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("You can only update your own notifications");
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.status(200).json({ success: true, notification: updated });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
}
