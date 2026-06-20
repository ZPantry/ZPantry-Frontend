import { steps } from "../../data/landingContent";

export function HowItWorksSection() {
  return (
    <section className="how section-pad" id="how-it-works" aria-labelledby="how-title">
      <div className="container how-story">
        <div className="how-sticky reveal">
          <span className="eyebrow">Quy trình đơn giản</span>
          <h2 id="how-title">Từ tủ bếp đến bàn ăn trong 3 bước</h2>
          <p>
            Mỗi bước xuất hiện theo nhịp scroll để người dùng dễ hiểu cách Z-Pantry biến nguyên liệu sẵn có
            thành thực đơn thực tế.
          </p>
        </div>
        <div className="timeline reveal-stagger">
          {steps.map((step) => (
            <article className="step reveal" key={step.number}>
              <span className="step-number">{step.number}</span>
              <img src={step.image} alt={step.alt} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
