import { BlogPostList } from "@/components/blog-post-list";

export default async function Home() {
  return (
    <main className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Latest Post</h1>
        <p className="text-muted-foreground mt-2">
          Explore the latest articles and insights
        </p>
      </div>

      <BlogPostList />
    </main>
  );
}
