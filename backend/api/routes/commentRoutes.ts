import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
} from "../../controllers/commentController";

export const commentRouter = Router();

commentRouter.get("/comment", getComments);
commentRouter.get("/comment/:id", getCommentById);
commentRouter.post("/comment", createComment);
commentRouter.put("/comment/:id", updateComment);
commentRouter.delete("/comment/:id", deleteComment);
