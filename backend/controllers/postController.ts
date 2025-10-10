import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import cloudinary from "../utils/cloudinary";
import type { CloudinaryFile } from "../types/types";

const prisma = new PrismaClient();

export const getPosts = (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const getPostById = (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error has occurred" });
    }
  }
};

export const createPost = (req: Request, res: Response) => {
  try {
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
