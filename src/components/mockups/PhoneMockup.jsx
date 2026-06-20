import { images } from "../../data/images";

export function PhoneMockup({ compact = false }) {
  return (
    <div className={`phone-mockup${compact ? " compact-phone" : ""}`} data-depth={compact ? undefined : "0.06"}>
      <div className="phone-top" />
      <div className="phone-screen">
        <div className="screen-header">
          <span>{compact ? "Sẵn sàng nấu" : "Kế hoạch hôm nay"}</span>
          <strong>AI</strong>
        </div>
        <div className="meal-card">
          <img src={compact ? images.nutrition : images.quinoa} alt="Món ăn được AI đề xuất" />
          <div>
            <span>{compact ? "Tối nay" : "Công thức AI đề xuất"}</span>
            <h3>{compact ? "Bowl tận dụng tủ bếp" : "Bowl quinoa thảo mộc"}</h3>
            <p>{compact ? "Sẵn sàng trong 22 phút" : "Dùng rau bina, cà chua, bơ"}</p>
          </div>
        </div>

        {!compact && (
          <div className="metric-row">
            <div>
              <strong>520</strong>
              <span>Calo</span>
            </div>
            <div>
              <strong>12</strong>
              <span>Nguyên liệu</span>
            </div>
            <div>
              <strong>18g</strong>
              <span>Protein</span>
            </div>
          </div>
        )}

        <div className="screen-panel">
          <div className="panel-title">{compact ? "Bao gồm trong ứng dụng" : "Nguyên liệu đã dùng"}</div>
          {(compact
            ? ["Công thức AI", "Thực đơn tuần", "Danh sách mua", "Theo dõi lãng phí"]
            : ["Cà chua", "Rau bina", "Đậu gà", "Thảo mộc"]
          ).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="shopping-widget">
          <div>
            <small>{compact ? "Thực đơn tuần" : "Danh sách mua sắm"}</small>
            <strong>{compact ? "Tạo tức thì" : "Còn thiếu 4 món"}</strong>
          </div>
          <button type="button">{compact ? "AI" : "Xem"}</button>
        </div>
      </div>
    </div>
  );
}
