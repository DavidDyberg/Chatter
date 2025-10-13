import { Router } from "express";
import {
  likeComment,
  likePost,
  unlikeComment,
  unlikePost,
} from "../../controllers/likesController";

export const likesRouter = Router();

likesRouter.post("/post/:postId/like", likePost);
likesRouter.delete("/post/:id/like", unlikePost);
likesRouter.post("/comment/:id/like", likeComment);
likesRouter.delete("/comment/:id/like", unlikeComment);
