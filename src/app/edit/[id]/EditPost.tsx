"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import FullScreenLoader from "@/components/full-screen-loader";
import RichTextEditor from "@/components/RichTextEditor";
import { updatePost } from "@/lib/actions";
import { useEditorStore } from "@/store/use-editor-store";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 5 characters.",
  }),
  content: z
    .string()
    .max(3000, {
      message: "3000 characters limit",
    })
    .min(20, {
      message: "Content must be at least 20 characters.",
    }),
});

export function EditPost({
  id,
  post,
}: {
  id: string;
  post: { title: string; content: string };
}) {
  const { editor } = useEditorStore();
  const { isLoaded, userId } = useAuth();
  const route = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  const { isSubmitting } = form.formState; // form submitting state

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bodyHTML = editor?.getHTML();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!bodyHTML) return;

    try {
      const result = await updatePost(id, {
        title: values.title,
        content: bodyHTML,
      });

      if (result.success) {
        route.push(`/posts/${id}`);
        toast.success("Post updated", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to update post", error);
      toast.error("Failed to update Post");
    }
  }

  if (!isLoaded) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href={`/posts/${id}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

      <Suspense fallback={<FullScreenLoader />}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-6xl"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className="min-h-14"
                      placeholder="Enter Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </Suspense>
    </>
  );
}
