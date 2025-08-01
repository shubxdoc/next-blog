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
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import RichTextEditor from "@/components/RichTextEditor";
import { useEditorStore } from "@/store/use-editor-store";
import { createPost } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function CreatePage() {
  const { editor } = useEditorStore();
  const { isLoaded, userId } = useAuth();
  const route = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
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
      const result = await createPost({
        title: values.title,
        content: bodyHTML,
      });

      if (result.success) {
        toast.success("Post created", {
          duration: 2000,
        });
        route.push("/");
      }
    } catch (error) {
      console.error("Failed to create post", error);
      toast.error("Failed to create Post");
    }

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  if (!isLoaded) {
    return (
      <div className="h-[80vh] w-full grid place-content-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href={"/dashboard"}>
            <ArrowLeft /> Back
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

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
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}
