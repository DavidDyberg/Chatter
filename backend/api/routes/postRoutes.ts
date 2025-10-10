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

postRouter.get("/posts", getPosts);
postRouter.get("/posts/:id", getPostById);
postRouter.post(
  "/post",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createPost
);
postRouter.put("/post/:id", updatePost);
postRouter.delete("/post/:id", deletePost);
