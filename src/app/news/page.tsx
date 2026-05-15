import type { Metadata } from "next";
import { NewsList } from "@/components/news/news-list";
import { getPosts } from "@/lib/data";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Tin tức" };

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <PublicLayout>
      <NewsList posts={posts} />
    </PublicLayout>
  );
}
