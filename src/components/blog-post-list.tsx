import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDate } from "@/lib/utils";
import { Separator } from "./ui/separator";
import DOMPurify from "isomorphic-dompurify";
import { fetchAllPosts } from "@/lib/actions";

export const BlogPostList = async () => {
  const posts = await fetchAllPosts();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <Card>
            <CardHeader className="line-clamp-2">
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm opacity-80 line-clamp-2">
                {DOMPurify.sanitize(post.content.slice(0, 100), {
                  ALLOWED_TAGS: [],
                })}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <div className="flex gap-2 items-center h-5">
                <span>
                  {post.author
                    ? post.author?.firstName + " " + post.author?.lastName
                    : "Anonymous"}
                </span>
                <Separator orientation="vertical" />
                <span>
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};
