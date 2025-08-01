"use server";

import { auth } from "@clerk/nextjs/server";
import { CreatePostProps, PostWithAuthor } from "./types";
import prisma from "./db";

export const createPost = async (data: CreatePostProps) => {
  const { title, content } = data;

  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    return { success: true, data: post };
  } catch (error) {
    console.error("Error creating post", error);
    return { success: false, message: "Failed to create post" };
  }
};

export const fetchAllPosts = async (): Promise<PostWithAuthor[]> => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  return posts;
};

export const fetchPostById = async (id: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!post) {
      return { success: false, message: "Post not found" };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, message: "Failed to fetch post" };
  }
};

export const updatePost = async (id: string, data: CreatePostProps) => {
  const { title, content } = data;

  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating post", error);
    return { success: false, message: "Failed to update post" };
  }
};

export async function deletePostById(id: string) {
  try {
    const post = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    if (!post) {
      return { success: false, message: "Post not found" };
    }

    return { success: true, message: "Post deleted" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Failed to delete post" };
  }
}
