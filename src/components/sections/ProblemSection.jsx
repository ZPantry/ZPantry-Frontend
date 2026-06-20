import { problemCards } from "../../data/landingContent";
import { images } from "../../data/images";

export function ProblemSection() {
  return (
    <section className="problem section-pad" aria-labelledby="problem-title">
      <div className="container">
        <div className="section-heading reveal">
          <span className="eyebrow">Nút thắt mỗi ngày</span>
          <h2 id="problem-title">Lên kế hoạch bữa ăn khó hơn bạn nghĩ</h2>
        </div>
        <div className="problem-layout">
          <div className="problem-copy reveal">
            <p>
              Hầu hết căn bếp đã có sẵn điểm bắt đầu cho một bữa ăn ngon. Khó nhất là ghép nguyên liệu,
              thời gian, dinh dưỡng và thói quen mua sắm trước khi thực phẩm âm thầm hết hạn.
            </p>
            <div className="problem-cards">
              {problemCards.map((card) => (
                <article className="image-card" key={card.title}>
                  <img src={card.image} alt={card.alt} />
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="fridge-shot reveal">
            <img src={images.fridge} alt="Tủ lạnh mở với nhiều nguyên liệu tươi" />
            <div className="fridge-badge">Sắp hết hạn: rau bina, sữa chua, thảo mộc</div>
          </div>
        </div>
      </div>
    </section>
  );
}
