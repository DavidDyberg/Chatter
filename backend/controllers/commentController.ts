import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id },

      include: {
        user: true,
        post: true,
      },
    });

    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, userId, postId } = req.body;

    if (!userId || !postId) {
      return res
        .status(400)
        .json({ message: "userId and postId are required" });
    }

    const commentAuthor = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!commentAuthor) {
      return res
        .status(404)
        .json({ message: `User with id: ${userId} do not exist` });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: `No post with id ${postId} exists` });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        user_id: userId,
        post_id: postId,
      },
    });

    res
      .status(201)
      .json({ message: "Comment created successfully", newComment });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
      },
    });

    res
      .status(200)
      .json({ message: "Comment was updated successfully", updatedComment });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.comment.delete({
    where: { id },
  });

  res.status(200).json({ message: "Comment was deleted successfully" });
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};
