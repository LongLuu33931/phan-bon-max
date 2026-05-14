import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";
import { PublicLayout } from "../../(public-layout)";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <PublicLayout>
      <article className="section max-w-4xl py-10">
        <p className="font-semibold text-emerald-800">{post.publishedAt}</p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-stone-950">{post.title}</h1>
        <p className="mt-6 text-lg leading-8 text-stone-700">{post.content}</p>
      </article>
    </PublicLayout>
  );
}
