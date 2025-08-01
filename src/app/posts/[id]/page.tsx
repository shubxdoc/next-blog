import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchPostById } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Edit2Icon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { userId } = await auth();

  const { data, success } = await fetchPostById(id);

  if (!success) notFound();

  const isAuthorAdmin = data?.authorId === userId;

  return (
    <>
      <div className="mb-6 flex gap-4 items-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft /> Back
          </Link>
        </Button>

        {isAuthorAdmin && (
          <>
            <Button asChild variant="outline">
              <Link href={`/edit/${id}`}>
                <Edit2Icon /> Edit
              </Link>
            </Button>
          </>
        )}
      </div>
      <article className="max-w-5xl mx-auto">
        <h1 className="shadcnHeading">{data?.title}</h1>
        <div className="h-4 w-full flex items-center space-x-2 text-muted-foreground text-sm">
          <span>{`${data?.author.firstName} ${data?.author.lastName}`}</span>
          <Separator orientation="vertical" className="bg-gray-400" />
          <time dateTime={data?.createdAt.toISOString()}>
            {data?.createdAt ? formatDate(data.createdAt) : "Unknown date"}
          </time>
        </div>

        <RichTextEditor value={data?.content} readOnly />
      </article>
    </>
  );
}
