import { features } from "../../data/landingContent";

export function FeaturesSection() {
  return (
    <section className="features section-pad" id="features" aria-labelledby="features-title">
      <div className="container">
        <div className="section-heading reveal">
          <span className="eyebrow">Dành cho căn bếp thật</span>
          <h2 id="features-title">Mọi thứ bạn cần để lên kế hoạch bữa ăn tốt hơn</h2>
        </div>
        <div className="feature-grid reveal-stagger">
          {features.map((feature) => (
            <article className="feature-card tilt-card reveal" key={feature.title}>
              <img src={feature.image} alt={feature.alt} />
              <span>{feature.badge}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
