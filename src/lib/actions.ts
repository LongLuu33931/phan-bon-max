"use server";

import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { checkoutSchema, productSchema } from "./schemas";
import { supabaseConfigured } from "./supabase";
import { createSupabaseServerClient } from "./supabase-server";
import { products } from "./seed-data";
import { getPostgresPool, postgresConfigured } from "./postgres";

export type ActionState = {
  ok: boolean;
  message: string;
};

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
  const orderCode = `MAX${Date.now().toString().slice(-8)}`;

  if (supabaseConfigured) {
    const { data: order, error } = await supabase!
      .from("orders")
      .insert({
        order_code: orderCode,
        customer_name: parsed.data.customerName,
        phone: parsed.data.phone,
        address: parsed.data.address,
        province: parsed.data.province,
        note: parsed.data.note,
        status: "new",
        total_amount: total,
      })
      .select("id")
      .single();

    if (error) return { ok: false, message: error.message };

    const { error: itemError } = await supabase!
      .from("order_items")
      .insert(items.map((item) => ({ ...item, order_id: order.id })));

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
  let images;
  try {
    specs = JSON.parse(parsed.data.specsJson);
    benefits = JSON.parse(parsed.data.benefitsJson);
    usageRows = JSON.parse(parsed.data.usageRowsJson);
    reasons = JSON.parse(parsed.data.reasonsJson);
    images = JSON.parse(parsed.data.imagesJson);
  } catch {
    return { ok: false, message: "Các trường JSON chưa đúng định dạng." };
  }

  const galleryFiles = formData
    .getAll("gallery")
    .filter((file): file is File => file instanceof File && file.size > 0);

  for (const file of galleryFiles) {
    if (!supabaseConfigured) break;
    const ext = file.name.split(".").pop() || "jpg";
    const safeName = file.name.replace(/[^a-zA-Z0-9.]+/g, "-");
    const path = `${parsed.data.slug}/gallery-${Date.now()}-${safeName}.${ext}`;
    const { error: uploadError } = await supabase!.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) return { ok: false, message: uploadError.message };
    const { data } = supabase!.storage.from("product-images").getPublicUrl(path);
    images.push({ url: data.publicUrl, alt: parsed.data.name });
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
