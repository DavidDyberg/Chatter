import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "../database/db";
import { userRouter } from "./routes/userRoutes";
import cors from "cors";

connectDB();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use("/api", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("CHATTER");
});

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
