import { images } from "../../data/images";
import { AppLink } from "../ui/AppLink";

export function FinalCtaSection() {
  return (
    <section className="final-cta" id="contact" aria-labelledby="cta-title">
      <img src={images.cta} alt="" />
      <div className="cta-overlay" />
      <img className="cta-float cta-one" src={images.tomato} alt="Cà chua tươi" />
      <img className="cta-float cta-two" src={images.potatoes} alt="Khoai tây" />
      <div className="container reveal">
        <h2 id="cta-title">Sẵn sàng nấu thông minh hơn với AI?</h2>
        <p>Dùng nguyên liệu tốt hơn, tiết kiệm tiền và tạo những bữa ăn ngon với Z-Pantry.</p>
        <div className="hero-actions">
          <AppLink className="btn btn-light" to="/#app-preview">
            Bắt đầu
          </AppLink>
          <AppLink className="btn btn-light" to="/download">
            Tải ứng dụng
          </AppLink>
          <AppLink className="btn btn-outline-light" to="/#features">
            Khám phá tính năng
          </AppLink>
        </div>
      </div>
    </section>
  );
}
