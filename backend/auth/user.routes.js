import express from "express";
import { getUserStats } from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user statistics
router.get("/:id/stats", getUserStats);

export default router;