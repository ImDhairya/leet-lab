import express from "express";
import {
  check,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import {googleController} from "../controllers/auth.controller.google.js";

import {authMiddleware} from "../middleware/auth.middleware.js";

const authRouters = express.Router();

authRouters.post("/register", register);
authRouters.post("/login", login);
authRouters.post("/logout", logout);
authRouters.get("/google", googleController);
authRouters.get("/check", authMiddleware, check);

export default authRouters;
