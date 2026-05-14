import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { ProductThumb } from "./product-thumb";

export function ProductCard({ product, category }: { product: Product; category?: Category }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block aspect-square overflow-hidden">
        <ProductThumb product={product} />
      </Link>
      <div className="p-4">
        {category ? <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{category.name}</p> : null}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-stone-950 group-hover:text-emerald-800">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-bold text-amber-700">{formatCurrency(product.price)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-800 text-white"
            aria-label={`Xem ${product.name}`}
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
