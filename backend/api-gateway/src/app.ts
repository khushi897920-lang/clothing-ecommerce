import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../../auth-service/src/routes/auth.routes";
import userRoutes from "../../user-service/src/routes/user.routes";
import productRoutes from "../../product-service/src/routes/product.routes";
import inventoryRoutes from "../../inventory-service/src/routes/inventory.routes";
import cartRoutes from "../../order-service/src/routes/cart.routes";
import orderRoutes from "../../order-service/src/routes/order.routes";
import paymentRoutes from "../../payment-service/src/routes/payment.routes";
import notificationRoutes from "../../notification-service/src/routes/notification.routes";
import { AppError } from "../../shared/errors/AppError";

const app = express();

app.use(cors({ origin: true, credentials: true }));

// Express JSON parsing for all routes EXCEPT raw body Stripe webhook
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.includes("/webhook")) {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser());

// Gateway Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    service: "API Gateway",
    timestamp: new Date().toISOString(),
  });
});

// Mounted Microservices API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/users", userRoutes);

app.use("/api/v1/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api/v1/inventory", inventoryRoutes);
app.use("/inventory", inventoryRoutes);

app.use("/api/v1/cart", cartRoutes);
app.use("/cart", cartRoutes);

app.use("/api/v1/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.use("/api/v1/payments", paymentRoutes);
app.use("/payments", paymentRoutes);

app.use("/api/v1/notifications", notificationRoutes);
app.use("/notifications", notificationRoutes);

// Gateway Admin Route Aggregation
app.use("/api/v1/admin", productRoutes);
app.use("/api/v1/admin", inventoryRoutes);
app.use("/api/v1/admin", orderRoutes);
app.use("/api/v1/admin", paymentRoutes);
app.use("/admin", productRoutes);
app.use("/admin", inventoryRoutes);
app.use("/admin", orderRoutes);
app.use("/admin", paymentRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || null,
    });
  }

  console.error("API Gateway Error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

export default app;
