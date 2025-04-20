import jwt from "jsonwebtoken";
import {db} from "../libs/db.js";
import {ApiErrors} from "../utils/api-errors.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    console.log(token, "thjetoeknmd");

    if (!token) {
      throw new ApiErrors(401, "Unauthorized - No token provided");
    }
    console.log(token, "FEEFEF");

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error, "middleware error");

      throw new ApiErrors(401, "Unauthorized - Invalid token");
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiErrors(401, "User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new ApiErrors(500, "Error authenticating user.");
  }
};
