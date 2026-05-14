"use client";

import { useActionState } from "react";
import { saveProduct, type ActionState } from "@/lib/actions";
import type { Category, Product } from "@/lib/types";
import { slugify } from "@/lib/format";

const initialState: ActionState = { ok: false, message: "" };

function jsonValue(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, isPending] = useActionState(saveProduct, initialState);

  return (
    <form action={action} className="grid gap-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-stone-700 lg:col-span-2">
          Tên sản phẩm
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="h-11 rounded-md border border-stone-300 px-3 font-normal"
            onBlur={(event) => {
              const slug = event.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
              if (slug && !slug.value) slug.value = slugify(event.currentTarget.value);
            }}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Slug
          <input name="slug" defaultValue={product?.slug} required className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          SKU
          <input name="sku" defaultValue={product?.sku} required className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Danh mục
          <select name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} className="h-11 rounded-md border border-stone-300 px-3 font-normal">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Giá
          <input name="price" type="number" defaultValue={product?.price} required className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Xuất xứ
          <input name="origin" defaultValue={product?.origin ?? "Việt Nam"} className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Hạn sử dụng
          <input name="shelfLife" defaultValue={product?.shelfLife ?? "24 tháng"} className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
      </div>

      <div className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Thumbnail hiện tại hoặc URL
          <input name="thumbnailUrl" defaultValue={product?.thumbnailUrl} className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Upload thumbnail
          <input name="thumbnail" type="file" accept="image/*" className="rounded-md border border-stone-300 bg-white px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Upload gallery
          <input name="gallery" type="file" multiple accept="image/*" className="rounded-md border border-stone-300 bg-white px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Gallery ảnh JSON
          <textarea name="imagesJson" rows={5} defaultValue={jsonValue(product?.images ?? [])} className="rounded-md border border-stone-300 px-3 py-2 font-mono text-xs" />
        </label>
        <p className="text-xs text-stone-500">Ảnh sẽ upload vào Supabase Storage bucket `product-images` khi đã cấu hình env.</p>
      </div>

      <div className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Mô tả ngắn
          <textarea name="shortDescription" rows={3} defaultValue={product?.shortDescription} required className="rounded-md border border-stone-300 px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Mô tả chi tiết
          <textarea name="description" rows={5} defaultValue={product?.description} required className="rounded-md border border-stone-300 px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Thông tin sản phẩm JSON
          <textarea name="specsJson" rows={8} defaultValue={jsonValue(product?.specs ?? [])} className="rounded-md border border-stone-300 px-3 py-2 font-mono text-xs" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Công dụng nổi bật JSON
          <textarea name="benefitsJson" rows={8} defaultValue={jsonValue(product?.benefits ?? [])} className="rounded-md border border-stone-300 px-3 py-2 font-mono text-xs" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Hướng dẫn sử dụng JSON
          <textarea name="usageRowsJson" rows={8} defaultValue={jsonValue(product?.usageRows ?? [])} className="rounded-md border border-stone-300 px-3 py-2 font-mono text-xs" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Lý do nên chọn JSON
          <textarea name="reasonsJson" rows={6} defaultValue={jsonValue(product?.reasons ?? [])} className="rounded-md border border-stone-300 px-3 py-2 font-mono text-xs" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Ghi chú/chứng nhận
          <textarea name="note" rows={3} defaultValue={product?.note} className="rounded-md border border-stone-300 px-3 py-2 font-normal" />
        </label>
      </div>

      <div className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          SEO title
          <input name="seoTitle" defaultValue={product?.seoTitle} className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          SEO description
          <input name="seoDescription" defaultValue={product?.seoDescription} className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured} value="true" /> Sản phẩm nổi bật
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} value="true" /> Hiển thị ngoài website
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button disabled={isPending} className="h-12 rounded-md bg-emerald-800 px-5 font-semibold text-white disabled:bg-stone-300">
          {isPending ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
        {state.message ? (
          <p className={state.ok ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-amber-700"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
