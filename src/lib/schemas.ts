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

export const contactMessageSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9\s.-]{8,13}$/, "Số điện thoại chưa hợp lệ"),
  email: z.string().trim().email("Email chưa hợp lệ").optional().or(z.literal("")),
  province: z.string().trim().optional(),
  crop: z.string().trim().optional(),
  message: z.string().trim().min(10, "Nội dung cần tư vấn tối thiểu 10 ký tự"),
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

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập tên danh mục"),
  slug: z.string().trim().min(2, "Vui lòng nhập slug danh mục"),
  description: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập tên khách hàng"),
  role: z.string().trim().min(2, "Vui lòng nhập vai trò/mô tả khách"),
  province: z.string().trim().min(2, "Vui lòng nhập tỉnh/thành"),
  crop: z.string().trim().min(2, "Vui lòng nhập loại cây/vườn"),
  quote: z.string().trim().min(20, "Feedback nên có ít nhất 20 ký tự"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatarUrl: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFeatured: z.coerce.boolean().default(true),
  isActive: z.coerce.boolean().default(true),
});

export const postSchema = z.object({
  title: z.string().trim().min(3, "Vui lòng nhập tiêu đề bài viết"),
  slug: z.string().trim().min(3, "Vui lòng nhập slug bài viết"),
  excerpt: z.string().trim().min(10, "Vui lòng nhập mô tả ngắn"),
  content: z.string().trim().min(20, "Nội dung bài viết nên có ít nhất 20 ký tự"),
  coverImageUrl: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().trim().optional(),
});

export const siteSettingsSchema = z.object({
  brandName: z.string().trim().min(2, "Vui lòng nhập tên thương hiệu"),
  tagline: z.string().trim().min(2, "Vui lòng nhập tagline"),
  logoUrl: z.string().trim().optional(),
  hotline: z.string().trim().min(8, "Vui lòng nhập hotline"),
  zaloUrl: z.string().trim().min(5, "Vui lòng nhập Zalo URL"),
  email: z.string().trim().email("Email chưa hợp lệ"),
  address: z.string().trim().min(5, "Vui lòng nhập địa chỉ"),
  heroSlidesJson: z.string().trim().default("[]"),
});
