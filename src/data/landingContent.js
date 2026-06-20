import { images } from "./images";

export const navItems = [
  { label: "Trang chủ", to: "/#top" },
  { label: "Tính năng", to: "/#features" },
  { label: "Cách hoạt động", to: "/#how-it-works" },
  { label: "Lợi ích", to: "/#benefits" },
  { label: "Tải ứng dụng", to: "/download" },
  { label: "Liên hệ", to: "/#contact" }
];

export const heroStats = [
  { value: "5k+", label: "bữa ăn đã tạo" },
  { value: "30%", label: "giảm lãng phí thực phẩm" },
  { value: "7 ngày", label: "kế hoạch bữa ăn" }
];

export const problemCards = [
  {
    image: images.prep,
    alt: "Chuẩn bị nguyên liệu cho bữa tối",
    title: "Không biết hôm nay nên nấu gì",
    description: "Việc quyết định món ăn mỗi ngày dễ trở thành một áp lực nhỏ nhưng dai dẳng."
  },
  {
    image: images.produce,
    alt: "Rau củ tươi trong căn bếp",
    title: "Nguyên liệu hết hạn trước khi kịp dùng",
    description: "Rau củ, sữa chua và thảo mộc thường bị quên ở phía sau tủ lạnh."
  },
  {
    image: images.grocery,
    alt: "Xe đẩy mua sắm với rau củ",
    title: "Đi chợ dễ mua thừa và lãng phí",
    description: "Thiếu ngữ cảnh về tủ bếp khiến bạn mua trùng hoặc mua nhiều hơn cần thiết."
  }
];

export const features = [
  {
    badge: "Quét",
    image: images.scan,
    alt: "Rau củ tươi sẵn sàng để quét",
    title: "Quét nguyên liệu",
    description: "Thêm nguyên liệu thủ công hoặc quét nhanh để AI hiểu bạn đang có gì trong bếp."
  },
  {
    badge: "AI",
    image: images.recipe,
    alt: "Món ăn lành mạnh đã chuẩn bị",
    title: "Gợi ý công thức bằng AI",
    description: "Nhận công thức cá nhân hóa theo nguyên liệu, khẩu vị, thời gian và mục tiêu dinh dưỡng."
  },
  {
    badge: "Kế hoạch",
    image: images.planner,
    alt: "Lập kế hoạch bữa ăn trên bàn bếp",
    title: "Lập thực đơn theo tuần",
    description: "Tạo thực đơn cân bằng cho cả tuần chỉ trong vài thao tác."
  },
  {
    badge: "Danh sách",
    image: images.shopping,
    alt: "Khu vực rau củ trong siêu thị",
    title: "Danh sách mua sắm thông minh",
    description: "Tự động gom nguyên liệu còn thiếu và tránh mua những món không cần thiết."
  },
  {
    badge: "Dinh dưỡng",
    image: images.nutrition,
    alt: "Đĩa ăn cân bằng dinh dưỡng",
    title: "Tổng quan dinh dưỡng",
    description: "Hiểu rõ calo, protein, tinh bột và độ cân bằng bữa ăn trước khi nấu."
  },
  {
    badge: "Lãng phí",
    image: images.pantry,
    alt: "Nguyên liệu trong lọ ở kệ bếp",
    title: "Theo dõi giảm lãng phí",
    description: "Theo dõi nguyên liệu sắp hết hạn và nhận ý tưởng nấu ăn trước khi thực phẩm bị bỏ phí."
  }
];

export const steps = [
  {
    number: "1",
    image: images.stepIngredients,
    alt: "Nguyên liệu tươi trên bàn",
    title: "Thêm nguyên liệu của bạn",
    description: "Ghi lại đồ khô, thực phẩm trong tủ lạnh, khẩu vị và hạn dùng."
  },
  {
    number: "2",
    image: images.stepCook,
    alt: "Nấu ăn trong căn bếp hiện đại",
    title: "Để AI tạo ý tưởng bữa ăn",
    description: "Nhận gợi ý món ăn phù hợp với thời gian, mục tiêu và nguyên liệu sẵn có."
  },
  {
    number: "3",
    image: images.stepPlate,
    alt: "Nấu món ăn lành mạnh tại nhà",
    title: "Nấu, lên kế hoạch và mua sắm thông minh",
    description: "Xây dựng thực đơn cả tuần và chỉ mua những gì còn thiếu cho kế hoạch."
  }
];

export const benefits = [
  {
    image: images.benefitCook,
    alt: "Nấu ăn tại nhà trong căn bếp ấm áp",
    title: "Tiết kiệm thời gian chọn món",
    description: "Biến nguyên liệu rời rạc thành lựa chọn rõ ràng, rồi lập thực đơn cả tuần nhẹ nhàng hơn."
  },
  {
    image: images.benefitHealth,
    alt: "Rau củ lành mạnh và phần ăn chuẩn bị sẵn",
    title: "Giảm lãng phí và ăn lành mạnh hơn",
    description: "Dùng nguyên liệu trước khi hết hạn, đồng thời cân bằng calo, protein, tinh bột và rau tươi."
  },
  {
    image: images.benefitGroceries,
    alt: "Rau củ tươi trên bàn",
    title: "Chi tiêu ít hơn khi mua sắm",
    description: "Mua theo danh sách thông minh, bổ sung đúng phần còn thiếu thay vì mua lại món đã có."
  }
];

export const testimonials = [
  {
    image: images.avatarMinhAnh,
    alt: "Chân dung Minh Anh",
    name: "Minh Anh",
    role: "Sinh viên đại học",
    review: "Z-Pantry biến chiếc tủ lạnh nhỏ của mình thành kế hoạch bữa tối thật sự. Mình bỏ phí ít đồ ăn hơn hẳn."
  },
  {
    image: images.avatarDaniel,
    alt: "Chân dung Daniel",
    name: "Daniel",
    role: "Lập trình viên bận rộn",
    review: "Sau giờ làm mình chỉ muốn quyết định thật nhanh. Kế hoạch tuần và danh sách mua sắm rất thực tế."
  },
  {
    image: images.avatarLinh,
    alt: "Chân dung Linh",
    name: "Linh",
    role: "Người nấu ăn tại nhà",
    review: "Ứng dụng giúp mình dùng rau thơm và rau củ trước khi hỏng, nhưng công thức vẫn có cảm giác rất riêng."
  }
];

export const platformLinks = [
  {
    platform: "iOS",
    title: "App Store",
    description: "Mở nền tảng App Store để kết nối tới trang tải Z-Pantry cho iPhone và iPad.",
    href: "https://www.apple.com/app-store/",
    cta: "Mở App Store",
    external: true
  },
  {
    platform: "Android",
    title: "Google Play",
    description: "Mở Google Play để liên kết tới trang tải ứng dụng Z-Pantry cho Android.",
    href: "https://play.google.com/store",
    cta: "Mở Google Play",
    external: true
  },
  {
    platform: "Web",
    title: "Bản demo web",
    description: "Xem nhanh dashboard và luồng lập kế hoạch bữa ăn ngay trên website.",
    href: "/#app-preview",
    cta: "Mở bản demo",
    external: false
  }
];
