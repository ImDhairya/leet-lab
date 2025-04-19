import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UserRole} from "../generated/prisma/index.js";
import {db} from "../libs/db.js";
import cookieParser from "cookie-parser";

export const register = async (req, res) => {
  const {email, password, name} = req.body;
  if (!email || !password || !name) {
    return res.status(404).json({
      message: "Please give all user details",
      success: false,
    });
  }
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // send registration email

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({id: newUser.id}, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Error creating user",
    });
  }
};
export const login = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "Please give all user details",
      success: false,
    });
  }
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        error: "User not found.",
      });
    }
    const isMatch = bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "invalid credentials",
      });
    }

    const token = jwt.sign({id: existingUser.id}, process.env.JWT_SECRET);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      existingUser: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        image: existingUser.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Error logging in user",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      error: "Error logging out user",
    });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User authenticated Successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking user", error);
    res.status(500).json({
      error: "Error checking user.",
    });
  }
};
