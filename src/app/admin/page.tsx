import Link from "next/link";
import { Newspaper, Package, ShoppingBag } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAllProductsForAdmin, getPosts } from "@/lib/data";

export default async function AdminPage() {
  const [products, posts] = await Promise.all([getAllProductsForAdmin(), getPosts()]);

  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-stone-950">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/admin/products" className="rounded-lg border border-stone-200 bg-white p-5">
          <Package className="text-emerald-800" />
          <p className="mt-4 text-3xl font-black">{products.length}</p>
          <p className="text-sm font-semibold text-stone-600">Sản phẩm</p>
        </Link>
        <Link href="/admin/orders" className="rounded-lg border border-stone-200 bg-white p-5">
          <ShoppingBag className="text-emerald-800" />
          <p className="mt-4 text-3xl font-black">0</p>
          <p className="text-sm font-semibold text-stone-600">Đơn mới</p>
        </Link>
        <Link href="/admin/posts" className="rounded-lg border border-stone-200 bg-white p-5">
          <Newspaper className="text-emerald-800" />
          <p className="mt-4 text-3xl font-black">{posts.length}</p>
          <p className="text-sm font-semibold text-stone-600">Tin tức</p>
        </Link>
      </div>
    </AdminShell>
  );
}
