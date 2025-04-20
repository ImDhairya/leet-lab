import express from "express";
import {
  check,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";

import {authMiddleware} from "../middleware/auth.middleware.js";

const authRouters = express.Router();

authRouters.post("/register", register);
authRouters.post("/login", login);
authRouters.post("/logout", authMiddleware, logout);
authRouters.get("/check", authMiddleware, check);

export default authRouters;
