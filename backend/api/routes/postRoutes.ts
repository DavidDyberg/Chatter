import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../../controllers/postController";
import { upload } from "../../middleware/upload";

export const postRouter = Router();

postRouter.get("/post", getPosts);
postRouter.get("/post/:id", getPostById);
postRouter.post(
  "/post",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createPost
);
postRouter.put(
  "/post/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updatePost
);
postRouter.delete("/post/:id", deletePost);
