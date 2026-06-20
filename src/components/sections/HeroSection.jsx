import { heroStats } from "../../data/landingContent";
import { images } from "../../data/images";
import { HeroVisual } from "../mockups/HeroVisual";
import { AppLink } from "../ui/AppLink";

export function HeroSection() {
  return (
    <section className="hero section-pad" id="top" aria-labelledby="hero-title">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <img className="hero-bg" src={images.heroBg} alt="" />
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">Lập kế hoạch bữa ăn bằng AI</span>
          <h1 id="hero-title">Lên kế hoạch bữa ăn thông minh từ những gì bạn đang có</h1>
          <p>
            Z-Pantry dùng AI để biến nguyên liệu sẵn có thành công thức cá nhân hóa, thực đơn theo tuần và
            danh sách mua sắm thông minh.
          </p>
          <div className="hero-actions">
            <AppLink className="btn btn-primary" to="/#app-preview">
              Bắt đầu lập kế hoạch
            </AppLink>
            <AppLink className="btn btn-secondary" to="/download">
              Tải ứng dụng
            </AppLink>
            <AppLink className="btn btn-secondary" to="/#showcase">
              Xem trải nghiệm
            </AppLink>
          </div>
          <div className="trust-stats" aria-label="Số liệu nổi bật của Z-Pantry">
            {heroStats.map((stat) => (
              <span key={stat.label}>
                <strong>{stat.value}</strong> {stat.label}
              </span>
            ))}
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
