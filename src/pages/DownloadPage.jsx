import { PhoneMockup } from "../components/mockups/PhoneMockup";
import { AppLink } from "../components/ui/AppLink";
import { images } from "../data/images";
import { platformLinks } from "../data/landingContent";
import { useLandingEffects } from "../hooks/useLandingEffects";

const installSteps = [
  {
    number: "01",
    title: "Chọn nền tảng phù hợp",
    description: "Mở App Store, Google Play hoặc bản demo web tùy thiết bị bạn đang sử dụng."
  },
  {
    number: "02",
    title: "Kết nối tủ bếp của bạn",
    description: "Thêm nhanh nguyên liệu, hạn dùng, khẩu vị và mục tiêu dinh dưỡng cho tuần mới."
  },
  {
    number: "03",
    title: "Nhận kế hoạch từ AI",
    description: "Z-Pantry gợi ý công thức, thực đơn tuần và danh sách mua sắm còn thiếu."
  }
];

const downloadNotes = [
  "Liên kết store hiện là trang nền tảng chính thức để bạn thay URL thật khi ứng dụng phát hành.",
  "Bản demo web dẫn về khu vực xem trước trong landing page để kiểm tra trải nghiệm ngay.",
  "Tất cả nội dung dùng font Be Vietnam Pro và giữ cùng hệ màu với trang chính."
];

export function DownloadPage() {
  document.title = "Tải Z-Pantry | Trợ lý lập kế hoạch bữa ăn bằng AI";
  useLandingEffects("download");

  return (
    <main className="download-page">
      <section className="download-hero section-pad" aria-labelledby="download-title">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <img className="hero-bg" src={images.kitchen} alt="" />
        <div className="container download-grid">
          <div className="download-copy reveal">
            <span className="eyebrow">Tải Z-Pantry</span>
            <h1 id="download-title">Bắt đầu lập kế hoạch bữa ăn ngay trên điện thoại</h1>
            <p>
              Tải Z-Pantry cho di động hoặc mở trải nghiệm web để khám phá lập kế hoạch công thức bằng AI,
              theo dõi tủ bếp và danh sách mua sắm thông minh.
            </p>
            <div className="hero-actions">
              <AppLink className="btn btn-primary" to="/download#download-options">
                Chọn nền tảng
              </AppLink>
              <AppLink className="btn btn-secondary" to="/#app-preview">
                Xem demo
              </AppLink>
            </div>
          </div>

          <div className="download-phone reveal" aria-label="Xem trước ứng dụng Z-Pantry">
            <PhoneMockup compact />
          </div>
        </div>
      </section>

      <section className="download-options section-pad" id="download-options" aria-labelledby="options-title">
        <div className="container">
          <div className="section-heading reveal">
            <span className="eyebrow">Chọn nền tảng</span>
            <h2 id="options-title">Tải hoặc mở Z-Pantry</h2>
            <p>
              Các nút bên dưới là điểm liên kết tải ứng dụng. Khi có trang chính thức trên store, chỉ cần thay
              URL trong file data.
            </p>
          </div>

          <div className="download-card-grid">
            {platformLinks.map((item) => (
              <article className="download-card reveal" key={item.title}>
                <span className="platform-icon">{item.platform}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <AppLink className={item.external ? "btn btn-primary" : "btn btn-secondary"} to={item.href} external={item.external}>
                  {item.cta}
                </AppLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="download-guide section-pad" aria-labelledby="guide-title">
        <div className="container download-guide-grid">
          <div className="section-heading align-left reveal">
            <span className="eyebrow">Cài đặt nhanh</span>
            <h2 id="guide-title">Từ tải ứng dụng đến bữa ăn đầu tiên</h2>
            <p>
              Luồng tải được thiết kế để người dùng không bị lạc: chọn nền tảng, mở ứng dụng, thêm nguyên liệu và nhận kế hoạch
              cá nhân hóa ngay trong một phiên.
            </p>
          </div>

          <div className="install-steps">
            {installSteps.map((step) => (
              <article className="install-step reveal" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="download-demo section-pad" aria-labelledby="demo-title">
        <div className="container download-demo-grid">
          <div className="download-qr reveal" aria-hidden="true">
            <div className="qr-grid">
              {Array.from({ length: 49 }).map((_, index) => (
                <span key={index} className={index % 3 === 0 || index % 8 === 0 || [2, 5, 14, 28, 42].includes(index) ? "active" : ""} />
              ))}
            </div>
            <p>QR demo</p>
          </div>

          <div className="download-demo-copy reveal">
            <span className="eyebrow">Demo web</span>
            <h2 id="demo-title">Chưa có app thật vẫn xem được trải nghiệm</h2>
            <p>
              Trong giai đoạn landing page, người dùng có thể bấm bản demo để xem mockup dashboard, công thức AI, nguyên liệu đã
              dùng và danh sách mua sắm. Khi có link phát hành, bạn chỉ cần cập nhật dữ liệu nền tảng.
            </p>
            <div className="note-list">
              {downloadNotes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
            <div className="hero-actions">
              <AppLink className="btn btn-primary" to="/#app-preview">
                Mở demo web
              </AppLink>
              <AppLink className="btn btn-secondary" to="/#contact">
                Liên hệ đội ngũ
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
