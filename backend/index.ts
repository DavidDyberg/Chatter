import express from "express";
import type { Request, Response } from "express";

const app = express();
const port = 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("CHATTER");
});

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
