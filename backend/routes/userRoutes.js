// backend/routes/userRoutes.js
import express from "express";
import { User } from "../models/User.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Alle routes hieronder zijn protected
router.use(authRequired);

// Alle andere users (behalve jezelf)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("username displayName");

    const result = users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      displayName: u.displayName,
    }));

    res.json(result);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
