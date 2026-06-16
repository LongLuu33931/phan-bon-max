import type { MetadataRoute } from "next";
import { getCategories, getPosts, getProducts } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
