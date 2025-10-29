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
        user: true,
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

    const postAuthor = await prisma.user.findUnique({ where: { id: userId } });
    if (!postAuthor) {
      return res
        .status(404)
        .json({ message: `User with id: ${userId} does not exist` });
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    let imageUrl: string | null = null;
    let imageId: string | null = null;

    if (files?.image?.[0]) {
      const file = files.image[0];

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "post-images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

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
    console.error("Create post error:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const files =
      (req.files as { [fieldname: string]: CloudinaryFile[] }) || {};

    const imageUrl = files?.image?.[0]?.path || null;
    const imageId =
      files?.image?.[0]?.filename || files?.image?.[0]?.public_id || null;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        content,
        image: imageUrl,
        imageId: imageId,
      },
    });
    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post?.imageId) {
      await cloudinary.uploader.destroy(post.imageId);
    }

    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: "Post was deleted successfully", post });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};
