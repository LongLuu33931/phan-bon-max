import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf, RefreshCw, ShieldCheck, Sprout } from "lucide-react";

const strengths = [
  {
    icon: Sprout,
    title: "Tập trung vào nền rễ",
    text: "RootMax NPK8000 hỗ trợ ra rễ mới, phát triển rễ tơ và giúp cây hấp thu dinh dưỡng ổn định hơn.",
  },
  {
    icon: RefreshCw,
    title: "Dễ đưa vào quy trình chăm sóc",
    text: "Các dòng sản phẩm được chia theo từng nhu cầu như phục hồi, bung đọt, làm hoa và nuôi trái.",
  },
  {
    icon: Leaf,
    title: "Hỗ trợ cây sau giai đoạn stress",
    text: "Phù hợp khi cây suy sau thu hoạch, mưa kéo dài, ngập úng hoặc chăm sóc sai nhịp.",
  },
  {
    icon: ShieldCheck,
    title: "Hướng đến canh tác bền hơn",
    text: "Tập trung cải thiện sức cây, nền đất và khả năng sinh trưởng thay vì chỉ thúc nhanh trong một giai đoạn.",
  },
];

const crops = ["Sầu riêng", "Cà phê", "Hồ tiêu", "Cây ăn trái", "Rau màu", "Lúa", "Cây công nghiệp"];

const recoverySignals = ["Vàng lá", "Không ra đọt", "Rễ yếu", "Cây suy", "Đất chai cứng"];

export function HomeWhyChooseSection() {
  return (
    <section className="bg-white py-14">
      <div className="section">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-semibold text-emerald-800">Vì sao chọn MAX 8000?</p>
            <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-stone-950">
              Chọn theo tình trạng cây, không chọn theo cảm tính
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
              MAX 8000 được xây theo từng nhóm nhu cầu ngoài vườn: phục hồi rễ, cải tạo đất, ra đọt, làm hoa và nuôi trái. Cách chia này giúp nhà vườn và đại lý tư vấn nhanh hơn khi cây đang gặp vấn đề cụ thể.
            </p>

            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
              <p className="font-black text-amber-950">Thường dùng khi cây có dấu hiệu</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recoverySignals.map((signal) => (
                  <span key={signal} className="rounded-md bg-white px-3 py-1.5 text-sm font-bold text-stone-800 ring-1 ring-amber-100">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((item) => (
              <article key={item.title} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
                <span className="grid size-11 place-items-center rounded-md bg-emerald-800 text-white">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-5 text-lg font-black leading-7 text-stone-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div> */}
        </div>

        <div className="mt-8 grid gap-5 rounded-lg border border-emerald-100 bg-emerald-50/70 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-800">Phù hợp nhiều nhóm cây</p>
            <p className="mt-3 max-w-2xl text-2xl font-black leading-tight text-stone-950">
              Một bộ sản phẩm, nhiều tình huống chăm sóc khác nhau ngoài vườn.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {crops.map((crop) => (
              <span key={crop} className="inline-flex min-h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-bold text-emerald-950 ring-1 ring-emerald-100">
                <CheckCircle2 size={15} className="text-emerald-700" />
                {crop}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
