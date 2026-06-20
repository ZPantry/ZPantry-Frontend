import { testimonials } from "../../data/landingContent";

export function TestimonialsSection() {
  return (
    <section className="testimonials section-pad" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="section-heading reveal">
          <span className="eyebrow">Được người nấu ăn tin dùng</span>
          <h2 id="testimonials-title">Được yêu thích bởi sinh viên bận rộn và người nấu ăn tại nhà</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial glass reveal" key={testimonial.name}>
              <img src={testimonial.image} alt={testimonial.alt} />
              <div className="stars" aria-label="Đánh giá 5 sao">
                ★★★★★
              </div>
              <p>“{testimonial.review}”</p>
              <h3>{testimonial.name}</h3>
              <span>{testimonial.role}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
