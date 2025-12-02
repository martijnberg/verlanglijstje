// backend/routes/itemRoutes.js
import express from "express";
import { Item } from "../models/Item.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Alle routes hieronder zijn protected
router.use(authRequired);

// 1) Eigen items ophalen (zonder claim-info tonen)
router.get("/me", async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id }).sort({
      createdAt: 1,
    });

    // Belangrijk: we laten niet zien of ze al geclaimd zijn!
    const safeItems = items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      url: item.url,
      imageUrl: item.imageUrl,
      // geen claimedBy / claimedAt
    }));

    res.json(safeItems);
  } catch (err) {
    console.error("Get my items error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 2) Items van een andere user ophalen
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await Item.find({ owner: userId }).sort({ createdAt: 1 });

    const result = items.map((item) => {
      const isClaimed = !!item.claimedBy;
      const canUnclaim = isClaimed && item.claimedBy.toString() === req.user.id;

      return {
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        url: item.url,
        imageUrl: item.imageUrl,
        isClaimed,
        canUnclaim, // voor frontend: jij bent degene die dit item heeft gereserveerd
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Get user items error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 3) Item toevoegen aan je eigen lijst
router.post("/", async (req, res) => {
  try {
    const { name, description, url, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const item = await Item.create({
      owner: req.user.id,
      name,
      description,
      url,
      imageUrl,
    });

    res.status(201).json({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      url: item.url,
      imageUrl: item.imageUrl,
    });
  } catch (err) {
    console.error("Create item error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 4) Item claimen (reserveren)
router.post("/:itemId/claim", async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Je mag je eigen lijst niet claimen
    if (item.owner.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot claim your own wishlist item" });
    }

    // Als iemand anders 'm al geclaimd heeft → pech
    if (item.claimedBy && item.claimedBy.toString() !== req.user.id) {
      return res
        .status(400)
        .json({ message: "This item is already claimed by someone else" });
    }

    // Als hij nog niet geclaimd is → claimen
    if (!item.claimedBy) {
      item.claimedBy = req.user.id;
      item.claimedAt = new Date();
      await item.save();
    }

    res.json({
      id: item._id.toString(),
      isClaimed: !!item.claimedBy,
      canUnclaim: item.claimedBy.toString() === req.user.id,
    });
  } catch (err) {
    console.error("Claim item error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 5) Item unclaimen (alleen door de claimer)
router.post("/:itemId/unclaim", async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.claimedBy) {
      return res.status(400).json({ message: "Item is not claimed" });
    }

    // **Hier komt jouw feature: alleen de claimer mag deselecteren**
    if (item.claimedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the user who claimed this item can unclaim it",
      });
    }

    item.claimedBy = null;
    item.claimedAt = null;
    await item.save();

    res.json({
      id: item._id.toString(),
      isClaimed: false,
      canUnclaim: false,
    });
  } catch (err) {
    console.error("Unclaim item error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
