import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UserRole} from "../generated/prisma/index.js";
import {db} from "../libs/db.js";
import cookieParser from "cookie-parser";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiResponse} from "../utils/api-response.js";
import {ApiErrors} from "../utils/api-errors.js";

export const register = asyncHandler(async (req, res) => {
  const {email, password, name} = req.body;
  if (!email || !password || !name) {
    throw new ApiErrors(404, "Please give all user details");
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ApiErrors(400, "User already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    res.status(201).json(
      new ApiResponse(
        201,
        {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
          image: newUser.image,
        },
        "User created successfully"
      )
    );
  } catch (error) {
    console.log(error, "ERROR REGISTRATION");
    throw new ApiErrors(500, "Error creating user.");
  }
});

export const login = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    throw new ApiErrors(404, "Provide give all user details.");
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new ApiErrors(401, "User not found");
    }

    const isMatch = bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      throw new ApiErrors(401, "Invalid credentials.");
    }

    const token = jwt.sign({id: existingUser.id}, process.env.JWT_SECRET);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json(
      new ApiResponse(200, {
        id: existingUser.id,
        name: existingUser.name,
        role: existingUser.role,
        image: existingUser.image,
        email: existingUser.email,
      })
    );
  } catch (error) {
    throw new ApiErrors(500, "Error logging in user");
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully "));
  } catch (error) {
    console.error("Error logging out user:", error);
    throw new ApiErrors(500, "Error logging out of user");
  }
});
export const check = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {user: req.user},
          "User authenticated successfully."
        )
      );
  } catch (error) {
    console.log(error, "Myerror");
    throw new ApiErrors(500, "Error creating user");
  }
});
