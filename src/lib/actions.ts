"use server";

import { randomUUID } from "node:crypto";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { contactMessageSchema, checkoutSchema, postSchema, productSchema, siteSettingsSchema, testimonialSchema } from "./schemas";
import { supabaseConfigured } from "./supabase";
import { createSupabaseAdminClient } from "./supabase-admin";
import { createSupabaseServerClient } from "./supabase-server";
import { products } from "./seed-data";
import { getPostgresPool, postgresConfigured } from "./postgres";

export type ActionState = {
  ok: boolean;
  message: string;
};

const orderStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "confirmed", "shipping", "completed", "cancelled"]),
});

const orderCustomerInfoSchema = z.object({
  id: z.string().min(1),
  address: z.string().trim().min(6, "Vui lòng nhập địa chỉ giao hàng"),
  province: z.string().trim().min(2, "Vui lòng nhập tỉnh/thành"),
  note: z.string().trim().optional(),
});

const contactStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "closed"]),
});

const POST_IMAGE_BUCKET = "post-images";

async function requireAdmin() {
  if (!supabaseConfigured) return true;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  return Boolean(user);
}

function getSafeFileName(fileName: string) {
  const ext = fileName.split(".").pop() || "jpg";
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${baseName || "image"}.${ext}`;
}

function getSafeFolderName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "post";
}

async function ensurePostImagesBucket() {
  const adminSupabase = createSupabaseAdminClient();
  if (!adminSupabase) return;

  await adminSupabase.storage.createBucket(POST_IMAGE_BUCKET, { public: true });
}

async function uploadPostImageFile(file: File, folder: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Vui lòng chọn file hình ảnh.");
  }

  if (!supabaseConfigured) {
    throw new Error("Chưa cấu hình Supabase để upload hình ảnh.");
  }

  await ensurePostImagesBucket();
  const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
  const safeFolder = getSafeFolderName(folder);
  const path = `${safeFolder}/${Date.now()}-${getSafeFileName(file.name)}`;
  const { error } = await supabase!.storage
    .from(POST_IMAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined });

  if (error) throw new Error(error.message);

  const { data } = supabase!.storage.from(POST_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateOrderStatus(_: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "Bạn cần đăng nhập để cập nhật đơn hàng." };
  }

  const parsed = orderStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Trạng thái đơn hàng chưa hợp lệ." };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return { ok: false, message: "Chưa cấu hình database để cập nhật đơn hàng." };
  }

  if (supabaseConfigured) {
    const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
    const { error } = await supabase!
      .from("orders")
      .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
      .eq("id", parsed.data.id);

    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    await pool!.query("update public.orders set status = $1, updated_at = now() where id = $2::uuid", [
      parsed.data.status,
      parsed.data.id,
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { ok: true, message: "Đã cập nhật trạng thái đơn hàng." };
}

export async function updateOrderCustomerInfo(_: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "Bạn cần đăng nhập để cập nhật đơn hàng." };
  }

  const parsed = orderCustomerInfoSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin giao hàng chưa hợp lệ." };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return { ok: false, message: "Chưa cấu hình database để cập nhật đơn hàng." };
  }

  const payload = {
    address: parsed.data.address,
    province: parsed.data.province,
    note: parsed.data.note || null,
    updated_at: new Date().toISOString(),
  };

  if (supabaseConfigured) {
    const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
    const { error } = await supabase!.from("orders").update(payload).eq("id", parsed.data.id);
    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    await pool!.query("update public.orders set address = $1, province = $2, note = $3, updated_at = now() where id = $4::uuid", [
      payload.address,
      payload.province,
      payload.note,
      parsed.data.id,
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { ok: true, message: "Đã cập nhật thông tin giao hàng." };
}

export async function updateContactMessageStatus(_: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "Bạn cần đăng nhập để cập nhật liên hệ." };
  }

  const parsed = contactStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Trạng thái liên hệ chưa hợp lệ." };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return { ok: false, message: "Chưa cấu hình database để cập nhật liên hệ." };
  }

  if (supabaseConfigured) {
    const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
    const { error } = await supabase!
      .from("contact_messages")
      .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
      .eq("id", parsed.data.id);

    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    await pool!.query("update public.contact_messages set status = $1, updated_at = now() where id = $2::uuid", [
      parsed.data.status,
      parsed.data.id,
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  return { ok: true, message: "Đã cập nhật trạng thái liên hệ." };
}

export async function saveContactMessage(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactMessageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin liên hệ chưa hợp lệ" };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return { ok: false, message: "Chưa cấu hình Supabase env để nhận liên hệ." };
  }

  const payload = {
    customer_name: parsed.data.customerName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    province: parsed.data.province || null,
    crop: parsed.data.crop || null,
    message: parsed.data.message,
    status: "new",
  };

  if (supabaseConfigured) {
    const supabase = createSupabaseAdminClient() ?? await createSupabaseServerClient();
    const { error } = await supabase!.from("contact_messages").insert(payload);
    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    await pool!.query(
      `insert into public.contact_messages (customer_name, phone, email, province, crop, message, status)
       values ($1,$2,$3,$4,$5,$6,'new')`,
      [payload.customer_name, payload.phone, payload.email, payload.province, payload.crop, payload.message],
    );
  }

  revalidatePath("/admin/contacts");
  return { ok: true, message: "Đã gửi thông tin. MAX 8000 sẽ liên hệ lại sớm." };
}

export async function createCheckoutOrder(payload: unknown): Promise<ActionState & { orderCode?: string }> {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ" };
  }

  const requested = parsed.data.items;
  let sourceProducts: Array<{ id: string; name: string; price: number }> = products.filter((product) =>
    requested.some((item) => item.productId === product.id),
  );

  let supabase = null;
  if (supabaseConfigured) {
    supabase = await createSupabaseServerClient();
    const { data, error } = await supabase!
      .from("products")
      .select("id,name,price")
      .in("id", requested.map((item) => item.productId))
      .eq("is_active", true);
    if (error) return { ok: false, message: error.message };
    sourceProducts = data ?? [];
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    const { rows } = await pool!.query(
      "select id,name,price from public.products where id = any($1::uuid[]) and is_active = true",
      [requested.map((item) => item.productId)],
    );
    sourceProducts = rows;
  }

  const items = requested.map((item) => {
    const product = sourceProducts.find((entry) => entry.id === item.productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");
    return {
      product_id: product.id,
      product_name_snapshot: product.name,
      price_snapshot: product.price,
      quantity: item.quantity,
      line_total: product.price * item.quantity,
    };
  });

  const total = items.reduce((sum, item) => sum + item.line_total, 0);
  const orderId = randomUUID();
  const orderCode = `MAX${Date.now().toString().slice(-8)}`;

  if (supabaseConfigured) {
    const { error } = await supabase!
      .from("orders")
      .insert({
        id: orderId,
        order_code: orderCode,
        customer_name: parsed.data.customerName,
        phone: parsed.data.phone,
        address: parsed.data.address,
        province: parsed.data.province,
        note: parsed.data.note,
        status: "new",
        total_amount: total,
      });

    if (error) return { ok: false, message: error.message };

    const { error: itemError } = await supabase!
      .from("order_items")
      .insert(items.map((item) => ({ ...item, order_id: orderId })));

    if (itemError) return { ok: false, message: itemError.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    const client = await pool!.connect();
    try {
      await client.query("begin");
      const { rows } = await client.query(
        `insert into public.orders (order_code, customer_name, phone, address, province, note, status, total_amount)
         values ($1,$2,$3,$4,$5,$6,'new',$7)
         returning id`,
        [
          orderCode,
          parsed.data.customerName,
          parsed.data.phone,
          parsed.data.address,
          parsed.data.province,
          parsed.data.note,
          total,
        ],
      );
      for (const item of items) {
        await client.query(
          `insert into public.order_items
           (order_id, product_id, product_name_snapshot, price_snapshot, quantity, line_total)
           values ($1,$2,$3,$4,$5,$6)`,
          [
            rows[0].id,
            item.product_id,
            item.product_name_snapshot,
            item.price_snapshot,
            item.quantity,
            item.line_total,
          ],
        );
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      return { ok: false, message: error instanceof Error ? error.message : "Không lưu được đơn hàng" };
    } finally {
      client.release();
    }
  }

  if (process.env.RESEND_API_KEY && process.env.ORDER_NOTIFY_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.ORDER_EMAIL_FROM ?? "MAX 8000 <orders@phanbonmax8000.com>",
        to: process.env.ORDER_NOTIFY_EMAIL,
        subject: `Đơn hàng mới ${orderCode}`,
        text: [
          `Khách: ${parsed.data.customerName}`,
          `SĐT: ${parsed.data.phone}`,
          `Địa chỉ: ${parsed.data.address}, ${parsed.data.province}`,
          `Tổng tiền: ${total}`,
          `Ghi chú: ${parsed.data.note ?? ""}`,
        ].join("\n"),
      });
    } catch {
      return { ok: true, orderCode, message: "Đơn đã lưu, email thông báo chưa gửi được." };
    }
  }

  return { ok: true, orderCode, message: "Đặt hàng thành công" };
}

function getProductImageStoragePath(publicUrl: string) {
  return getStoragePublicPath(publicUrl, "product-images");
}

function getStoragePublicPath(publicUrl: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(publicUrl.slice(index + marker.length));
}

export async function saveTestimonial(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = testimonialSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    isFeatured: formData.has("isFeatured"),
    isActive: formData.has("isActive"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Feedback chưa hợp lệ" };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return {
      ok: false,
      message: "Chưa cấu hình Supabase env. Form đã sẵn sàng, hãy thêm env rồi lưu vào database thật.",
    };
  }

  const payload = {
    customer_name: parsed.data.customerName,
    role: parsed.data.role,
    province: parsed.data.province,
    crop: parsed.data.crop,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
    avatar_url: parsed.data.avatarUrl || null,
    sort_order: parsed.data.sortOrder,
    is_featured: parsed.data.isFeatured,
    is_active: parsed.data.isActive,
    updated_at: new Date().toISOString(),
  };

  const id = formData.get("id")?.toString();
  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const query = id
      ? supabase!.from("testimonials").update(payload).eq("id", id)
      : supabase!.from("testimonials").insert(payload);
    const { error } = await query;

    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    const values = [
      payload.customer_name,
      payload.role,
      payload.province,
      payload.crop,
      payload.quote,
      payload.rating,
      payload.avatar_url,
      payload.sort_order,
      payload.is_featured,
      payload.is_active,
      id,
    ];
    if (id) {
      await pool!.query(
        `update public.testimonials set
          customer_name=$1,role=$2,province=$3,crop=$4,quote=$5,rating=$6,avatar_url=$7,
          sort_order=$8,is_featured=$9,is_active=$10,updated_at=now()
         where id=$11::uuid`,
        values,
      );
    } else {
      await pool!.query(
        `insert into public.testimonials
          (customer_name,role,province,crop,quote,rating,avatar_url,sort_order,is_featured,is_active)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        values.slice(0, 10),
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { ok: true, message: "Đã lưu feedback khách hàng" };
}

export async function savePost(_: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "Bạn cần đăng nhập để lưu bài viết." };
  }

  const parsed = postSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Bài viết chưa hợp lệ" };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return {
      ok: false,
      message: "Chưa cấu hình database. Form đã sẵn sàng, hãy thêm env rồi lưu vào database thật.",
    };
  }

  const publishedAt = parsed.data.status === "published"
    ? parsed.data.publishedAt || new Date().toISOString()
    : parsed.data.publishedAt || null;
  const coverImage = formData.get("coverImage");
  let coverImageUrl = parsed.data.coverImageUrl || null;

  try {
    if (coverImage instanceof File && coverImage.size > 0) {
      coverImageUrl = await uploadPostImageFile(coverImage, parsed.data.slug);
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Không upload được ảnh bìa." };
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    cover_image_url: coverImageUrl,
    seo_title: parsed.data.seoTitle || null,
    seo_description: parsed.data.seoDescription || null,
    status: parsed.data.status,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  };

  const id = formData.get("id")?.toString();
  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const query = id
      ? supabase!.from("posts").update(payload).eq("id", id)
      : supabase!.from("posts").insert(payload);
    const { error } = await query;

    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    const values = [
      payload.title,
      payload.slug,
      payload.excerpt,
      payload.content,
      payload.cover_image_url,
      payload.seo_title,
      payload.seo_description,
      payload.status,
      payload.published_at,
      id,
    ];
    if (id) {
      await pool!.query(
        `update public.posts set
          title=$1,slug=$2,excerpt=$3,content=$4,cover_image_url=$5,seo_title=$6,
          seo_description=$7,status=$8,published_at=$9,updated_at=now()
         where id=$10::uuid`,
        values,
      );
    } else {
      await pool!.query(
        `insert into public.posts
          (title,slug,excerpt,content,cover_image_url,seo_title,seo_description,status,published_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         on conflict (slug) do update set
          title=excluded.title,excerpt=excluded.excerpt,content=excluded.content,
          cover_image_url=excluded.cover_image_url,seo_title=excluded.seo_title,
          seo_description=excluded.seo_description,status=excluded.status,
          published_at=excluded.published_at,updated_at=now()`,
        values.slice(0, 9),
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${parsed.data.slug}`);
  revalidatePath("/admin/posts");
  return { ok: true, message: "Đã lưu bài viết" };
}

export async function uploadPostImage(formData: FormData): Promise<ActionState & { url?: string }> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "Bạn cần đăng nhập để upload hình ảnh." };
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { ok: false, message: "Vui lòng chọn hình ảnh cần upload." };
  }

  try {
    const folder = formData.get("folder")?.toString() || "post";
    const url = await uploadPostImageFile(image, folder);
    return { ok: true, message: "Đã upload hình ảnh.", url };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Không upload được hình ảnh." };
  }
}

export async function saveSiteSettings(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = siteSettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Cấu hình website chưa hợp lệ" };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return {
      ok: false,
      message: "Chưa cấu hình Supabase env. Form đã sẵn sàng, hãy thêm env rồi lưu vào database thật.",
    };
  }

  const logo = formData.get("logo");
  let logoUrl = parsed.data.logoUrl || "";

  if (supabaseConfigured) {
    const adminSupabase = createSupabaseAdminClient();
    const supabase = adminSupabase ?? await createSupabaseServerClient();

    if (logo instanceof File && logo.size > 0) {
      if (adminSupabase) {
        await adminSupabase.storage.createBucket("site-assets", { public: true });
      }

      const ext = logo.name.split(".").pop() || "png";
      const path = `branding/logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase!.storage
        .from("site-assets")
        .upload(path, logo, { upsert: true, contentType: logo.type || undefined });

      if (uploadError) return { ok: false, message: uploadError.message };
      const { data } = supabase!.storage.from("site-assets").getPublicUrl(path);
      const oldLogoPath = logoUrl ? getStoragePublicPath(logoUrl, "site-assets") : null;
      logoUrl = data.publicUrl;
      if (oldLogoPath) await supabase!.storage.from("site-assets").remove([oldLogoPath]);
    }

    if (!logoUrl) return { ok: false, message: "Vui lòng upload logo website." };

    const { error } = await supabase!
      .from("site_settings")
      .upsert({
        key: "site",
        value: { ...parsed.data, logoUrl },
        updated_at: new Date().toISOString(),
      });
    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    await pool!.query(
      `insert into public.site_settings (key, value, updated_at)
       values ('site', $1::jsonb, now())
       on conflict (key) do update set value=excluded.value, updated_at=now()`,
      [JSON.stringify({ ...parsed.data, logoUrl })],
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Đã lưu cấu hình website" };
}

export async function saveProduct(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    isFeatured: formData.has("isFeatured"),
    isActive: formData.has("isActive"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu sản phẩm chưa hợp lệ" };
  }

  if (!supabaseConfigured && !postgresConfigured) {
    return {
      ok: false,
      message: "Chưa cấu hình Supabase env. Form đã sẵn sàng, hãy thêm env rồi lưu vào database thật.",
    };
  }

  const supabase = supabaseConfigured ? await createSupabaseServerClient() : null;
  const thumbnail = formData.get("thumbnail");
  const originalThumbnailUrl = formData.get("originalThumbnailUrl")?.toString() || undefined;
  let thumbnailUrl = formData.get("thumbnailUrl")?.toString() || undefined;

  if (supabaseConfigured && thumbnail instanceof File && thumbnail.size > 0) {
    const ext = thumbnail.name.split(".").pop() || "jpg";
    const path = `${parsed.data.slug}/thumbnail-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase!.storage
      .from("product-images")
      .upload(path, thumbnail, { upsert: true });

    if (uploadError) return { ok: false, message: uploadError.message };
    const { data } = supabase!.storage.from("product-images").getPublicUrl(path);
    thumbnailUrl = data.publicUrl;
  }

  let specs;
  let benefits;
  let usageRows;
  let reasons;
  let images: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  let originalImages: Array<{ url: string; alt?: string; isPrimary?: boolean }> = [];
  try {
    specs = JSON.parse(parsed.data.specsJson);
    benefits = JSON.parse(parsed.data.benefitsJson);
    usageRows = JSON.parse(parsed.data.usageRowsJson);
    reasons = JSON.parse(parsed.data.reasonsJson);
    images = JSON.parse(parsed.data.imagesJson);
    const originalImagesValue = formData.get("originalImagesJson")?.toString();
    if (originalImagesValue) originalImages = JSON.parse(originalImagesValue);
  } catch {
    return { ok: false, message: "Dữ liệu hình ảnh hoặc nội dung chưa đúng định dạng." };
  }

  if (supabaseConfigured) {
    for (let index = 0; index < images.length; index++) {
      const replacement = formData.get(`galleryReplace-${index}`);
      if (!(replacement instanceof File) || replacement.size === 0) continue;

      const ext = replacement.name.split(".").pop() || "jpg";
      const safeName = replacement.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]+/g, "-");
      const path = `${parsed.data.slug}/gallery-${Date.now()}-${safeName}.${ext}`;
      const { error: uploadError } = await supabase!.storage
        .from("product-images")
        .upload(path, replacement, { upsert: true });

      if (uploadError) return { ok: false, message: uploadError.message };
      const { data } = supabase!.storage.from("product-images").getPublicUrl(path);
      images[index] = { ...images[index], url: data.publicUrl, alt: images[index]?.alt || parsed.data.name };
    }
  }

  const galleryFiles = formData
    .getAll("gallery")
    .filter((file): file is File => file instanceof File && file.size > 0);

  for (const file of galleryFiles) {
    if (!supabaseConfigured) break;
    const ext = file.name.split(".").pop() || "jpg";
    const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]+/g, "-");
    const path = `${parsed.data.slug}/gallery-${Date.now()}-${safeName}.${ext}`;
    const { error: uploadError } = await supabase!.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) return { ok: false, message: uploadError.message };
    const { data } = supabase!.storage.from("product-images").getPublicUrl(path);
    images.push({ url: data.publicUrl, alt: parsed.data.name });
  }

  if (supabaseConfigured) {
    const keptImageUrls = new Set(images.map((image) => image.url));
    const removedPaths = originalImages
      .filter((image) => image.url && !keptImageUrls.has(image.url))
      .map((image) => getProductImageStoragePath(image.url))
      .filter((path): path is string => Boolean(path));

    if (originalThumbnailUrl && originalThumbnailUrl !== thumbnailUrl) {
      const thumbnailPath = getProductImageStoragePath(originalThumbnailUrl);
      if (thumbnailPath) removedPaths.push(thumbnailPath);
    }

    if (removedPaths.length > 0) {
      await supabase!.storage.from("product-images").remove([...new Set(removedPaths)]);
    }
  }

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    sku: parsed.data.sku,
    category_id: parsed.data.categoryId,
    price: parsed.data.price,
    origin: parsed.data.origin,
    shelf_life: parsed.data.shelfLife,
    short_description: parsed.data.shortDescription,
    description: parsed.data.description,
    specs,
    benefits,
    usage_rows: usageRows,
    reasons,
    note: parsed.data.note,
    thumbnail_url: thumbnailUrl,
    images,
    is_featured: parsed.data.isFeatured,
    is_active: parsed.data.isActive,
    seo_title: parsed.data.seoTitle,
    seo_description: parsed.data.seoDescription,
    updated_at: new Date().toISOString(),
  };

  const id = formData.get("id")?.toString();
  if (supabaseConfigured) {
    const query = id
      ? supabase!.from("products").update(payload).eq("id", id)
      : supabase!.from("products").insert(payload);
    const { error } = await query;

    if (error) return { ok: false, message: error.message };
  } else if (postgresConfigured) {
    const pool = getPostgresPool();
    const values = [
      payload.name,
      payload.slug,
      payload.sku,
      payload.category_id,
      payload.price,
      payload.origin,
      payload.shelf_life,
      payload.short_description,
      payload.description,
      JSON.stringify(payload.specs),
      JSON.stringify(payload.benefits),
      JSON.stringify(payload.usage_rows),
      JSON.stringify(payload.reasons),
      payload.note,
      payload.thumbnail_url,
      JSON.stringify(payload.images),
      payload.is_featured,
      payload.is_active,
      payload.seo_title,
      payload.seo_description,
      id,
    ];
    if (id) {
      await pool!.query(
        `update public.products set
          name=$1,slug=$2,sku=$3,category_id=$4,price=$5,origin=$6,shelf_life=$7,
          short_description=$8,description=$9,specs=$10::jsonb,benefits=$11::jsonb,
          usage_rows=$12::jsonb,reasons=$13::jsonb,note=$14,thumbnail_url=$15,
          images=$16::jsonb,is_featured=$17,is_active=$18,seo_title=$19,seo_description=$20,updated_at=now()
         where id=$21::uuid`,
        values,
      );
    } else {
      await pool!.query(
        `insert into public.products
          (name,slug,sku,category_id,price,origin,shelf_life,short_description,description,
           specs,benefits,usage_rows,reasons,note,thumbnail_url,images,is_featured,is_active,seo_title,seo_description)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,$13::jsonb,$14,$15,$16::jsonb,$17,$18,$19,$20)
         on conflict (slug) do update set
          name=excluded.name,sku=excluded.sku,category_id=excluded.category_id,price=excluded.price,
          origin=excluded.origin,shelf_life=excluded.shelf_life,short_description=excluded.short_description,
          description=excluded.description,specs=excluded.specs,benefits=excluded.benefits,
          usage_rows=excluded.usage_rows,reasons=excluded.reasons,note=excluded.note,
          thumbnail_url=excluded.thumbnail_url,images=excluded.images,is_featured=excluded.is_featured,
          is_active=excluded.is_active,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now()`,
        values.slice(0, 20),
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { ok: true, message: "Đã lưu sản phẩm" };
}
