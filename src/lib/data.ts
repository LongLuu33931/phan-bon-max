import { unstable_noStore as noStore } from "next/cache";
import { categories, getActiveProducts, posts, products, siteSettings } from "./seed-data";
import { supabaseConfigured } from "./supabase";
import { createSupabaseServerClient } from "./supabase-server";
import { getPostgresPool, postgresConfigured } from "./postgres";
import type { Category, Post, Product } from "./types";

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    name: String(row.name),
    slug: String(row.slug),
    sku: String(row.sku ?? "LIEN-HE"),
    price: Number(row.price ?? 0),
    origin: String(row.origin ?? "Việt Nam"),
    shelfLife: String(row.shelf_life ?? "24 tháng"),
    shortDescription: String(row.short_description ?? ""),
    description: String(row.description ?? ""),
    specs: Array.isArray(row.specs) ? (row.specs as Product["specs"]) : [],
    benefits: Array.isArray(row.benefits) ? (row.benefits as Product["benefits"]) : [],
    usageRows: Array.isArray(row.usage_rows) ? (row.usage_rows as Product["usageRows"]) : [],
    reasons: Array.isArray(row.reasons) ? (row.reasons as string[]) : [],
    note: row.note ? String(row.note) : undefined,
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    images: Array.isArray(row.images) ? (row.images as Product["images"]) : [],
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active),
    relatedSlugs: Array.isArray(row.related_slugs) ? (row.related_slugs as string[]) : [],
    seoTitle: String(row.seo_title ?? row.name ?? ""),
    seoDescription: String(row.seo_description ?? row.short_description ?? ""),
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
    isActive: Boolean(row.is_active),
  };
}

function mapPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : undefined,
    status: row.status === "draft" ? "draft" : "published",
    publishedAt: String(row.published_at ?? ""),
  };
}

export async function getCategories() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select * from public.categories where is_active = true order by sort_order asc",
    );
    return rows.map(mapCategory);
  }
  if (!supabaseConfigured) return categories;
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return error || !data?.length ? categories : data.map(mapCategory);
}

export async function getProducts() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select * from public.products where is_active = true order by sort_order asc",
    );
    return rows.map(mapProduct);
  }
  if (!supabaseConfigured) return getActiveProducts();
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return error || !data?.length ? getActiveProducts() : data.map(mapProduct);
}

export async function getAllProductsForAdmin() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query("select * from public.products order by updated_at desc");
    return rows.map(mapProduct);
  }
  if (!supabaseConfigured) return products;
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  return error || !data?.length ? products : data.map(mapProduct);
}

export async function getProduct(slug: string) {
  const all = await getProducts();
  return all.find((product) => product.slug === slug);
}

export async function getCategory(slug: string) {
  const all = await getCategories();
  return all.find((category) => category.slug === slug);
}

export async function getProductsByCategory(slug: string) {
  const [category, all] = await Promise.all([getCategory(slug), getProducts()]);
  if (!category) return [];
  return all.filter((product) => product.categoryId === category.id);
}

export async function getRelatedProducts(product: Product) {
  const all = await getProducts();
  return product.relatedSlugs
    .map((slug) => all.find((item) => item.slug === slug))
    .filter((item): item is Product => Boolean(item));
}

export async function getPosts() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select * from public.posts where status = 'published' order by published_at desc",
    );
    return rows.map(mapPost);
  }
  if (!supabaseConfigured) return posts.filter((post) => post.status === "published");
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return error || !data?.length ? posts.filter((post) => post.status === "published") : data.map(mapPost);
}

export async function getPost(slug: string) {
  const all = await getPosts();
  return all.find((post) => post.slug === slug);
}

export async function getSettings() {
  return siteSettings;
}
