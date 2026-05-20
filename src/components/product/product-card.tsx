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
        <article className="group min-w-0 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl">
            <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-square min-w-0 overflow-hidden bg-stone-50"
            >
                <ProductThumb product={product} />
            </Link>
            <div className="min-w-0 p-4">
                {category && showCategory ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        {category.name}
                    </p>
                ) : null}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-2 line-clamp-2 min-h-12 break-words text-base font-semibold leading-6 text-stone-950 group-hover:text-emerald-800">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-stone-600">
                    {product.shortDescription}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-bold text-amber-700">
                        {formatCurrency(product.price)}
                    </p>
                    <ProductCardAddToCart product={product} />
                </div>
            </div>
        </article>
    );
}
