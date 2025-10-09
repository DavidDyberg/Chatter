import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../controllers/userController";

export const userRouter = Router();

userRouter.get("/user", getUsers);
userRouter.get("/user/:id", getUserById);
userRouter.post("/user", createUser);
userRouter.put("/user/:id", updateUser);
userRouter.delete("/user/:id", deleteUser);
