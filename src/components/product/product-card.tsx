import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { ProductCardAddToCart } from "./product-card-add-to-cart";
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
        <article className="group min-w-0 overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl sm:rounded-lg">
            <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-square min-w-0 overflow-hidden bg-stone-50"
            >
                <ProductThumb product={product} />
            </Link>
            <div className="min-w-0 p-2.5 sm:p-4">
                {category && showCategory ? (
                    <p className="hidden text-xs font-semibold uppercase tracking-wide text-emerald-700 sm:block">
                        {category.name}
                    </p>
                ) : null}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="line-clamp-2 min-h-9 break-words text-xs font-semibold leading-[1.45] text-stone-950 group-hover:text-emerald-800 sm:mt-2 sm:min-h-12 sm:text-base sm:leading-6">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 hidden break-words text-sm leading-6 text-stone-600 sm:line-clamp-2">
                    {product.shortDescription}
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <p className="truncate text-xs font-bold text-amber-700 sm:text-base">
                        {formatCurrency(product.price)}
                    </p>
                    <ProductCardAddToCart product={product} />
                </div>
            </div>
        </article>
    );
}
