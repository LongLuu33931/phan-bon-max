import { unstable_noStore as noStore } from "next/cache";
import { categories, getActiveProducts, posts, products, siteSettings, testimonials } from "./seed-data";
import { supabaseConfigured } from "./supabase";
import { createSupabaseAdminClient } from "./supabase-admin";
import { createSupabaseServerClient } from "./supabase-server";
import { getPostgresPool, postgresConfigured } from "./postgres";
import type { Category, ContactMessage, Order, OrderItem, Post, Product, Testimonial } from "./types";

const productMedia: Record<string, string[]> = {
  "rootmax-npk8000": [
    "/product-images/rootmax-npk8000/rootmax.jpg",
    "/product-images/rootmax-npk8000/16640ca628dca982f0cd.jpg",
  ],
  "soil-max-8000": [
    "/product-images/soil-max-8000/soil-max.jpg",
    "/product-images/soil-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-15-02-01.png",
  ],
  "recover-max-8000": [
    "/product-images/recover-max-8000/RECOVER-MAX-8000.jpg",
    "/product-images/recover-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-15-19-35.png",
  ],
  "grow-max-8000": [
    "/product-images/grow-max-8000/GROW-MAX-8000.jpg",
    "/product-images/grow-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-40-36.png",
  ],
  "grow-max-npk-8000": [
    "/product-images/grow-max-8000/GROW-MAX-8000.jpg",
    "/product-images/grow-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-40-36.png",
  ],
  "shoot-max-8000": [
    "/product-images/shoot-max-8000/z7662479580439-bba693d61637eaa2cb402b525a5ad6ff.jpg",
  ],
  "shoot-max-npk-8000": [
    "/product-images/shoot-max-8000/z7662479580439-bba693d61637eaa2cb402b525a5ad6ff.jpg",
  ],
  "leaf-max-8000": [
    "/product-images/leaf-max-8000/LEAF-MAX-8000.jpg",
    "/product-images/leaf-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-15-04.png",
  ],
  "leaf-max-npk-8000": [
    "/product-images/leaf-max-8000/LEAF-MAX-8000.jpg",
    "/product-images/leaf-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-15-04.png",
  ],
  "fruit-max-npk-8000": [
    "/product-images/fruit-max-npk-8000/FRUIT-MAX-8000.jpg",
    "/product-images/fruit-max-npk-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-31-11.png",
  ],
  "stem-max-8000": [
    "/product-images/stem-max-npk-8000/STEM-MAX-8000.jpg",
    "/product-images/stem-max-npk-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-21-06.png",
  ],
  "stem-max-npk-8000": [
    "/product-images/stem-max-npk-8000/STEM-MAX-8000.jpg",
    "/product-images/stem-max-npk-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-21-06.png",
  ],
  "flower-max-8000": [
    "/product-images/flower-max-8000/FLOWER-MAX-8000.jpg",
    "/product-images/flower-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-55-54.png",
  ],
  "cal-max-8000": [
    "/product-images/cal-max-8000/CAL-MAX-8000.jpg",
    "/product-images/cal-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-06-23.png",
  ],
};

function fallbackImages(slug: string, name: string) {
  return (productMedia[slug] ?? []).map((url, index) => ({
    url,
    alt: name,
    isPrimary: index === 0,
  }));
}

function mapProduct(row: Record<string, unknown>): Product {
  const name = String(row.name);
  const slug = String(row.slug);
  const images = Array.isArray(row.images) && row.images.length
    ? (row.images as Product["images"])
    : fallbackImages(slug, name);

  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    name,
    slug,
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
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : images[0]?.url,
    images,
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

function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    role: String(row.role ?? ""),
    province: String(row.province ?? ""),
    crop: String(row.crop ?? ""),
    quote: String(row.quote ?? ""),
    rating: Number(row.rating ?? 5),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id: String(row.id),
    productId: row.product_id ? String(row.product_id) : undefined,
    productName: String(row.product_name_snapshot ?? ""),
    price: Number(row.price_snapshot ?? 0),
    quantity: Number(row.quantity ?? 0),
    lineTotal: Number(row.line_total ?? 0),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  const rawItems = Array.isArray(row.order_items) ? row.order_items : [];

  return {
    id: String(row.id),
    orderCode: String(row.order_code ?? ""),
    customerName: String(row.customer_name ?? ""),
    phone: String(row.phone ?? ""),
    address: String(row.address ?? ""),
    province: String(row.province ?? ""),
    note: row.note ? String(row.note) : undefined,
    status: (row.status as Order["status"]) ?? "new",
    totalAmount: Number(row.total_amount ?? 0),
    createdAt: String(row.created_at ?? ""),
    items: rawItems.map((item) => mapOrderItem(item as Record<string, unknown>)),
  };
}

function mapContactMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    customerName: String(row.customer_name ?? ""),
    phone: String(row.phone ?? ""),
    email: row.email ? String(row.email) : undefined,
    province: row.province ? String(row.province) : undefined,
    crop: row.crop ? String(row.crop) : undefined,
    message: String(row.message ?? ""),
    status: (row.status as ContactMessage["status"]) ?? "new",
    createdAt: String(row.created_at ?? ""),
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

export async function getAllCategoriesForAdmin() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select * from public.categories order by sort_order asc, updated_at desc",
    );
    return rows.map(mapCategory);
  }
  if (!supabaseConfigured) return categories;
  noStore();
  const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

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

export async function getAllPostsForAdmin() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query("select * from public.posts order by updated_at desc");
    return rows.map(mapPost);
  }
  if (!supabaseConfigured) return posts;
  noStore();
  const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  return error || !data?.length ? posts : data.map(mapPost);
}

export async function getSettings() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query("select value from public.site_settings where key = 'site'");
    return { ...siteSettings, ...(rows[0]?.value ?? {}) };
  }
  if (!supabaseConfigured) return siteSettings;
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .maybeSingle();

  return error || !data?.value ? siteSettings : { ...siteSettings, ...(data.value as Partial<typeof siteSettings>) };
}

export async function getTestimonials() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select * from public.testimonials where is_active = true order by sort_order asc, created_at desc",
    );
    return rows.map(mapTestimonial);
  }
  if (!supabaseConfigured) return testimonials.filter((item) => item.isActive);
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return error || !data?.length ? testimonials.filter((item) => item.isActive) : data.map(mapTestimonial);
}

export async function getAllTestimonialsForAdmin() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query("select * from public.testimonials order by sort_order asc, updated_at desc");
    return rows.map(mapTestimonial);
  }
  if (!supabaseConfigured) return testimonials;
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  return error || !data?.length ? testimonials : data.map(mapTestimonial);
}

export async function getOrdersForAdmin() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select * from public.orders order by created_at desc",
    );
    const { rows: itemRows } = await pool!.query("select * from public.order_items");
    return rows.map((row) =>
      mapOrder({
        ...row,
        order_items: itemRows.filter((item) => String(item.order_id) === String(row.id)),
      }),
    );
  }

  if (!supabaseConfigured) return [];

  noStore();
  const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return error || !data?.length ? [] : data.map(mapOrder);
}

export async function getAdminNotificationCounts() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const [orders, contacts] = await Promise.all([
      pool!.query("select count(*)::int as count from public.orders where status = 'new'"),
      pool!.query("select count(*)::int as count from public.contact_messages where status = 'new'"),
    ]);

    return {
      newOrders: Number(orders.rows[0]?.count ?? 0),
      newContacts: Number(contacts.rows[0]?.count ?? 0),
    };
  }

  if (!supabaseConfigured) {
    return { newOrders: 0, newContacts: 0 };
  }

  noStore();
  const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
  const [orders, contacts] = await Promise.all([
    supabase!.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase!.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return {
    newOrders: orders.error ? 0 : orders.count ?? 0,
    newContacts: contacts.error ? 0 : contacts.count ?? 0,
  };
}

export async function getContactMessagesForAdmin() {
  if (!supabaseConfigured && postgresConfigured) {
    noStore();
    const pool = getPostgresPool();
    const { rows } = await pool!.query("select * from public.contact_messages order by created_at desc");
    return rows.map(mapContactMessage);
  }

  if (!supabaseConfigured) return [];

  noStore();
  const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return error || !data?.length ? [] : data.map(mapContactMessage);
}
