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
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.get("/", (req, res) => res.json({ success: true, message: "Student LMS API is running" }));
app.use("/api/students", studentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/exams", examRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`))).catch((error) => {
  console.error("Database connection failed:", error.message);
  process.exit(1);
});
