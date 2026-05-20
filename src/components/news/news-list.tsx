import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function NewsList({ posts }: { posts: Post[] }) {
    const articles = posts.filter((post) => post.postType !== "press");
    const pressItems = posts.filter((post) => post.postType === "press");

    return (
        <section className="section py-10">
            <h2 className="text-2xl font-black text-stone-950">Tin tức</h2>

            {articles.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {articles.map((post) => (
                        <Link
                            key={post.id}
                            href={`/news/${post.slug}`}
                            className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl"
                        >
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
                                        Tin tức
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <p className="text-sm font-semibold text-emerald-800">
                                    {formatDate(post.publishedAt)}
                                </p>
                                <h2 className="mt-2 line-clamp-2 text-xl font-bold text-stone-950">
                                    {post.title}
                                </h2>
                                <p className="mt-3 line-clamp-2 leading-7 text-stone-600">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : null}

            {pressItems.length > 0 ? (
                <>
                    <h2 className="mt-14 text-2xl font-black text-stone-950">
                        Báo chí nói về chúng tôi
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {pressItems.map((post) => (
                            <a
                                key={post.id}
                                href={post.externalUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl"
                            >
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
                                            Báo chí
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="line-clamp-2 text-xl font-bold text-stone-950">
                                        {post.title}
                                    </h3>
                                    <p className="mt-3 line-clamp-2 leading-7 text-stone-600">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            ) : null}
        </section>
    );
}
