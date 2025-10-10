import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../controllers/userController";
import { upload } from "../../middleware/upload";
import { checkJwt } from "../../auth/auth";

export const userRouter = Router();

userRouter.get("/user", checkJwt, getUsers);
userRouter.get("/user/:id", getUserById);
userRouter.post(
  "/user",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "profileBanner", maxCount: 1 },
  ]),
  createUser
);
userRouter.put(
  "/user/:id",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "profileBanner", maxCount: 1 },
  ]),
  updateUser
);
userRouter.delete("/user/:id", deleteUser);
