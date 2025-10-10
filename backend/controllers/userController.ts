import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import cloudinary from "../utils/cloudinary";
import type { CloudinaryFile } from "../types/types";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        posts: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            likes: {
              include: {
                user: true,
              },
            },
            comments: {
              orderBy: [{ createdAt: "desc" }],
              include: {
                likes: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            post: true,
            likes: true,
          },
        },
      },
    });
    if (!user) {
      res.status(404).json({ message: "No user with the specified id exists" });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, bio, role } = req.body || {};
    const files =
      (req.files as { [fieldname: string]: CloudinaryFile[] }) || {};

    const profileImageUrl = files?.profileImage?.[0]?.path || null;
    const profileImageId =
      files?.profileImage?.[0]?.filename ||
      files?.profileImage?.[0]?.public_id ||
      "";

    const bannerImageUrl = files?.profileBanner?.[0]?.path || null;
    const bannerImageId =
      files?.profileBanner?.[0]?.filename ||
      files?.profileBanner?.[0]?.public_id ||
      "";

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        bio,
        profileImage: profileImageUrl,
        profileImageId: profileImageId,
        profileBanner: bannerImageUrl,
        profileBannerId: bannerImageId,
        role,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error has occurred" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userName, email, bio } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (files?.profileImage && existingUser.profileImageId) {
      await cloudinary.uploader.destroy(existingUser.profileImageId);
    }
    if (files?.profileBanner && existingUser.profileBannerId) {
      await cloudinary.uploader.destroy(existingUser.profileBannerId);
    }

    const profileImageUrl =
      files?.profileImage?.[0]?.path || existingUser.profileImage;
    const profileImageId =
      files?.profileImage?.[0]?.filename || existingUser.profileImageId;

    const bannerImageUrl =
      files?.profileBanner?.[0]?.path || existingUser.profileBanner;
    const bannerImageId =
      files?.profileBanner?.[0]?.filename || existingUser.profileBannerId;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        userName,
        email,
        bio,
        profileImage: profileImageUrl,
        profileImageId: profileImageId,
        profileBanner: bannerImageUrl,
        profileBannerId: bannerImageId,
      },
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error has occurred" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user?.profileImageId) {
      await cloudinary.uploader.destroy(user.profileImageId);
    }
    if (user?.profileBannerId) {
      await cloudinary.uploader.destroy(user.profileBannerId);
    }

    await prisma.user.delete({
      where: { id },
    });
    if (!user) {
      res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ message: "User was deleted successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error has occurred" });
    }
  }
};
