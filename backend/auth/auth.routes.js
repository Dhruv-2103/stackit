import express from "express";
import { banUser, login, logout, refreshToken, signup, getProfile } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout", logout);
router.post("/refresh-token" , refreshToken);
router.get("/profile" , auth, getProfile);

router.post('/ban-user', banUser);

export default router 
