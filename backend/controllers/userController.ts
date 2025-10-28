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

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

    const user = await prisma.user.findUnique({
      where: isMongoId ? { id } : { auth0ID: id },
      include: {
        posts: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
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
      return res
        .status(404)
        .json({ message: "No user with the specified id exists" });
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
      null;

    const bannerImageUrl = files?.profileBanner?.[0]?.path || null;
    const bannerImageId =
      files?.profileBanner?.[0]?.filename ||
      files?.profileBanner?.[0]?.public_id ||
      null;

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

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const files = req.files as
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | undefined;

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const existingUser = await prisma.user.findUnique({
      where: isMongoId ? { id } : { auth0ID: id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileImageUrl = existingUser.profileImage;
    let profileImageId = existingUser.profileImageId;
    let profileBannerUrl = existingUser.profileBanner;
    let profileBannerId = existingUser.profileBannerId;

    if (files?.profileImage?.[0]) {
      const file = files.profileImage[0];

      if (existingUser.profileImageId) {
        await cloudinary.uploader.destroy(existingUser.profileImageId);
      }

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile-images", upload_preset: "unsigned_upload" },

          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      profileImageUrl = result.secure_url;
      profileImageId = result.public_id;
    }

    if (files?.profileBanner?.[0]) {
      const file = files.profileBanner[0];

      if (existingUser.profileBannerId) {
        await cloudinary.uploader.destroy(existingUser.profileBannerId);
      }

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "banners", upload_preset: "unsigned_upload" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      profileBannerUrl = result.secure_url;
      profileBannerId = result.public_id;
    }
    const updatedUser = await prisma.user.update({
      where: isMongoId ? { id } : { auth0ID: id },
      data: {
        userName,
        email,
        bio,
        profileImage: profileImageUrl,
        profileImageId,
        profileBanner: profileBannerUrl,
        profileBannerId,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(500).json({ message: error.message || "Failed to update user" });
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
      return res.status(404).json({ message: "No user found" });
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
