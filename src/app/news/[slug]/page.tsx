import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { getPost } from "@/lib/data";
import { formatDate } from "@/lib/format";
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
        <p className="font-semibold text-emerald-800">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-stone-950">{post.title}</h1>
        {post.coverImageUrl ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <MarkdownContent content={post.content} className="mt-8" />
      </article>
    </PublicLayout>
  );
}
