import { DashboardMockup } from "../mockups/DashboardMockup";

export function AppPreviewSection() {
  return (
    <section className="app-preview section-pad" id="app-preview" aria-labelledby="preview-title">
      <div className="container">
        <div className="section-heading reveal">
          <span className="eyebrow">Xem trước ứng dụng</span>
          <h2 id="preview-title">Thiết kế cho việc nấu ăn hằng ngày</h2>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}
