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
        className="h-full w-full bg-white object-contain p-4 transition duration-300 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full min-h-64 w-full min-w-0 flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#f7f3e8_0%,#dce9d3_52%,#f2c766_100%)] p-6 text-emerald-950">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
        <span>MAX 8000</span>
        <Leaf size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-600">Phân bón thế hệ mới</p>
        <p className="mt-2 break-words text-2xl font-black leading-tight sm:text-3xl">{product.name.split(" - ")[0]}</p>
      </div>
      <div className="break-words rounded-md bg-white/70 p-3 text-sm font-semibold text-stone-700 shadow-sm">
        {product.shortDescription}
      </div>
    </div>
  );
}
