import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "../database/db";
import { userRouter } from "./routes/userRoutes";
import { postRouter } from "./routes/postRoutes";
import { commentRouter } from "./routes/commentRoutes";
import cors from "cors";
import { likesRouter } from "./routes/likeRoutes";
import { authRouter } from "./routes/authRoutes";

connectDB();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", likesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("CHATTER");
});

setInterval(async () => {
  try {
    const res = await fetch("https://chatter-r8i2.onrender.com/");
    console.log(`Self ping OK: ${res.status}`);
  } catch (error) {
    console.error("Could not self ping:", error);
  }
}, 14 * 60 * 1000);

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
