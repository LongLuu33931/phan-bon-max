import Image from "next/image";

const painPoints = [
    {
        image: "/images/pain1.png",
        title: "Đất chai cứng – Rễ bị \u201cgiam\u201d dưới đất",
        description:
            "Đất bạc màu, nén chặt khiến rễ không thể vươn ra. Cây vàng lá, không ra đọt mới, suy kiệt dần vì không hấp thu được dinh dưỡng dù bón bao nhiêu.",
    },
    {
        image: "/images/pain2.png",
        title: "Cây còi cọc – Sâu bệnh tấn công liên tục",
        description:
            "Thân cành yếu ớt, chậm lớn, sức đề kháng gần như bằng không. Nấm bệnh và côn trùng dễ dàng xâm nhiễm, phun thuốc liên tục mà không dứt điểm.",
    },
    {
        image: "/images/pain3.png",
        title: "Hoa rụng, đậu trái thất thường",
        description:
            "Ra hoa không đồng loạt, tỷ lệ đậu trái thấp, cuống yếu dễ rụng. Mỗi mùa vụ trôi qua là một lần năng suất sụt giảm nghiêm trọng.",
    },
    {
        image: "/images/pain4.1.png",
        title: "Trái kém chất lượng – Bán không được giá",
        description:
            "Trái nhỏ, chậm lớn, màu sắc nhợt nhạt. Ruột xốp, thiếu độ ngọt, ăn nhạt. Thương lái ép giá, công sức cả mùa thu về không đáng bao nhiêu.",
    },
];

export function HomePainPointsSection() {
    return (
        <section className="bg-stone-50 py-14">
            <div className="section">
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-red-700">
                        Vườn bạn đang gặp vấn đề gì?
                    </p>
                    <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight text-stone-950">
                        Những &ldquo;nỗi đau&rdquo; mà nhà vườn nào cũng từng
                        trải qua
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-stone-600">
                        Bón phân nhiều nhưng cây vẫn không khỏe? Có thể bạn đang
                        chữa triệu chứng mà chưa giải quyết gốc rễ vấn đề.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {painPoints.map((item, index) => (
                        <article
                            key={index}
                            className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="relative w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="text-base font-black leading-snug text-stone-900">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                    {item.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
