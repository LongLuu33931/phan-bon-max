import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf, PackageCheck, ShieldCheck, Sprout } from "lucide-react";

const principles = [
  {
    icon: Sprout,
    title: "Chọn theo tình trạng cây",
    text: "Nhà vườn thường bắt đầu từ vấn đề ngoài vườn: rễ yếu, cây suy, ra đọt kém, rụng hoa hoặc trái lên chậm. MAX 8000 chia sản phẩm theo các nhu cầu đó để dễ chọn hơn.",
  },
  {
    icon: Leaf,
    title: "Theo sát từng giai đoạn",
    text: "Từ cải tạo đất, kích rễ, phục hồi cây suy đến làm hoa, đậu trái và nuôi trái, mỗi nhóm sản phẩm có vai trò riêng trong quy trình chăm sóc.",
  },
  {
    icon: PackageCheck,
    title: "Dễ tư vấn cho đại lý",
    text: "Thông tin sản phẩm được trình bày rõ về công dụng, thời điểm dùng và nhóm cây phù hợp, giúp đại lý trả lời khách nhanh và nhất quán hơn.",
  },
  {
    icon: ShieldCheck,
    title: "Hướng đến canh tác bền hơn",
    text: "MAX 8000 tập trung vào nền đất, bộ rễ và sức cây để hỗ trợ năng suất lâu dài, thay vì chỉ nhìn vào một lần thúc nhanh trước mắt.",
  },
];

const productGroups = [
  "Cải tạo đất, phục hồi nền rễ",
  "Kích rễ, bung đọt, xanh lá",
  "Phát triển thân lá, giữ sức cây",
  "Ra hoa, đậu trái, hạn chế rụng",
  "Nuôi trái, đẹp màu, tăng chất lượng",
];

const workflow = [
  {
    step: "01",
    title: "Nhận tình trạng vườn",
    text: "Ghi nhận loại cây, giai đoạn sinh trưởng, biểu hiện đang gặp và lịch chăm sóc gần nhất.",
  },
  {
    step: "02",
    title: "Gợi ý nhóm sản phẩm",
    text: "Chọn dòng phù hợp theo vấn đề chính: phục hồi, ra đọt, làm hoa, giữ trái hoặc nuôi trái.",
  },
  {
    step: "03",
    title: "Theo dõi và điều chỉnh",
    text: "Khuyến nghị đối chiếu hướng dẫn trên nhãn và điều chỉnh theo thời tiết, sức cây, nền đất.",
  },
];

export function AboutContent() {
  return (
    <>
      <section className="section py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-semibold text-emerald-800">Về MAX 8000</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
              Giải pháp dinh dưỡng thực chiến cho nhà vườn và đại lý
            </h1>
          </div>
          <div className="text-lg leading-8 text-stone-700">
            <p>
              MAX 8000 được xây dựng như một hệ sinh thái sản phẩm theo giai đoạn cây trồng: từ cải tạo đất, kích rễ,
              phục hồi cây suy đến ra hoa, đậu trái và nuôi trái. Mục tiêu là giúp người dùng chọn đúng nhóm sản phẩm
              theo tình trạng thực tế ngoài vườn.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="section">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item) => (
              <article key={item.title} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
                <span className="grid size-11 place-items-center rounded-md bg-emerald-800 text-white">
                  <item.icon size={20} />
                </span>
                <h2 className="mt-5 text-lg font-black leading-7 text-stone-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="font-semibold text-emerald-800">Bộ sản phẩm theo nhu cầu</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-stone-950">
            Không chỉ bán một sản phẩm, MAX 8000 đi theo cả quy trình chăm sóc
          </h2>
          <p className="mt-4 leading-7 text-stone-600">
            Mỗi vườn có nền đất, giống cây, thời tiết và lịch chăm sóc khác nhau. Vì vậy, cách tư vấn của MAX 8000 ưu tiên
            xác định vấn đề chính trước, sau đó mới chọn dòng sản phẩm phù hợp.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-5">
          {productGroups.map((group) => (
            <p key={group} className="flex items-start gap-3 rounded-md bg-white p-4 font-semibold text-stone-800 ring-1 ring-emerald-100">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={18} />
              {group}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="section">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-emerald-800">Cách MAX 8000 tư vấn</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-stone-950">Bắt đầu từ tình trạng cây</h2>
            </div>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 font-black text-emerald-800">
              Gửi thông tin vườn <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflow.map((item) => (
              <article key={item.step} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <span className="text-sm font-black text-amber-700">{item.step}</span>
                <h3 className="mt-3 text-xl font-black text-stone-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-12">
        <div className="grid gap-5 rounded-lg bg-emerald-900 p-6 text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-200">Đồng hành cùng nhà vườn</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight">
              Cần chọn dòng phù hợp cho vườn đang gặp vấn đề?
            </h2>
          </div>
          <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-amber-400 px-5 font-black text-emerald-950 transition hover:bg-amber-300">
            Xem sản phẩm <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
