import express from "express";
import {
  chatWithShopAssistant,
  getRecommendations,
  trackBrowsingEvent,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/events", trackBrowsingEvent);
router.get("/recommendations", getRecommendations);
router.post("/chat", chatWithShopAssistant);

export default router;
