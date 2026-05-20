import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/types";

function NewsCard({ post }: { post: Post }) {
    const isPress = post.postType === "press";
    const href = isPress ? post.externalUrl || "#" : `/news/${post.slug}`;

    const inner = (
        <>
            <div className="relative aspect-[16/9] bg-emerald-50">
                {post.coverImageUrl ? (
                    <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-emerald-900 text-sm font-black uppercase tracking-[0.14em] text-amber-200">
                        {isPress ? "Báo chí" : "Tin tức"}
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-emerald-800">
                        {isPress ? "Báo chí" : "Tin tức"}
                    </p>
                    {isPress ? (
                        <ExternalLink size={13} className="text-stone-400" />
                    ) : null}
                </div>
                <h3 className="mt-2 line-clamp-2 text-xl font-bold text-stone-950">
                    {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
                    {post.excerpt}
                </p>
            </div>
        </>
    );

    if (isPress) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl"
            >
                {inner}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl"
        >
            {inner}
        </Link>
    );
}

export function HomeNewsSection({ posts }: { posts: Post[] }) {
    const displayPosts = posts.slice(0, 6);

    return (
        <section className="section py-14">
            <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="text-3xl font-black text-stone-950">Tin tức</h2>
                <Link
                    href="/news"
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-800"
                >
                    Xem tất cả <ArrowRight size={16} />
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {displayPosts.map((post) => (
                    <NewsCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}
