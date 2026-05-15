"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { useActionToast } from "@/hooks/use-action-toast";
import { saveProduct, type ActionState } from "@/lib/actions";
import type { Category, Product, ProductBenefit, ProductImage, ProductSpec, ProductUsageRow } from "@/lib/types";
import { slugify } from "@/lib/format";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "rounded-xl border border-stone-200 bg-white px-4 py-3 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";

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

function getInitialGalleryImages(product?: Product) {
  if (!product) return [];

  const images = [...(product.images ?? [])];
  const thumbnailUrl = product.thumbnailUrl;
  if (thumbnailUrl && !images.some((image) => image.url === thumbnailUrl)) {
    images.unshift({ url: thumbnailUrl, alt: product.name, isPrimary: true });
  }

  if (!images.length) return images;

  return images.map((image, index) => ({
    ...image,
    isPrimary: thumbnailUrl ? image.url === thumbnailUrl : image.isPrimary ?? index === 0,
  }));
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveProduct, initialState);
  useActionToast(state);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? slugify(product?.name ?? ""));
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>(() => getInitialGalleryImages(product));
  const [thumbnailUrl, setThumbnailUrl] = useState(
    product?.thumbnailUrl ?? galleryImages.find((image) => image.isPrimary)?.url ?? galleryImages[0]?.url ?? "",
  );
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs?.length ? product.specs : [{ label: "", value: "" }]);
  const [benefits, setBenefits] = useState<ProductBenefit[]>(product?.benefits?.length ? product.benefits : [{ title: "", description: "" }]);
  const [usageRows, setUsageRows] = useState<ProductUsageRow[]>(
    product?.usageRows?.length ? product.usageRows : [{ crop: "", dosage: "", timing: "" }],
  );
  const [reasons, setReasons] = useState<string[]>(product?.reasons?.length ? product.reasons : [""]);
  const [replacementPreviews, setReplacementPreviews] = useState<Record<number, string>>({});
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [newGalleryThumbnailIndex, setNewGalleryThumbnailIndex] = useState<number | null>(null);
  const replacementPreviewsRef = useRef<Record<number, string>>({});
  const newGalleryPreviewsRef = useRef<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const resolvedSlug = slug || slugify(name);

  useEffect(() => {
    return () => {
      Object.values(replacementPreviewsRef.current).forEach((url) => URL.revokeObjectURL(url));
      newGalleryPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (state.ok) router.push("/admin/products");
  }, [router, state.ok]);

  function previewReplacementImage(index: number, file?: File) {
    setReplacementPreviews((previews) => {
      const current = previews[index];
      if (current) URL.revokeObjectURL(current);

      const next = { ...previews };
      if (file) {
        next[index] = URL.createObjectURL(file);
      } else {
        delete next[index];
      }

      replacementPreviewsRef.current = next;
      return next;
    });
  }

  function previewNewGalleryImages(files?: FileList | null) {
    newGalleryPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const next = files ? Array.from(files).map((file) => URL.createObjectURL(file)) : [];
    newGalleryPreviewsRef.current = next;
    setNewGalleryPreviews(next);
    setNewGalleryThumbnailIndex(null);
  }

  function removeNewGalleryImage(index: number) {
    const input = galleryInputRef.current;
    const files = input?.files ? Array.from(input.files) : [];
    const nextFiles = removeAt(files, index);

    if (input) {
      const dataTransfer = new DataTransfer();
      nextFiles.forEach((file) => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
    }

    newGalleryPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));
    newGalleryPreviewsRef.current = nextPreviews;
    setNewGalleryPreviews(nextPreviews);
    setNewGalleryThumbnailIndex((current) => {
      if (current === null) return null;
      if (current === index) return null;
      return current > index ? current - 1 : current;
    });
  }

  function clearNewGalleryImages() {
    newGalleryPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    newGalleryPreviewsRef.current = [];
    setNewGalleryPreviews([]);
    setNewGalleryThumbnailIndex(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  function removeGalleryImage(index: number, url: string) {
    const nextImages = removeAt(galleryImages, index);
    const nextThumbnail = thumbnailUrl === url ? nextImages[0]?.url ?? "" : thumbnailUrl;

    setThumbnailUrl(nextThumbnail);
    setGalleryImages(nextImages.map((entry) => ({ ...entry, isPrimary: entry.url === nextThumbnail })));
    setReplacementPreviews((previews) => {
      const next: Record<number, string> = {};

      Object.entries(previews).forEach(([key, previewUrl]) => {
        const previewIndex = Number(key);
        if (previewIndex === index) {
          URL.revokeObjectURL(previewUrl);
          return;
        }
        next[previewIndex > index ? previewIndex - 1 : previewIndex] = previewUrl;
      });

      replacementPreviewsRef.current = next;
      return next;
    });
  }

  return (
    <form action={action} className="grid gap-5 pb-28">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="slug" value={resolvedSlug} />
      <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
      <input type="hidden" name="newGalleryThumbnailIndex" value={newGalleryThumbnailIndex ?? ""} />
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
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSlug(slugify(event.target.value));
              }}
              required
              className={inputClass}
            />
          </label>
          <div className="grid gap-2 text-sm font-bold text-stone-700">
            Slug tu dong
            <div className="flex h-12 min-w-0 items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50 px-4 font-normal text-stone-500">
              <span className="truncate">{resolvedSlug || "slug-se-tu-tao-theo-ten-san-pham"}</span>
            </div>
          </div>
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

      <FormSection title="Hình ảnh" description="Quản lý ảnh trong gallery và chọn một ảnh làm thumbnail đại diện.">
        <div className="grid gap-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-stone-950">Gallery sản phẩm</p>
                <p className="mt-1 text-sm text-stone-500">Chọn ảnh trong gallery làm thumbnail. Ảnh được chọn sẽ dùng ngoài danh sách sản phẩm.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => {
                const isThumbnail = thumbnailUrl === image.url || image.isPrimary;
                const previewUrl = replacementPreviews[index] ?? image.url;

                return (
                <div key={`${image.url}-${index}`} className="rounded-2xl border border-stone-200 bg-white p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-50">
                    {replacementPreviews[index] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt={image.alt || product?.name || "Gallery"} className="h-full w-full object-contain p-3" />
                    ) : (
                      <Image src={previewUrl} alt={image.alt || product?.name || "Gallery"} fill sizes="320px" className="object-contain p-3" />
                    )}
                    {isThumbnail ? (
                      <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-black text-white shadow-sm">
                        Thumbnail
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 grid gap-2">
                    <label className="grid gap-1 text-xs font-bold text-stone-600">
                      Thay ảnh này
                      <input
                        name={`galleryReplace-${index}`}
                        type="file"
                        accept="image/*"
                        className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-2 file:py-1 file:text-xs file:font-bold file:text-white"
                        onChange={(event) => previewReplacementImage(index, event.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailUrl(image.url);
                        setNewGalleryThumbnailIndex(null);
                        setGalleryImages((items) => items.map((entry, itemIndex) => ({ ...entry, isPrimary: itemIndex === index })));
                      }}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-xs font-black text-emerald-800 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-500"
                      disabled={isThumbnail}
                    >
                      {isThumbnail ? "Đang là thumbnail" : "Đặt làm thumbnail"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index, image.url)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 text-xs font-black text-red-700"
                    >
                      <Trash2 size={14} /> Xóa khỏi gallery
                    </button>
                  </div>
                </div>
                );
              })}
              {newGalleryPreviews.map((url, index) => {
                const isNewThumbnail = newGalleryThumbnailIndex === index;

                return (
                <div key={url} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview gallery ${index + 1}`} className="h-full w-full object-contain p-3" />
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white shadow-sm">
                      Chờ lưu
                    </span>
                    {isNewThumbnail ? (
                      <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-black text-white shadow-sm">
                        Thumbnail
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 grid gap-2">
                    <p className="text-xs font-bold text-emerald-900">Ảnh mới sẽ được upload khi bấm lưu sản phẩm.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailUrl("");
                        setNewGalleryThumbnailIndex(index);
                        setGalleryImages((items) => items.map((entry) => ({ ...entry, isPrimary: false })));
                      }}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-xs font-black text-emerald-800 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-500"
                      disabled={isNewThumbnail}
                    >
                      {isNewThumbnail ? "Đang là thumbnail" : "Đặt làm thumbnail"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNewGalleryImage(index)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 text-xs font-black text-red-700"
                    >
                      <Trash2 size={14} /> Xóa ảnh này
                    </button>
                  </div>
                </div>
                );
              })}
              <label className="grid min-h-64 cursor-pointer place-items-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-center text-emerald-900">
                <span>
                  <UploadCloud className="mx-auto" size={34} />
                  <span className="mt-3 block text-sm font-black">Thêm ảnh gallery</span>
                  <span className="mt-1 block text-xs font-semibold text-emerald-800/70">Có thể chọn nhiều ảnh cùng lúc</span>
                  {newGalleryPreviews.length ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        clearNewGalleryImages();
                      }}
                      className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-emerald-200 bg-white px-3 text-xs font-black text-emerald-800"
                    >
                      Chọn lại ảnh
                    </button>
                  ) : null}
                </span>
                <input
                  ref={galleryInputRef}
                  name="gallery"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => previewNewGalleryImages(event.target.files)}
                />
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {specs.map((item, index) => (
          <div key={index} className="rounded-lg border border-stone-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-stone-950">Dòng thông tin {index + 1}</p>
              <RemoveButton onClick={() => setSpecs((items) => removeAt(items, index))} />
            </div>
            <label className="grid gap-2 text-sm font-bold text-stone-700">
              Tên thông tin
              <input value={item.label} onChange={(event) => setSpecs((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, label: event.target.value } : entry))} placeholder="Ví dụ: Khối lượng tịnh" className={inputClass} />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-stone-700">
              Giá trị hiển thị
              <input value={item.value} onChange={(event) => setSpecs((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, value: event.target.value } : entry))} placeholder="Ví dụ: 500g" className={inputClass} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableBenefits({ benefits, setBenefits }: { benefits: ProductBenefit[]; setBenefits: React.Dispatch<React.SetStateAction<ProductBenefit[]>> }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <FormListHeader title="Công dụng nổi bật" onAdd={() => setBenefits((items) => [...items, { title: "", description: "" }])} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {benefits.map((item, index) => (
          <div key={index} className="rounded-lg border border-stone-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-stone-700">Tiêu đề công dụng</p>
              <RemoveButton onClick={() => setBenefits((items) => removeAt(items, index))} />
            </div>
            <label className="grid gap-2">
              <input value={item.title} onChange={(event) => setBenefits((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} placeholder="Ví dụ: Hoa ra đồng loạt" className={inputClass} />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-stone-700">
              Mô tả hiển thị bên dưới
              <textarea value={item.description} onChange={(event) => setBenefits((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, description: event.target.value } : entry))} placeholder="Ví dụ: Hỗ trợ phân hóa và bung hoa đều hơn." rows={3} className={textareaClass} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableUsageRows({ usageRows, setUsageRows }: { usageRows: ProductUsageRow[]; setUsageRows: React.Dispatch<React.SetStateAction<ProductUsageRow[]>> }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <FormListHeader title="Hướng dẫn sử dụng" onAdd={() => setUsageRows((items) => [...items, { crop: "", dosage: "", timing: "" }])} />
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-emerald-900 text-xs font-black uppercase tracking-[0.08em] text-white">
              <tr>
                <th className="px-3 py-3">Đối tượng cây trồng</th>
                <th className="px-3 py-3">Liều lượng & quy đổi</th>
                <th className="px-3 py-3">Thời điểm & cách dùng</th>
                <th className="w-24 px-3 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {usageRows.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 align-top">
                    <input value={item.crop} onChange={(event) => setUsageRows((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, crop: event.target.value } : entry))} placeholder="Ví dụ: Cây ăn trái, cây công nghiệp" className={inputClass} />
                  </td>
                  <td className="p-3 align-top">
                    <input value={item.dosage} onChange={(event) => setUsageRows((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, dosage: event.target.value } : entry))} placeholder="Ví dụ: Pha theo khuyến cáo trên nhãn" className={inputClass} />
                  </td>
                  <td className="p-3 align-top">
                    <input value={item.timing} onChange={(event) => setUsageRows((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, timing: event.target.value } : entry))} placeholder="Ví dụ: Dùng định kỳ 10-15 ngày/lần" className={inputClass} />
                  </td>
                  <td className="p-3 text-right align-top">
                    <RemoveButton onClick={() => setUsageRows((items) => removeAt(items, index))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
    <button type="button" onClick={onClick} className="inline-grid size-9 place-items-center rounded-lg border border-red-100 bg-white text-red-600 transition hover:bg-red-50" aria-label="Xóa dòng">
      <Trash2 size={15} />
    </button>
  );
}
