import { benefits } from "../../data/landingContent";

export function BenefitsSection() {
  return (
    <section className="benefits section-pad" id="benefits" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section-heading reveal">
          <span className="eyebrow">Giá trị mỗi ngày</span>
          <h2 id="benefits-title">Vì sao Z-Pantry giúp cuộc sống dễ hơn</h2>
        </div>
        {benefits.map((benefit, index) => (
          <div className={`benefit-row${index === 1 ? " reverse" : ""} reveal`} key={benefit.title}>
            <img src={benefit.image} alt={benefit.alt} />
            <div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
