import { Clock3, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const features = [
  { icon: Clock3, title: "Phục vụ nhanh", text: "Tư vấn chọn sản phẩm theo cây trồng" },
  { icon: ShieldCheck, title: "Thông tin rõ", text: "Công dụng, liều dùng, giai đoạn" },
  { icon: PackageCheck, title: "Đủ bộ MAX 8000", text: "Từ phục hồi đến nuôi trái" },
  { icon: Truck, title: "Giao hàng linh hoạt", text: "COD cho nhà vườn và đại lý" },
];

export function HomeFeatureStrip() {
  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="section grid grid-cols-1 gap-4 py-5 md:grid-cols-4">
        {features.map((item) => (
          <div key={item.title} className="flex items-center gap-3 rounded-md bg-stone-50 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-800 text-white">
              <item.icon size={20} />
            </span>
            <div>
              <p className="font-bold text-stone-950">{item.title}</p>
              <p className="text-sm text-stone-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
