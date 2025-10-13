import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "../database/db";
import { userRouter } from "./routes/userRoutes";
import { postRouter } from "./routes/postRoutes";
import { commentRouter } from "./routes/commentRoutes";
import cors from "cors";
import { likesRouter } from "./routes/likeRoutes";

connectDB();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", likesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("CHATTER");
});

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
