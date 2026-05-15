"use client";

import { useEffect, useMemo, useState } from "react";
import { Quote, Star } from "lucide-react";
import clsx from "clsx";
import type { Testimonial } from "@/lib/types";

type TestimonialStackProps = {
  testimonials: Testimonial[];
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function TestimonialStack({ testimonials }: TestimonialStackProps) {
  const items = useMemo(() => testimonials.filter((item) => item.isFeatured).slice(0, 5), [testimonials]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  const next = () => setActiveIndex((current) => (current + 1) % items.length);

  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
        <div className="max-w-[520px] lg:justify-self-end">
          <p className="font-semibold text-emerald-800">
            Khách hàng nói gì
          </p>
          <h2 className="mt-8 text-4xl font-black leading-[1.12] tracking-tight text-stone-950 sm:text-5xl">
            Đánh giá từ <span className="text-emerald-800">nhà vườn</span> và <span className="text-emerald-800">đại lý</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-stone-600">
            Phản hồi thực tế từ những người đã dùng MAX 8000 trong quy trình chăm sóc vườn và tư vấn sản phẩm.
          </p>
          
        </div>

        <div className="relative mx-auto h-[390px] w-full max-w-[440px] lg:mx-0 lg:justify-self-start">
          {items.map((testimonial, index) => {
            const offset = (index - activeIndex + items.length) % items.length;
            const visible = offset < 3;
            const isActive = offset === 0;
            const initials = getInitials(testimonial.customerName) || testimonial.customerName.slice(0, 1);

            return (
              <button
                key={testimonial.id}
                type="button"
                onClick={isActive ? next : () => setActiveIndex(index)}
                aria-label={`Xem phản hồi của ${testimonial.customerName}`}
                className={clsx(
                  "absolute inset-x-0 top-0 block w-full rounded-[24px] p-7 text-left shadow-[0_28px_70px_rgba(6,78,59,0.18)] transition-all duration-500 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 sm:p-8",
                  isActive ? "cursor-pointer bg-emerald-800 text-white" : "bg-emerald-950 text-emerald-50",
                  !visible && "pointer-events-none opacity-0",
                )}
                style={{
                  zIndex: items.length - offset,
                  transform: `translate(${offset * 12}px, ${offset * 18}px) rotate(${offset * -0.8}deg) scale(${1 - offset * 0.04})`,
                  transformOrigin: "center",
                  opacity: visible ? 1 - offset * 0.15 : 0,
                }}
              >
                <Quote className={clsx("mb-5", isActive ? "text-emerald-200" : "text-emerald-300/70")} size={28} fill="currentColor" />
                <p className="text-lg font-black leading-8 sm:text-xl sm:leading-9">“{testimonial.quote}”</p>
                <div className="mt-7 flex items-center gap-4">
                  <span className={clsx("grid size-12 shrink-0 place-items-center rounded-full text-sm font-black", isActive ? "bg-white/15" : "bg-white/10")}>
                    {initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-black">{testimonial.customerName}</span>
                    <span className={clsx("mt-1 block text-sm leading-5", isActive ? "text-emerald-50/85" : "text-emerald-50/75")}>
                      {testimonial.role}
                    </span>
                    <span className={clsx("mt-2 flex items-center gap-1", isActive ? "text-amber-200" : "text-amber-100/80")}>
                      {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                        <Star key={starIndex} size={14} fill="currentColor" />
                      ))}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
