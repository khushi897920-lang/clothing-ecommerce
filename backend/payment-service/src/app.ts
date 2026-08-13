import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.routes";
import { AppError } from "../../shared/errors/AppError";
import { prisma } from "../../shared/database";

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

// Health Check
app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "UP",
      service: "Payment Service",
      database: "CONNECTED",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "DOWN",
      service: "Payment Service",
      database: "DISCONNECTED",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/payments", paymentRoutes);
app.use("/", paymentRoutes);

// Error Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || null,
    });
  }

  console.error("Payment Service Error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

export default app;
