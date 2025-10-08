import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

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
          include: {
            likes: {
              include: {
                user: true,
              },
            },
            comments: {
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
    const { userName, email, bio, profileImage, profileBanner, role } =
      req.body;
    const user = await prisma.user.create({
      data: {
        userName,
        email,
        bio,
        profileImage,
        profileBanner,
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
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
