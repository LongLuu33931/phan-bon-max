export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductBenefit = {
  title: string;
  description: string;
};

export type ProductUsageRow = {
  crop: string;
  dosage: string;
  timing: string;
};

export type ProductImage = {
  url: string;
  alt: string;
  isPrimary?: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  origin: string;
  shelfLife: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  benefits: ProductBenefit[];
  usageRows: ProductUsageRow[];
  reasons: string[];
  note?: string;
  thumbnailUrl?: string;
  images: ProductImage[];
  isFeatured: boolean;
  isActive: boolean;
  relatedSlugs: string[];
  seoTitle: string;
  seoDescription: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  status: "draft" | "published";
  publishedAt: string;
};

export type SiteSettings = {
  hotline: string;
  zaloUrl: string;
  email: string;
  address: string;
  brandName: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  thumbnailUrl?: string;
  quantity: number;
};

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  address: string;
  province: string;
  note?: string;
  items: Array<{ productId: string; quantity: number }>;
};
