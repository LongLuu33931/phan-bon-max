import type { Category, Post, Product, SiteSettings } from "./types";

export const siteSettings: SiteSettings = {
  brandName: "MAX 8000",
  hotline: "0396 726 429",
  zaloUrl: "https://zalo.me/0396726429",
  email: "admin@phanbonmax8000.com",
  address: "Nhà Máy Sản Xuất, Phường Trường Thi, Tỉnh Ninh Bình",
};

export const categories: Category[] = [
  {
    id: "cat-recovery",
    name: "Cải Tạo Và Phục Hồi",
    slug: "cai-tao-va-phuc-hoi",
    description: "Giải pháp cho đất chai, rễ yếu, cây suy và cần hồi phục nhanh.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-growth",
    name: "Phát Triển Sinh Trưởng",
    slug: "phat-trien-sinh-truong",
    description: "Bung đọt, dày lá, xanh cây và tạo nền sinh trưởng khỏe.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-fruit",
    name: "Nuôi Trái Và Cứng Cây",
    slug: "nuoi-trai-va-cung-cay",
    description: "Nuôi trái lớn, đẹp mẫu, chắc cây và tăng giá trị thương phẩm.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-flower",
    name: "Ra Hoa Và Đậu Trái",
    slug: "ra-hoa-va-dau-trai",
    description: "Kích hoa đồng loạt, tăng đậu trái, hạn chế rụng và nứt trái.",
    sortOrder: 4,
    isActive: true,
  },
];

const defaultUsage = [
  {
    crop: "Cây ăn trái, cây công nghiệp",
    dosage: "Pha theo khuyến cáo trên nhãn, phun hoặc tưới đều vùng rễ.",
    timing: "Dùng định kỳ 10-15 ngày/lần theo từng giai đoạn sinh trưởng.",
  },
  {
    crop: "Rau màu, hoa kiểng",
    dosage: "Pha loãng với nước sạch, dùng vào sáng sớm hoặc chiều mát.",
    timing: "Dùng khi cây cần phục hồi, ra đọt, ra hoa hoặc nuôi trái.",
  },
];

const baseReasons = [
  "Công thức tập trung theo từng giai đoạn cây trồng, dễ chọn đúng nhu cầu.",
  "Dễ phối hợp trong quy trình chăm sóc vườn, phù hợp nhiều nhóm cây.",
  "Thông tin hướng dẫn rõ ràng để đại lý và nhà vườn tư vấn nhanh.",
];

export const products: Product[] = [
  {
    id: "prod-rootmax",
    categoryId: "cat-recovery",
    name: "RootMax NPK8000 - Kích Rễ Cực Mạnh, Bung Đọt Cực Nhanh",
    slug: "rootmax-npk8000",
    sku: "ROOTMAX-500G",
    price: 319000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Kích rễ mới, phục hồi bộ rễ yếu và giúp cây bung đọt nhanh sau giai đoạn suy.",
    description:
      "RootMax NPK8000 thuộc nhóm cải tạo và phục hồi, dùng khi cây cần tái tạo bộ rễ, tăng hấp thu dinh dưỡng và bật lại sinh trưởng.",
    specs: [
      { label: "Dạng", value: "Bột hòa tan" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Kích rễ, bung đọt, phục hồi cây suy" },
      { label: "Đối tượng sử dụng", value: "Cây ăn trái, rau màu, hoa kiểng, cây công nghiệp" },
    ],
    benefits: [
      { title: "Rễ mới khỏe", description: "Hỗ trợ ra rễ tơ, tăng khả năng hút nước và dinh dưỡng." },
      { title: "Bung đọt nhanh", description: "Giúp cây bật chồi non đều sau khi phục hồi bộ rễ." },
      { title: "Giảm suy cây", description: "Phù hợp vườn sau thu hoạch, sau hạn mặn hoặc stress thời tiết." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: true,
    isActive: true,
    images: [],
    relatedSlugs: ["soil-max-8000", "recover-max-8000"],
    seoTitle: "RootMax NPK8000 - Phân bón kích rễ MAX 8000",
    seoDescription: "RootMax NPK8000 giúp kích rễ, bung đọt và phục hồi cây suy.",
  },
  {
    id: "prod-soilmax",
    categoryId: "cat-recovery",
    name: "Soil Max 8000 - Cải Tạo Đất, Phục Hồi Nền Rễ",
    slug: "soil-max-8000",
    sku: "SOILMAX-500G",
    price: 279000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Hỗ trợ cải tạo đất chai cứng, tạo môi trường rễ thông thoáng và khỏe hơn.",
    description:
      "Soil Max 8000 tập trung vào nền đất và vùng rễ, phù hợp vườn canh tác lâu năm, đất kém tơi xốp hoặc cây hấp thu kém.",
    specs: [
      { label: "Dạng", value: "Bột" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Cải tạo đất, hỗ trợ rễ, tăng hấp thu" },
    ],
    benefits: [
      { title: "Đất tơi hơn", description: "Hỗ trợ cải thiện vùng rễ trong đất canh tác lâu năm." },
      { title: "Rễ dễ thở", description: "Tạo điều kiện để rễ phát triển đều và hấp thu dinh dưỡng tốt hơn." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: true,
    isActive: true,
    images: [],
    relatedSlugs: ["rootmax-npk8000", "recover-max-8000"],
    seoTitle: "Soil Max 8000 - Cải tạo đất cho cây trồng",
    seoDescription: "Soil Max 8000 hỗ trợ cải tạo đất chai cứng và phục hồi nền rễ.",
  },
  {
    id: "prod-recover",
    categoryId: "cat-recovery",
    name: "Recover Max 8000 - Phục Hồi Cây Suy, Xanh Lá Lại Nhanh",
    slug: "recover-max-8000",
    sku: "RECOVER-500G",
    price: 299000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Dùng cho cây vàng lá, suy sau thu hoạch, stress do thời tiết hoặc chăm sóc sai nhịp.",
    description: "Recover Max hỗ trợ cây phục hồi sinh lực, tái tạo lá và rễ để quay lại chu kỳ phát triển ổn định.",
    specs: [
      { label: "Dạng", value: "Bột" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Phục hồi cây suy, xanh lá, tăng sức cây" },
    ],
    benefits: [
      { title: "Phục hồi nhanh", description: "Bổ sung dinh dưỡng cân bằng cho giai đoạn cây yếu." },
      { title: "Xanh lá trở lại", description: "Hỗ trợ lá dày và xanh, hạn chế biểu hiện thiếu sức." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: false,
    isActive: true,
    images: [],
    relatedSlugs: ["rootmax-npk8000", "leaf-max-8000"],
    seoTitle: "Recover Max 8000 - Phục hồi cây suy",
    seoDescription: "Recover Max 8000 hỗ trợ phục hồi cây suy, vàng lá và stress.",
  },
  {
    id: "prod-grow",
    categoryId: "cat-growth",
    name: "Grow Max 8000 - Tăng Sinh Trưởng, Cây Khỏe Đều",
    slug: "grow-max-8000",
    sku: "GROW-500G",
    price: 279000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Giúp cây phát triển cân đối, khỏe thân lá và chuẩn bị tốt cho giai đoạn sau.",
    description: "Grow Max phù hợp giai đoạn cây con, sau phục hồi hoặc lúc cần tăng sinh trưởng thân lá ổn định.",
    specs: [
      { label: "Dạng", value: "Bột hòa tan" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Tăng sinh trưởng thân lá" },
    ],
    benefits: [
      { title: "Cây lớn đều", description: "Hỗ trợ sinh trưởng cân đối, không thúc quá gắt." },
      { title: "Nền cây khỏe", description: "Tạo nền cho giai đoạn ra hoa và nuôi trái." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: false,
    isActive: true,
    images: [],
    relatedSlugs: ["shoot-max-8000", "leaf-max-8000"],
    seoTitle: "Grow Max 8000 - Phân bón tăng sinh trưởng",
    seoDescription: "Grow Max 8000 hỗ trợ cây khỏe, thân lá phát triển đều.",
  },
  {
    id: "prod-shoot",
    categoryId: "cat-growth",
    name: "Shoot Max 8000 - Bung Chồi, Ra Đọt Mạnh",
    slug: "shoot-max-8000",
    sku: "SHOOT-500G",
    price: 299000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Tập trung hỗ trợ bung chồi non, ra đọt đều và phục hồi tán lá.",
    description: "Shoot Max dùng khi cây cần ra đọt đồng loạt, đặc biệt sau cắt tỉa, sau thu hoạch hoặc sau phục hồi.",
    specs: [
      { label: "Dạng", value: "Bột" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Bung chồi, ra đọt, phục hồi tán" },
    ],
    benefits: [
      { title: "Đọt ra đều", description: "Hỗ trợ chồi non phát triển đồng loạt." },
      { title: "Tán khỏe", description: "Giúp bộ lá mới phát triển tốt hơn cho chu kỳ sau." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: true,
    isActive: true,
    images: [],
    relatedSlugs: ["grow-max-8000", "leaf-max-8000"],
    seoTitle: "Shoot Max 8000 - Bung chồi ra đọt",
    seoDescription: "Shoot Max 8000 hỗ trợ bung đọt, ra chồi và phục hồi tán cây.",
  },
  {
    id: "prod-leaf",
    categoryId: "cat-growth",
    name: "Leaf Max 8000 - Dày Lá, Xanh Lá, Tăng Quang Hợp",
    slug: "leaf-max-8000",
    sku: "LEAF-500G",
    price: 259000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Giúp lá xanh, dày, khỏe và nâng hiệu suất quang hợp cho cây.",
    description: "Leaf Max tập trung vào chất lượng bộ lá, phù hợp cây vàng lá, lá mỏng hoặc cần tăng sức trước khi làm hoa.",
    specs: [
      { label: "Dạng", value: "Bột hòa tan" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Xanh lá, dày lá, tăng quang hợp" },
    ],
    benefits: [
      { title: "Lá dày xanh", description: "Hỗ trợ cải thiện màu lá và độ dày lá." },
      { title: "Cây sung sức", description: "Bộ lá khỏe giúp cây tích lũy tốt hơn." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: false,
    isActive: true,
    images: [],
    relatedSlugs: ["grow-max-8000", "recover-max-8000"],
    seoTitle: "Leaf Max 8000 - Phân bón dày lá xanh lá",
    seoDescription: "Leaf Max 8000 hỗ trợ lá xanh, dày và khỏe hơn.",
  },
  {
    id: "prod-fruit",
    categoryId: "cat-fruit",
    name: "Fruit Max NPK 8000 - Thúc Trái Lớn Nhanh, Nặng Ký, Đẹp Màu",
    slug: "fruit-max-npk-8000",
    sku: "FRUIT-500G",
    price: 379000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription:
      "Công thức giàu Kali 44%, hỗ trợ vận chuyển dinh dưỡng về trái để trái lớn nhanh, bóng đẹp và nặng ký.",
    description:
      "Fruit Max NPK 8000 là dòng phân bón hỗn hợp cao cấp thuộc nhóm nuôi trái. Sản phẩm được thiết kế cho giai đoạn trái cần tăng kích thước, trọng lượng, độ bóng và chất lượng hương vị.",
    specs: [
      { label: "Tên sản phẩm", value: "Fruit Max NPK 8000" },
      { label: "Dạng", value: "Bột" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Thành phần chính", value: "Đạm (N) 7%; Lân (P2O5) 5%; Kali (K2O) 44%; Độ ẩm 5%" },
      { label: "Công dụng chính", value: "Nuôi trái lớn nhanh, bóng trái, nặng ký" },
      { label: "Đối tượng sử dụng", value: "Lúa, rau màu, hoa cảnh, cây ăn trái và cây công nghiệp" },
    ],
    benefits: [
      { title: "Trái lớn nhanh - nặng ký", description: "Thúc đẩy vận chuyển dinh dưỡng về trái, giúp trái phát triển chắc thịt và tăng trọng lượng." },
      { title: "Lên màu đồng đều", description: "Hỗ trợ trái lên màu đẹp, vỏ bóng và tăng tính thương phẩm." },
      { title: "Tăng độ ngọt và hương vị", description: "Tăng tích lũy đường, tinh bột để trái đậm vị hơn." },
      { title: "Chuẩn chất lượng thương phẩm", description: "Giúp trái chắc khỏe, tươi lâu hơn sau thu hoạch." },
    ],
    usageRows: [
      { crop: "Lúa", dosage: "Pha 1 hũ 500g cho 800 lít nước (2.000 m2)", timing: "Bón 3 lần: 7 ngày sau sạ, trước trổ đồng và sau khi trổ đều." },
      { crop: "Rau màu", dosage: "Pha 1 hũ 500g cho 800 lít nước (2.000 m2)", timing: "Dùng từ khi có 3-4 lá thật đến trước thu hoạch, cách nhau 10-15 ngày." },
      { crop: "Hoa, cây cảnh", dosage: "Pha 1 hũ 500g cho 1.000 lít nước (2.500 m2)", timing: "Bón trước khi nảy chồi và kỳ ra nụ hoa." },
      { crop: "Cây ăn trái, công nghiệp", dosage: "Pha 1 hũ 500g cho 400 lít nước (1.000 m2)", timing: "Dùng khi hoa mới nhú và khi trái non mới hình thành." },
    ],
    reasons: [
      "Hàm lượng Kali cao 44%, phù hợp giai đoạn vào trái, vào đường và lên màu.",
      "Tập trung cả kích thước, trọng lượng và độ bóng trái.",
      "Hỗ trợ vỏ trái dai khỏe, thuận lợi cho bảo quản và vận chuyển.",
    ],
    note: "Sản phẩm là phân bón hỗn hợp NPK VNa 60.",
    isFeatured: true,
    isActive: true,
    images: [],
    relatedSlugs: ["stem-max-8000", "cal-max-8000"],
    seoTitle: "Fruit Max NPK 8000 - Nuôi trái lớn nhanh, nặng ký",
    seoDescription: "Fruit Max NPK 8000 giàu Kali 44%, giúp trái lớn nhanh, bóng đẹp và nặng ký.",
  },
  {
    id: "prod-stem",
    categoryId: "cat-fruit",
    name: "Stem Max NPK 8000 - Cứng Cây Vững Gốc, Bảo Vệ Năng Suất",
    slug: "stem-max-8000",
    sku: "STEM-500G",
    price: 259000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Hỗ trợ thân cành cứng khỏe, giảm đổ ngã và giúp cây chịu tải trái tốt hơn.",
    description: "Stem Max phù hợp giai đoạn cây cần cứng thân, chắc cành, nâng sức chống chịu và bảo vệ năng suất.",
    specs: [
      { label: "Dạng", value: "Bột" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Cứng cây, chắc thân, hạn chế đổ ngã" },
    ],
    benefits: [
      { title: "Thân cành vững", description: "Hỗ trợ mô cây chắc khỏe hơn." },
      { title: "Chịu tải trái", description: "Giúp cây ổn định hơn trong giai đoạn nuôi trái." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: false,
    isActive: true,
    images: [],
    relatedSlugs: ["fruit-max-npk-8000", "cal-max-8000"],
    seoTitle: "Stem Max 8000 - Cứng cây vững gốc",
    seoDescription: "Stem Max 8000 hỗ trợ cứng cây, chắc cành và bảo vệ năng suất.",
  },
  {
    id: "prod-flower",
    categoryId: "cat-flower",
    name: "Flower Max 8000 - Kích Hoa Đồng Loạt, Tối Ưu Năng Suất Trái",
    slug: "flower-max-8000",
    sku: "FLOWER-500G",
    price: 379000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription: "Hỗ trợ phân hóa mầm hoa, ra hoa đồng loạt và tạo tiền đề đậu trái tốt.",
    description: "Flower Max dùng cho giai đoạn chuẩn bị ra hoa, giúp hoa ra đều, khỏe và tăng cơ hội đậu trái.",
    specs: [
      { label: "Dạng", value: "Bột" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Công dụng chính", value: "Kích hoa, ra hoa đồng loạt, tăng đậu trái" },
    ],
    benefits: [
      { title: "Hoa ra đồng loạt", description: "Hỗ trợ phân hóa và bung hoa đều hơn." },
      { title: "Hoa khỏe", description: "Tạo nền dinh dưỡng cho giai đoạn thụ phấn và đậu trái." },
    ],
    usageRows: defaultUsage,
    reasons: baseReasons,
    isFeatured: true,
    isActive: true,
    images: [],
    relatedSlugs: ["cal-max-8000", "fruit-max-npk-8000"],
    seoTitle: "Flower Max 8000 - Kích hoa đồng loạt",
    seoDescription: "Flower Max 8000 hỗ trợ kích hoa, ra hoa đồng loạt và tăng đậu trái.",
  },
  {
    id: "prod-cal",
    categoryId: "cat-flower",
    name: "Cal Max 8000 - Cứng Cuống, Chống Rụng Hoa, Nứt Trái Và Méo Trái",
    slug: "cal-max-8000",
    sku: "CAL-500G",
    price: 319000,
    origin: "Việt Nam",
    shelfLife: "24 tháng",
    shortDescription:
      "Giàu Canxi 7% và Bo 20.000 ppm, giúp cứng cuống, tăng đậu trái, hạn chế rụng, nứt và méo trái.",
    description:
      "Cal Max 8000 là dòng phân bón trung lượng chuyên cho giai đoạn ra hoa và đậu trái, giúp gia cố cuống trái chắc khỏe, hạn chế nứt trái, méo trái và tăng độ ngọt tự nhiên.",
    specs: [
      { label: "Tên sản phẩm", value: "Cal Max 8000" },
      { label: "Dạng", value: "Lỏng" },
      { label: "Khối lượng tịnh", value: "500g" },
      { label: "Thành phần chính", value: "Canxi (Ca) 7%; Bo (B) 20.000 ppm" },
      { label: "Chỉ số hỗ trợ", value: "pH H2O: 4; Tỷ trọng: 1,2" },
      { label: "Công dụng chính", value: "Chống rụng hoa, nứt trái, méo trái" },
      { label: "Đối tượng sử dụng", value: "Cây lương thực, cây ăn trái, cây công nghiệp, rau màu và hoa kiểng" },
    ],
    benefits: [
      { title: "Đậu trái và chống rụng", description: "Tăng sức sống hạt phấn, giúp cuống trái chắc khỏe và hạn chế rụng trái non." },
      { title: "Lớn trái và đẹp màu", description: "Hỗ trợ trái phát triển cân đối, bóng đẹp, giảm nứt và méo trái." },
      { title: "Tăng độ ngọt và bảo quản", description: "Hỗ trợ tích lũy đường, cải thiện độ cứng trái và thời gian tươi sau thu hoạch." },
    ],
    usageRows: [
      { crop: "Cây lương thực", dosage: "1 hũ 500g cho 350-500 m2", timing: "Bón lót hoặc bón thúc tùy giai đoạn cây trồng." },
      { crop: "Cây ăn trái, cây công nghiệp", dosage: "1 hũ 500g cho 250-350 m2", timing: "Bón định kỳ 2-3 lần/năm vào đầu, giữa và cuối mùa mưa." },
      { crop: "Rau màu, hoa kiểng", dosage: "1 hũ 500g cho 350-500 m2", timing: "Bón định kỳ cách nhau 10-15 ngày/lần." },
    ],
    reasons: [
      "Bo 20.000 ppm hỗ trợ quá trình thụ phấn và hạn chế rụng hoa, rụng trái.",
      "Dạng lỏng giúp cây tiếp nhận Canxi và Bo nhanh qua lá và cuống trái.",
      "Không chỉ chống nứt méo mà còn hỗ trợ độ ngọt và mẫu mã thương phẩm.",
    ],
    note: "Sản phẩm là phân bón lá hỗn hợp PK VINAF 07.",
    isFeatured: true,
    isActive: true,
    images: [],
    relatedSlugs: ["flower-max-8000", "fruit-max-npk-8000"],
    seoTitle: "Cal Max 8000 - Cứng cuống, chống rụng và nứt trái",
    seoDescription: "Cal Max 8000 giàu Canxi và Bo, giúp cứng cuống, chống rụng hoa, nứt trái và méo trái.",
  },
];

export const posts: Post[] = [
  {
    id: "post-1",
    title: "Cách nhận biết cây đang yếu rễ và cần phục hồi",
    slug: "cach-nhan-biet-cay-yeu-re",
    excerpt: "Một số dấu hiệu như lá vàng, đọt chậm, rễ ít tơ thường báo hiệu cây cần được phục hồi đúng nhịp.",
    content:
      "Khi cây hấp thu kém, biểu hiện thường thấy là lá mỏng, đọt ra chậm, bộ rễ ít rễ tơ và cây phản ứng mạnh với thời tiết. Nhà vườn nên kiểm tra nền đất, lịch tưới và chọn nhóm sản phẩm phục hồi rễ trước khi thúc mạnh thân lá.",
    status: "published",
    publishedAt: "2026-05-01",
  },
  {
    id: "post-2",
    title: "Giai đoạn nào nên tập trung nuôi trái?",
    slug: "giai-doan-nao-nen-tap-trung-nuoi-trai",
    excerpt: "Nuôi trái cần đúng thời điểm để trái lớn đều, đẹp mẫu và hạn chế hao cây cuối vụ.",
    content:
      "Sau khi trái non hình thành ổn định, cây cần nguồn dinh dưỡng hướng mạnh về trái. Giai đoạn này nên cân đối Kali, Canxi, Bo và theo dõi sức lá để tránh ép cây quá mức.",
    status: "published",
    publishedAt: "2026-05-02",
  },
];

export function getActiveProducts() {
  return products.filter((product) => product.isActive);
}

export function getProductBySlug(slug: string) {
  return getActiveProducts().find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug && category.isActive);
}

export function getProductsByCategorySlug(slug: string) {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return getActiveProducts().filter((product) => product.categoryId === category.id);
}

export function getRelatedProducts(product: Product) {
  return product.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((item): item is Product => Boolean(item));
}
