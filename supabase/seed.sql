insert into public.categories (id, name, slug, description, sort_order, is_active)
values
  ('00000000-0000-0000-0000-000000000101', 'Cải Tạo Và Phục Hồi', 'cai-tao-va-phuc-hoi', 'Giải pháp cho đất chai, rễ yếu, cây suy và cần hồi phục nhanh.', 1, true),
  ('00000000-0000-0000-0000-000000000102', 'Phát Triển Sinh Trưởng', 'phat-trien-sinh-truong', 'Bung đọt, dày lá, xanh cây và tạo nền sinh trưởng khỏe.', 2, true),
  ('00000000-0000-0000-0000-000000000103', 'Nuôi Trái Và Cứng Cây', 'nuoi-trai-va-cung-cay', 'Nuôi trái lớn, đẹp mẫu, chắc cây và tăng giá trị thương phẩm.', 3, true),
  ('00000000-0000-0000-0000-000000000104', 'Ra Hoa Và Đậu Trái', 'ra-hoa-va-dau-trai', 'Kích hoa đồng loạt, tăng đậu trái, hạn chế rụng và nứt trái.', 4, true)
on conflict (slug) do nothing;
