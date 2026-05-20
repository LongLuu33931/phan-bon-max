import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

interface HomeSolutionSectionProps {
    brandName: string;
}

const highlights = [
    "Tiên phong nghiên cứu và ứng dụng công nghệ dinh dưỡng thế hệ mới, tạo ra bộ sản phẩm đột phá cho từng giai đoạn phát triển của cây trồng.",
    "Đội ngũ chuyên gia giàu kinh nghiệm đồng hành cùng bà con trong từng mùa vụ — từ phục hồi đất, ra rễ, bung đọt đến nuôi trái chất lượng.",
    "Hướng đến nền nông nghiệp xanh – sạch – hiệu quả, nâng cao giá trị nông sản Việt trên thị trường.",
];

export function HomeSolutionSection({ brandName }: HomeSolutionSectionProps) {
    return (
        <section className="bg-white py-14">
            <div className="section">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="relative overflow-hidden rounded-xl">
                        <Image
                            src="/images/solution.png"
                            alt="Giải pháp dinh dưỡng cây trồng"
                            width={800}
                            height={600}
                            className="h-auto w-full rounded-xl"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-800">
                            Giải pháp từ chúng tôi
                        </p>
                        <h2 className="mt-3 text-3xl font-black leading-tight text-stone-950">
                            Sản phẩm chất lượng – Tận tâm – Vì một nền nông
                            nghiệp xanh
                        </h2>
                        <p className="mt-5 text-base leading-7 text-stone-600">
                            Hệ sinh thái{" "}
                            <span className="font-black text-emerald-800">
                                {brandName}
                            </span>{" "}
                            – đơn vị tiên phong cung cấp giải pháp dinh dưỡng
                            toàn diện cho cây trồng. Chúng tôi giúp cây phát
                            triển khỏe mạnh từ gốc rễ, tăng năng suất bền vững
                            và kiến tạo những mùa vàng thịnh vượng cho bà con.
                        </p>

                        <div className="mt-6 space-y-4">
                            {highlights.map((text, index) => (
                                <div key={index} className="flex gap-3">
                                    <CheckCircle2
                                        size={20}
                                        className="mt-0.5 shrink-0 text-emerald-700"
                                    />
                                    <p className="text-sm leading-relaxed text-stone-700">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
