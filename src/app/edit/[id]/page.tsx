import { fetchPostById } from "@/lib/actions";
import { EditPost } from "./EditPost";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, data } = await fetchPostById(id);

  if (!success || !data) return <div>Post not found</div>;

  return <EditPost id={id} post={data} />;
}
