import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="section grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-semibold text-emerald-800">Về MAX 8000</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-stone-950">
            Giải pháp dinh dưỡng thực chiến cho nhà vườn
          </h1>
        </div>
        <div className="text-lg leading-8 text-stone-700">
          <p>
            MAX 8000 được xây dựng như một hệ sinh thái sản phẩm theo giai đoạn cây trồng:
            từ cải tạo đất, kích rễ, phát triển thân lá đến ra hoa, đậu trái và nuôi trái.
          </p>
          <div className="mt-6 grid gap-3">
            {["An toàn", "Hiệu quả", "Bền vững"].map((item) => (
              <p key={item} className="flex items-center gap-3 rounded-md bg-white p-4 font-semibold">
                <CheckCircle2 className="text-emerald-700" /> {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
