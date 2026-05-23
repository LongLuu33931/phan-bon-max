import Image from "next/image";
import { Leaf } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductThumb({ product, priority = false }: { product: Product; priority?: boolean }) {
  if (product.thumbnailUrl) {
    return (
      <Image
        src={product.thumbnailUrl}
        alt={product.name}
        width={720}
        height={720}
        priority={priority}
        className="h-full w-full bg-white object-contain p-2 transition duration-300 group-hover:scale-105 sm:p-4"
      />
    );
  }

  return (
    <div className="flex h-full min-h-36 w-full min-w-0 flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#f7f3e8_0%,#dce9d3_52%,#f2c766_100%)] p-3 text-emerald-950 sm:min-h-64 sm:p-6">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-emerald-800 sm:text-xs sm:tracking-[0.2em]">
        <span>MAX 8000</span>
        <Leaf size={18} className="sm:size-[22px]" />
      </div>
      <div>
        <p className="hidden text-sm font-semibold text-stone-600 sm:block">Phân bón thế hệ mới</p>
        <p className="mt-2 break-words text-base font-black leading-tight sm:text-3xl">{product.name.split(" - ")[0]}</p>
      </div>
      <div className="hidden break-words rounded-md bg-white/70 p-3 text-sm font-semibold text-stone-700 shadow-sm sm:block">
        {product.shortDescription}
      </div>
    </div>
  );
}
