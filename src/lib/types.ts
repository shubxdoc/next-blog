import { Post, User } from "@prisma/client";

export interface CreatePostProps {
  title: string;
  content: string;
}

export type PostWithAuthor = Post & { author: User };
