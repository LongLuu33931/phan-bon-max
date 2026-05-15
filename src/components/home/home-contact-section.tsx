import { ContactForm } from "@/components/contact/contact-form";

export function HomeContactSection() {
  return (
    <section className="bg-white py-14">
      <div className="section">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="rounded-2xl bg-emerald-900 p-6 text-white">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-200">Liên hệ tư vấn</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Gửi thông tin vườn để được tư vấn đúng dòng MAX 8000
            </h2>
            <p className="mt-4 leading-7 text-emerald-50/85">
              Để lại số điện thoại, loại cây và tình trạng đang gặp. Đội ngũ MAX 8000 sẽ liên hệ lại để gợi ý sản phẩm phù hợp.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
