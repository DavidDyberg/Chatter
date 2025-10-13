import { Router } from "express";
import {
  likeComment,
  likePost,
  unlikeComment,
  unlikePost,
} from "../../controllers/likesController";

export const likesRouter = Router();

likesRouter.post("/post/:postId/like", likePost);
likesRouter.delete("/post/:postId/unlike", unlikePost);
likesRouter.post("/comment/:commentId/like", likeComment);
likesRouter.delete("/comment/:commentId/unlike", unlikeComment);
