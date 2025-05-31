import {Router} from "express";
import {oAuth2Client} from "../libs/googleConfig.js";
import axios from "axios";
import {db} from "../libs/db.js";
import jwt from "jsonwebtoken";
import {UserRole} from "../generated/prisma/index.js";

export const googleController = async (req, res) => {
  try {
    const {code} = req.query;
    console.log(code, "THIS IS GOOGLE");
    // oAuth2Client.setCredentials({
    //   redirect_uri: "http://localhost:5173/login",
    // });
    const googleResponse = await oAuth2Client.getToken({
      code,
      redirect_uri: "http://localhost:5173",
    });

    oAuth2Client.setCredentials(googleResponse.tokens);

    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
    );

    console.log(googleUser, "google user");

    const {email, name, picture} = googleUser.data;

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

    const newUser = await db.googleUser.create({
      data: {
        email,
        name,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({id: newUser.id}, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Success",
      token,
      newUser,
    });
  } catch (error) {
    console.error("Error checking user", error);
    res.status(500).json({
      error: "Error checking user.",
    });
  }
};
