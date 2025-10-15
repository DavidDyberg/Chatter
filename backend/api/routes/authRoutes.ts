import { Router } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const authRouter = Router();

authRouter.post("/auth/sync", async (req, res) => {
  try {
    const { email, name, auth0ID } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, userName: name, auth0ID },
      });
    }
    res.json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: "Failed to sync user" });
  }
});
