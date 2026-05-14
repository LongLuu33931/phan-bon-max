import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9\s.-]{8,13}$/, "Số điện thoại chưa hợp lệ"),
  address: z.string().trim().min(6, "Vui lòng nhập địa chỉ nhận hàng"),
  province: z.string().trim().min(2, "Vui lòng nhập tỉnh/thành"),
  note: z.string().trim().optional(),
  items: z.array(checkoutItemSchema).min(1, "Giỏ hàng đang trống"),
});

export const productSchema = z.object({
  name: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  sku: z.string().trim().min(2),
  categoryId: z.string().trim().min(1),
  price: z.coerce.number().int().min(0),
  origin: z.string().trim().default("Việt Nam"),
  shelfLife: z.string().trim().default("24 tháng"),
  shortDescription: z.string().trim().min(10),
  description: z.string().trim().min(10),
  specsJson: z.string().trim().default("[]"),
  benefitsJson: z.string().trim().default("[]"),
  usageRowsJson: z.string().trim().default("[]"),
  reasonsJson: z.string().trim().default("[]"),
  imagesJson: z.string().trim().default("[]"),
  note: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});
