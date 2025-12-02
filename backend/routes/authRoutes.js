// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

// helper om JWT te maken
function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Eenmalig handig om je 5 users aan te maken
router.post("/register", async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    if (!username || !password || !displayName) {
      return res
        .status(400)
        .json({ message: "username, password and displayName are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      passwordHash,
      displayName,
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
