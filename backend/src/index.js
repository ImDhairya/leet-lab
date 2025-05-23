import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import authRouters from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import cors from "cors";
import playlistRoutes from "./routes/playlistRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Guys welcome to leetlab🔥");
});

app.use("/api/v1/auth", authRouters);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);

app.use("/api/v1/playlist", playlistRoutes);

const port = process.env.PORT || 8000;

console.log(process.env.PORT, "IFEIEE");

app.listen(port, () => {
  console.log("Listening to port ", port);
});
