
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import studentRoutes from "./routes/studentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import examRoutes from "./routes/examRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => new URL(origin).origin),
]);

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.has(origin));
    },
  })
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Logger
app.use(morgan("dev"));

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
  })
);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student LMS API is running",
  });
});

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/exams", examRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
