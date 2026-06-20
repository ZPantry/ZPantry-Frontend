import { images } from "../../data/images";

export function SolutionSection() {
  return (
    <section className="ai-solution section-pad parallax-bg" aria-labelledby="solution-title">
      <img src={images.kitchen} alt="" />
      <div className="container">
        <div className="solution-card glass reveal">
          <span className="ai-pulse" />
          <span className="eyebrow">Gặp trợ lý bếp AI của bạn</span>
          <h2 id="solution-title">Nấu thông minh hơn. Lãng phí ít hơn. Lập kế hoạch bằng AI.</h2>
          <p>
            Bạn nhập nguyên liệu, AI gợi ý công thức, Z-Pantry tạo thực đơn tuần và xây dựng danh sách mua
            sắm chính xác để giảm lãng phí.
          </p>
          <div className="solution-flow">
            {["Thêm nguyên liệu", "Tạo công thức", "Lên thực đơn", "Mua sắm thông minh"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
