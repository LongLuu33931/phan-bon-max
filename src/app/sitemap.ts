import type { MetadataRoute } from "next";
import { getCategories, getPosts, getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://phanbonmax8000.com";
  const [products, categories, posts] = await Promise.all([getProducts(), getCategories(), getPosts()]);

  return [
    "",
    "/about",
    "/products",
    "/news",
    "/contact",
    ...products.map((product) => `/products/${product.slug}`),
    ...categories.map((category) => `/category/${category.slug}`),
    ...posts.map((post) => `/news/${post.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
