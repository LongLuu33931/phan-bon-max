insert into public.categories (id, name, slug, description, sort_order, is_active)
values
  ('00000000-0000-0000-0000-000000000101', 'Cải Tạo Và Phục Hồi', 'cai-tao-va-phuc-hoi', 'Giải pháp cho đất chai, rễ yếu, cây suy và cần hồi phục nhanh.', 1, true),
  ('00000000-0000-0000-0000-000000000102', 'Phát Triển Sinh Trưởng', 'phat-trien-sinh-truong', 'Bung đọt, dày lá, xanh cây và tạo nền sinh trưởng khỏe.', 2, true),
  ('00000000-0000-0000-0000-000000000103', 'Nuôi Trái Và Cứng Cây', 'nuoi-trai-va-cung-cay', 'Nuôi trái lớn, đẹp mẫu, chắc cây và tăng giá trị thương phẩm.', 3, true),
  ('00000000-0000-0000-0000-000000000104', 'Ra Hoa Và Đậu Trái', 'ra-hoa-va-dau-trai', 'Kích hoa đồng loạt, tăng đậu trái, hạn chế rụng và nứt trái.', 4, true)
on conflict (slug) do nothing;

insert into public.testimonials
  (id, customer_name, role, province, crop, quote, rating, avatar_url, sort_order, is_featured, is_active)
values
  ('00000000-0000-0000-0000-000000000301', 'Anh Minh', 'Nhà vườn sầu riêng', 'Đắk Lắk', 'Sầu riêng', 'Sau giai đoạn cây suy, tôi dùng nhóm phục hồi rễ trước rồi mới chuyển sang nuôi trái. Cây lên đọt đều hơn, dễ theo dõi sức cây.', 5, '/product-images/fruit-max-npk-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-31-11.png', 1, true, true),
  ('00000000-0000-0000-0000-000000000302', 'Chị Hạnh', 'Đại lý vật tư nông nghiệp', 'Lâm Đồng', 'Rau màu', 'Bộ sản phẩm chia theo vấn đề rất dễ tư vấn. Khách hỏi vàng lá, rễ yếu hay nuôi trái đều có nhóm sản phẩm rõ ràng để giới thiệu.', 5, '/product-images/rootmax-npk8000/16640ca628dca982f0cd.jpg', 2, true, true),
  ('00000000-0000-0000-0000-000000000303', 'Anh Tâm', 'Nhà vườn cây ăn trái', 'Tiền Giang', 'Cây ăn trái', 'Tôi thích phần hướng dẫn liều dùng và giai đoạn sử dụng rõ. Dễ phối hợp theo lịch chăm sóc vườn mà không bị rối sản phẩm.', 4, '/product-images/cal-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-06-23.png', 3, true, true)
on conflict (id) do update set
  customer_name=excluded.customer_name,
  role=excluded.role,
  province=excluded.province,
  crop=excluded.crop,
  quote=excluded.quote,
  rating=excluded.rating,
  avatar_url=excluded.avatar_url,
  sort_order=excluded.sort_order,
  is_featured=excluded.is_featured,
  is_active=excluded.is_active,
  updated_at=now();

insert into public.site_settings (key, value, updated_at)
values (
  'site',
  '{
    "brandName": "MAX 8000",
    "tagline": "Dinh dưỡng cây trồng",
    "logoUrl": "https://phanbonmax8000.com/wp-content/uploads/2026/05/LOGO.png",
    "hotline": "0396 726 429",
    "zaloUrl": "https://zalo.me/0396726429",
    "email": "admin@phanbonmax8000.com",
    "address": "Nhà Máy Sản Xuất, Phường Trường Thi, Tỉnh Ninh Bình"
  }'::jsonb,
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
