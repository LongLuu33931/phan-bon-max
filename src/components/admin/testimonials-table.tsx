import Link from "next/link";
import { Edit3, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

function getQuotePreview(quote: string) {
  return quote.replace(/\[\[([^\]]+)\]\]/g, "$1");
}

export function TestimonialsTable({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[56%]" />
            <col className="w-[14%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
            <tr>
              <th className="px-5 py-4">Khách hàng</th>
              <th className="px-5 py-4">Vườn/khu vực</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="transition hover:bg-stone-50">
                <td className="min-w-0 px-5 py-4">
                  <p className="font-black text-stone-950">{testimonial.customerName}</p>
                  <p className="mt-1 line-clamp-2 max-w-[760px] break-words leading-6 text-stone-500">
                    {getQuotePreview(testimonial.quote)}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <p className="break-words font-bold leading-5 text-stone-700">{testimonial.role}</p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">{testimonial.crop} - {testimonial.province}</p>
                </td>
                <td className="px-5 py-4 align-top">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                    <Star size={14} fill="currentColor" /> {testimonial.rating}/5
                  </span>
                </td>
                <td className="px-5 py-4 align-top">
                  <span className={testimonial.isActive ? "inline-flex whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700" : "inline-flex whitespace-nowrap rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-500"}>
                    {testimonial.isActive ? "Đang hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right align-top">
                  <Link href={`/admin/testimonials/${testimonial.id}`} className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-stone-200 px-3 font-bold text-stone-700 hover:border-emerald-200 hover:text-emerald-800">
                    <Edit3 size={15} /> Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
