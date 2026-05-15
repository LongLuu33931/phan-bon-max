"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ImagePlus, Plus, Trash2, UploadCloud } from "lucide-react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { saveProduct, type ActionState } from "@/lib/actions";
import type { Category, Product, ProductBenefit, ProductImage, ProductSpec, ProductUsageRow } from "@/lib/types";
import { slugify } from "@/lib/format";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "rounded-xl border border-stone-200 bg-white px-4 py-3 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";
const fileClass = "rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-900 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white";

function jsonValue(value: unknown) {
  return JSON.stringify(value ?? [], null, 2);
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="border-b border-stone-100 pb-5">
        <h2 className="text-lg font-black text-stone-950">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, isPending] = useActionState(saveProduct, initialState);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>(product?.images ?? []);
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs?.length ? product.specs : [{ label: "", value: "" }]);
  const [benefits, setBenefits] = useState<ProductBenefit[]>(product?.benefits?.length ? product.benefits : [{ title: "", description: "" }]);
  const [usageRows, setUsageRows] = useState<ProductUsageRow[]>(
    product?.usageRows?.length ? product.usageRows : [{ crop: "", dosage: "", timing: "" }],
  );
  const [reasons, setReasons] = useState<string[]>(product?.reasons?.length ? product.reasons : [""]);

  return (
    <form action={action} className="grid gap-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="thumbnailUrl" value={product?.thumbnailUrl ?? ""} />
      <input type="hidden" name="originalThumbnailUrl" value={product?.thumbnailUrl ?? ""} />
      <input type="hidden" name="imagesJson" value={jsonValue(galleryImages)} />
      <input type="hidden" name="originalImagesJson" value={jsonValue(product?.images ?? [])} />
      <input type="hidden" name="specsJson" value={jsonValue(specs.filter((item) => item.label.trim() || item.value.trim()))} />
      <input type="hidden" name="benefitsJson" value={jsonValue(benefits.filter((item) => item.title.trim() || item.description.trim()))} />
      <input type="hidden" name="usageRowsJson" value={jsonValue(usageRows.filter((item) => item.crop.trim() || item.dosage.trim() || item.timing.trim()))} />
      <input type="hidden" name="reasonsJson" value={jsonValue(reasons.map((item) => item.trim()).filter(Boolean))} />

      <FormSection title="Thông tin cơ bản" description="Tên, mã hàng, danh mục và giá bán của sản phẩm.">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className={`${labelClass} lg:col-span-2`}>
            Tên sản phẩm
            <input
              name="name"
              defaultValue={product?.name}
              required
              className={inputClass}
              onBlur={(event) => {
                const slug = event.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (slug && !slug.value) slug.value = slugify(event.currentTarget.value);
              }}
            />
          </label>
          <label className={labelClass}>
            Slug
            <input name="slug" defaultValue={product?.slug} required className={inputClass} />
          </label>
          <label className={labelClass}>
            SKU
            <input name="sku" defaultValue={product?.sku} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Danh mục
            <select name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} className={inputClass}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Giá
            <input name="price" type="number" defaultValue={product?.price} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Xuất xứ
            <input name="origin" defaultValue={product?.origin ?? "Việt Nam"} className={inputClass} />
          </label>
          <label className={labelClass}>
            Hạn sử dụng
            <input name="shelfLife" defaultValue={product?.shelfLife ?? "24 tháng"} className={inputClass} />
          </label>
        </div>
      </FormSection>

      <FormSection title="Hình ảnh" description="Thumbnail chỉ có một ảnh. Gallery có thể thêm, xóa hoặc thay thế từng ảnh.">
        <div className="grid gap-6">
          <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:grid-cols-[220px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-white">
              {product?.thumbnailUrl ? (
                <Image src={product.thumbnailUrl} alt={product.name} fill sizes="220px" className="object-contain p-3" />
              ) : (
                <div className="grid h-full place-items-center text-stone-400">
                  <ImagePlus size={42} />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-3">
              <div>
                <p className="text-sm font-black text-stone-950">Thumbnail sản phẩm</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">Ảnh này dùng làm ảnh đại diện ngoài danh sách sản phẩm. Chọn file mới để thay thế ảnh hiện tại.</p>
              </div>
              <label className={labelClass}>
                Thay thumbnail
                <input name="thumbnail" type="file" accept="image/*" className={fileClass} />
              </label>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-stone-950">Gallery sản phẩm</p>
                <p className="mt-1 text-sm text-stone-500">Xóa ảnh khỏi gallery hoặc chọn file mới để replace ảnh tương ứng.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div key={`${image.url}-${index}`} className="rounded-2xl border border-stone-200 bg-white p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-50">
                    <Image src={image.url} alt={image.alt || product?.name || "Gallery"} fill sizes="320px" className="object-contain p-3" />
                  </div>
                  <div className="mt-3 grid gap-2">
                    <label className="grid gap-1 text-xs font-bold text-stone-600">
                      Thay ảnh này
                      <input name={`galleryReplace-${index}`} type="file" accept="image/*" className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-2 file:py-1 file:text-xs file:font-bold file:text-white" />
                    </label>
                    <button
                      type="button"
                      onClick={() => setGalleryImages((items) => removeAt(items, index))}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 text-xs font-black text-red-700"
                    >
                      <Trash2 size={14} /> Xóa khỏi gallery
                    </button>
                  </div>
                </div>
              ))}
              <label className="grid min-h-64 cursor-pointer place-items-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-center text-emerald-900">
                <span>
                  <UploadCloud className="mx-auto" size={34} />
                  <span className="mt-3 block text-sm font-black">Thêm ảnh gallery</span>
                  <span className="mt-1 block text-xs font-semibold text-emerald-800/70">Có thể chọn nhiều ảnh cùng lúc</span>
                </span>
                <input name="gallery" type="file" multiple accept="image/*" className="sr-only" />
              </label>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Nội dung sản phẩm" description="Các phần nội dung đã chuyển thành ô nhập bình thường, người dùng chỉ cần thêm dòng và nhập nội dung.">
        <div className="grid gap-5">
          <label className={labelClass}>
            Mô tả ngắn
            <textarea name="shortDescription" rows={3} defaultValue={product?.shortDescription} required className={textareaClass} />
          </label>
          <label className={labelClass}>
            Mô tả chi tiết
            <textarea name="description" rows={5} defaultValue={product?.description} required className={textareaClass} />
          </label>

          <EditableSpecs specs={specs} setSpecs={setSpecs} />
          <EditableBenefits benefits={benefits} setBenefits={setBenefits} />
          <EditableUsageRows usageRows={usageRows} setUsageRows={setUsageRows} />
          <EditableReasons reasons={reasons} setReasons={setReasons} />

          <label className={labelClass}>
            Ghi chú/chứng nhận
            <textarea name="note" rows={3} defaultValue={product?.note} className={textareaClass} />
          </label>
        </div>
      </FormSection>

      <FormSection title="SEO và trạng thái" description="Thiết lập hiển thị ngoài website và thông tin SEO cơ bản.">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            SEO title
            <input name="seoTitle" defaultValue={product?.seoTitle} className={inputClass} />
          </label>
          <label className={labelClass}>
            SEO description
            <input name="seoDescription" defaultValue={product?.seoDescription} className={inputClass} />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700">
            <input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured} value="true" className="size-4 accent-emerald-800" />
            Sản phẩm nổi bật
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700">
            <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} value="true" className="size-4 accent-emerald-800" />
            Hiển thị ngoài website
          </label>
        </div>
      </FormSection>

      <AdminFormActions message={state.message} ok={state.ok}>
        <button disabled={isPending} className="h-12 rounded-xl bg-emerald-900 px-5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-stone-300">
          {isPending ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </AdminFormActions>
    </form>
  );
}

function EditableSpecs({ specs, setSpecs }: { specs: ProductSpec[]; setSpecs: React.Dispatch<React.SetStateAction<ProductSpec[]>> }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <FormListHeader title="Thông tin sản phẩm" onAdd={() => setSpecs((items) => [...items, { label: "", value: "" }])} />
      {specs.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl bg-white p-3 md:grid-cols-[1fr_1fr_auto]">
          <input value={item.label} onChange={(event) => setSpecs((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, label: event.target.value } : entry))} placeholder="Tên thông tin, ví dụ: Thành phần" className={inputClass} />
          <input value={item.value} onChange={(event) => setSpecs((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, value: event.target.value } : entry))} placeholder="Giá trị, ví dụ: Kali 44%" className={inputClass} />
          <RemoveButton onClick={() => setSpecs((items) => removeAt(items, index))} />
        </div>
      ))}
    </div>
  );
}

function EditableBenefits({ benefits, setBenefits }: { benefits: ProductBenefit[]; setBenefits: React.Dispatch<React.SetStateAction<ProductBenefit[]>> }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <FormListHeader title="Công dụng nổi bật" onAdd={() => setBenefits((items) => [...items, { title: "", description: "" }])} />
      {benefits.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl bg-white p-3 md:grid-cols-[1fr_1.5fr_auto]">
          <input value={item.title} onChange={(event) => setBenefits((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} placeholder="Tiêu đề công dụng" className={inputClass} />
          <input value={item.description} onChange={(event) => setBenefits((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, description: event.target.value } : entry))} placeholder="Mô tả ngắn" className={inputClass} />
          <RemoveButton onClick={() => setBenefits((items) => removeAt(items, index))} />
        </div>
      ))}
    </div>
  );
}

function EditableUsageRows({ usageRows, setUsageRows }: { usageRows: ProductUsageRow[]; setUsageRows: React.Dispatch<React.SetStateAction<ProductUsageRow[]>> }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <FormListHeader title="Hướng dẫn sử dụng" onAdd={() => setUsageRows((items) => [...items, { crop: "", dosage: "", timing: "" }])} />
      {usageRows.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl bg-white p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <input value={item.crop} onChange={(event) => setUsageRows((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, crop: event.target.value } : entry))} placeholder="Cây trồng" className={inputClass} />
          <input value={item.dosage} onChange={(event) => setUsageRows((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, dosage: event.target.value } : entry))} placeholder="Liều lượng" className={inputClass} />
          <input value={item.timing} onChange={(event) => setUsageRows((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, timing: event.target.value } : entry))} placeholder="Thời điểm dùng" className={inputClass} />
          <RemoveButton onClick={() => setUsageRows((items) => removeAt(items, index))} />
        </div>
      ))}
    </div>
  );
}

function EditableReasons({ reasons, setReasons }: { reasons: string[]; setReasons: React.Dispatch<React.SetStateAction<string[]>> }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <FormListHeader title="Lý do nên chọn" onAdd={() => setReasons((items) => [...items, ""])} />
      {reasons.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl bg-white p-3 md:grid-cols-[1fr_auto]">
          <input value={item} onChange={(event) => setReasons((items) => items.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry))} placeholder="Ví dụ: Công thức phù hợp từng giai đoạn cây" className={inputClass} />
          <RemoveButton onClick={() => setReasons((items) => removeAt(items, index))} />
        </div>
      ))}
    </div>
  );
}

function FormListHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-black text-stone-950">{title}</p>
      <button type="button" onClick={onAdd} className="inline-flex h-9 items-center gap-2 rounded-lg bg-stone-950 px-3 text-xs font-black text-white">
        <Plus size={14} /> Thêm dòng
      </button>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 text-xs font-black text-red-700">
      <Trash2 size={14} /> Xóa
    </button>
  );
}
