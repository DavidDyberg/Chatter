import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import cloudinary from "../utils/cloudinary";
import type { CloudinaryFile } from "../types/types";

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: id },

      include: {
        user: {
          select: {
            id: true,
            userName: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                userName: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                userName: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, userId } = req.body || {};

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id: ${userId} do not exist` });
    }

    const files =
      (req.files as { [fieldname: string]: CloudinaryFile[] }) || {};

    const imageUrl = files?.image?.[0]?.path || null;
    const imageId =
      files?.image?.[0]?.filename || files?.image?.[0]?.public_id || null;

    const post = await prisma.post.create({
      data: {
        content,
        user_id: userId,
        image: imageUrl,
        imageId: imageId,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const updatePost = (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const deletePost = (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};
