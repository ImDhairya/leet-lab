import jwt from "jsonwebtoken";
import {db} from "../libs/db.js";

export const authMiddleware = async (req, res) => {
  try {
    const {token} = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }
    console.log(token, "FEEFEF")

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error, "middleware error");
      return res.status(401).json({
        message: "Unauthorized - Invalid token.",
      });
    }

    const user = await db.user.findUpdate({
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
      return res.status(401).json({message: "User not found."});
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({message: "Error authenticating user"});
  }
};
