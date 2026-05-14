import type { Metadata } from "next";
import { CartClient } from "@/components/cart/cart-client";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <PublicLayout>
      <section className="section py-10">
        <CartClient />
      </section>
    </PublicLayout>
  );
}
