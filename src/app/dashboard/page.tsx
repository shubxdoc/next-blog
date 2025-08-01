import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return;

  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          My Posts
        </h1>
        {posts.length > 0 && (
          <Button asChild>
            <Link href={"/create"}>
              <PlusIcon />
              Create
            </Link>
          </Button>
        )}
      </div>

      {posts.length == 0 ? (
        <div className="text-center py-20">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            You haven't created any post
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6 mb-5">
            Get started by creating your first post
          </p>

          <Button asChild>
            <Link href={"/create"}>
              <PlusIcon />
              Create Your First Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex items-center justify-around gap-5">
                <CardTitle>{post.title}</CardTitle>
                <span>
                  <DeletePostButton id={post.id} />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-sm opacity-70 line-clamp-2">
                  {DOMPurify.sanitize(post.content.slice(0, 100), {
                    ALLOWED_TAGS: [],
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/posts/${post.id}`}>View</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/edit/${post.id}`}>Edit</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
