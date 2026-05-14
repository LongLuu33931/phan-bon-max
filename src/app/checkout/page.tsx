import type { Metadata } from "next";
import { CheckoutClient } from "@/components/cart/checkout-client";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Đặt hàng" };

export default function CheckoutPage() {
  return (
    <PublicLayout>
      <section className="section py-10">
        <CheckoutClient />
      </section>
    </PublicLayout>
  );
}
