// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { APP_CONFIG } from "./config/appConfig.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: APP_CONFIG.corsOrigin,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

// Healthcheck route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Verlanglijstje API is running 🚀" });
});

// Start server
async function start() {
  await connectDB();

  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start();
