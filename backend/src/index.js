import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from 'express'
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // ✅ ใช้ app จาก socket.js

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Connect DB ก่อนเปิด server
connectDB();

server.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
});
