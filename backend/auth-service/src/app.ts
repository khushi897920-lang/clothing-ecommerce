import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { AppError } from "../../shared/errors/AppError";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    service: "Auth Service",
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes
app.use("/auth", authRoutes);
app.use("/", authRoutes);

// Global Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || null,
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

export default app;
