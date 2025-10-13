import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "postId and userId are required" });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: `Post already liked by user: ${userId}` });
    }

    const like = await prisma.like.create({
      data: { userId, postId },
    });

    res.status(201).json({ message: "The post was liked", like });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    await prisma.like.deleteMany({
      where: { userId, postId },
    });
    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const likeComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  try {
    if (!commentId || !userId) {
      return res.status(404).json("ComentId and UserId required");
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json(`Comment already liked by user: ${userId}`);
    }

    const like = await prisma.like.create({
      data: { userId, commentId },
    });
    res.status(201).json({ message: "Comment was liked", like });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const unlikeComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  try {
    await prisma.like.deleteMany({
      where: { userId, commentId },
    });
    res.status(200).json({ message: "Comment unliked" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};
