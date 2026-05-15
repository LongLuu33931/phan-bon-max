"use client";

import { Highlighter, ImagePlus, Sparkles, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { useActionToast } from "@/hooks/use-action-toast";
import { saveTestimonial, type ActionState } from "@/lib/actions";
import type { Product, Testimonial } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "rounded-xl border border-stone-200 bg-white px-4 py-3 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const fileClass = "rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-900 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";

function markProductName(name: string) {
  return `[[${name.trim()}]]`;
}

function buildProductFeedback(product: Product) {
  const reason = product.reasons[0] || product.benefits[0]?.title || product.shortDescription;
  return `Tôi dùng ${markProductName(product.name)} cho vườn và thấy sản phẩm dễ tư vấn, dễ phối hợp theo lịch chăm sóc. ${reason}`;
}

export function TestimonialForm({ testimonial, products = [] }: { testimonial?: Testimonial; products?: Product[] }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveTestimonial, initialState);
  useActionToast(state);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const quoteRef = useRef<HTMLTextAreaElement>(null);
  const productOptions = useMemo(() => products.filter((product) => product.name.trim()), [products]);
  const displayAvatarUrl = avatarPreview || testimonial?.avatarUrl;

  useEffect(() => {
    if (state.ok) router.push("/admin/testimonials");
  }, [router, state.ok]);

  function previewAvatarImage(file?: File) {
    if (!file) return;
    setAvatarPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function replaceQuoteSelection(value: string) {
    const textarea = quoteRef.current;
    if (!textarea) {
      setQuote((current) => `${current}${current ? " " : ""}${value}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = `${quote.slice(0, start)}${value}${quote.slice(end)}`;
    setQuote(next);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + value.length, start + value.length);
    });
  }

  function insertProductName(productName: string) {
    replaceQuoteSelection(markProductName(productName));
  }

  function highlightSelectedText() {
    const textarea = quoteRef.current;
    if (!textarea) return;

    const selected = quote.slice(textarea.selectionStart, textarea.selectionEnd).trim();
    if (!selected) return;
    replaceQuoteSelection(markProductName(selected));
  }

  return (
    <form action={action} className="grid gap-5 pb-28">
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
      <input type="hidden" name="avatarUrl" value={testimonial?.avatarUrl ?? ""} />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Thông tin khách hàng</h2>
          <p className="mt-1 text-sm text-stone-500">Các trường này dùng để hiển thị khu vực trải nghiệm khách hàng ngoài trang chủ.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            Tên khách hàng
            <input name="customerName" defaultValue={testimonial?.customerName} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Vai trò/mô tả
            <input name="role" defaultValue={testimonial?.role} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Tỉnh/thành
            <input name="province" defaultValue={testimonial?.province} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Loại cây/vườn
            <input name="crop" defaultValue={testimonial?.crop} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Rating
            <input name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? 5} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Thứ tự hiển thị
            <input name="sortOrder" type="number" min={0} defaultValue={testimonial?.sortOrder ?? 0} className={inputClass} />
          </label>

          <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:col-span-2 lg:grid-cols-[220px_1fr]">
            <div className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-stone-200 bg-white text-stone-400">
              {displayAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayAvatarUrl} alt="Preview ảnh khách hàng" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={42} />
              )}
            </div>
            <div className="grid content-center gap-4">
              <label className={labelClass}>
                Upload ảnh người feedback
                <span className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <UploadCloud size={15} /> PNG, JPG hoặc WebP
                </span>
                <input
                  name="avatarImage"
                  type="file"
                  accept="image/*"
                  className={fileClass}
                  onChange={(event) => previewAvatarImage(event.target.files?.[0])}
                />
              </label>
            </div>
          </div>

          <label className={`${labelClass} lg:col-span-2`}>
            Nội dung feedback
            <textarea
              ref={quoteRef}
              name="quote"
              rows={5}
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
              required
              className={textareaClass}
            />
          </label>
          {productOptions.length ? (
            <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-stone-950">Sản phẩm trong feedback</p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">Bấm tên sản phẩm để chèn dạng nổi bật. Khi render ngoài trang chủ, phần trong [[...]] sẽ được tô màu.</p>
                </div>
                <button
                  type="button"
                  onClick={highlightSelectedText}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-black text-amber-800"
                >
                  <Highlighter size={14} /> Tô đoạn đang chọn
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productOptions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => insertProductName(product.name)}
                    className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-black text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {productOptions.slice(0, 6).map((product) => (
                  <button
                    key={`generate-${product.id}`}
                    type="button"
                    onClick={() => setQuote(buildProductFeedback(product))}
                    className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-xs font-bold leading-5 text-stone-700 transition hover:border-emerald-300 hover:text-emerald-800"
                  >
                    <span className="mb-1 flex items-center gap-2 font-black text-stone-950">
                      <Sparkles size={14} /> Tạo theo {product.name}
                    </span>
                    <span className="line-clamp-2">{product.shortDescription}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <h2 className="text-lg font-black text-stone-950">Trạng thái hiển thị</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700">
            <input name="isFeatured" type="checkbox" defaultChecked={testimonial?.isFeatured ?? true} value="true" className="size-4 accent-emerald-800" />
            Hiển thị nổi bật ngoài trang chủ
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700">
            <input name="isActive" type="checkbox" defaultChecked={testimonial?.isActive ?? true} value="true" className="size-4 accent-emerald-800" />
            Đang hiển thị
          </label>
        </div>
      </section>

      <AdminFormActions message={state.message} ok={state.ok}>
        <button disabled={isPending} className="h-12 rounded-xl bg-emerald-900 px-5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-stone-300">
          {isPending ? "Đang lưu..." : "Lưu feedback"}
        </button>
      </AdminFormActions>
    </form>
  );
}
