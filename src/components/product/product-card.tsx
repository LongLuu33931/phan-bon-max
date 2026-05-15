import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { ProductThumb } from "./product-thumb";

export function ProductCard({
  product,
  category,
  showCategory = true,
}: {
  product: Product;
  category?: Category;
  showCategory?: boolean;
}) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square min-w-0 overflow-hidden bg-stone-50">
        {category && showCategory ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-emerald-900 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {category.name}
          </span>
        ) : null}
        <ProductThumb product={product} />
      </Link>
      <div className="min-w-0 p-4">
        {category && showCategory ? <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{category.name}</p> : null}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-12 break-words text-base font-semibold leading-6 text-stone-950 group-hover:text-emerald-800">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-stone-600">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-bold text-amber-700">{formatCurrency(product.price)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-800 text-white"
            aria-label={`Xem ${product.name}`}
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
