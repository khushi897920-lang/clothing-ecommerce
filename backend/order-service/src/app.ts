import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import { AppError } from "../../shared/errors/AppError";
import { prisma } from "../../shared/database";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "UP",
      service: "Order Service",
      database: "CONNECTED",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "DOWN",
      service: "Order Service",
      database: "DISCONNECTED",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/cart", cartRoutes);
app.use("/carts", cartRoutes);

app.use("/orders", orderRoutes);
app.use("/", orderRoutes);

// Error Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || null,
    });
  }

  console.error("Order Service Error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

export default app;
