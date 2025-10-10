import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../../controllers/postController";

export const postRouter = Router();

postRouter.get("/posts", getPosts);
postRouter.get("/posts/:id", getPostById);
postRouter.post("/post", createPost);
postRouter.put("/post/:id", updatePost);
postRouter.delete("/post/:id", deletePost);
