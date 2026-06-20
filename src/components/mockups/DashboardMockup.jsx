import { images } from "../../data/images";

const plannerRows = [
  ["T2", "T3", "T4", "T5", "T6"],
  ["Bánh mì", "Yến mạch", "Trứng", "Bowl", "Cuốn"],
  ["Súp", "Salad", "Mì Ý", "Cơm", "Taco"],
  ["Cá", "Cà ri", "Xào", "Hầm", "Pizza"]
];

export function DashboardMockup() {
  return (
    <div className="dashboard-wrap reveal parallax-layer" data-speed="0.04">
      <div className="dashboard glass">
        <div className="dash-top">
          <div>
            <span>Lịch ăn theo tuần</span>
            <h3>Luồng bữa ăn tháng 6</h3>
          </div>
          <button type="button">Tạo mới</button>
        </div>
        <div className="dash-grid">
          <div className="planner panel">
            {plannerRows.map((row, index) => (
              <div key={row.join("-")} className={`planner-row${index === 0 ? " header" : ""}`}>
                {row.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="recommend panel">
            <img src={images.pizza} alt="Công thức bữa tối được đề xuất" />
            <div>
              <span>Gợi ý nổi bật</span>
              <h3>Pizza naan rau củ</h3>
              <p>Sẵn sàng trong 18 phút</p>
            </div>
          </div>

          <div className="nutrition panel">
            <h3>Dinh dưỡng</h3>
            <div className="rings">
              <span style={{ "--pct": "78%" }}>Protein</span>
              <span style={{ "--pct": "64%" }}>Tinh bột</span>
              <span style={{ "--pct": "52%" }}>Chất béo</span>
            </div>
          </div>

          <div className="inventory panel">
            <h3>Kho nguyên liệu</h3>
            <p>Đang theo dõi 42 món</p>
            <div className="chips">
              {["Gạo", "Trứng", "Rau bina", "Cà chua"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="expiring panel">
            <h3>Sắp hết hạn</h3>
            <ul>
              <li>
                Rau bina <strong>1 ngày</strong>
              </li>
              <li>
                Sữa chua Hy Lạp <strong>2 ngày</strong>
              </li>
              <li>
                Húng quế <strong>3 ngày</strong>
              </li>
            </ul>
          </div>

          <div className="shopping panel">
            <h3>Danh sách mua</h3>
            <label>
              <input type="checkbox" defaultChecked /> Chanh vàng
            </label>
            <label>
              <input type="checkbox" /> Phô mai feta
            </label>
            <label>
              <input type="checkbox" /> Bánh cuốn ngũ cốc
            </label>
          </div>
        </div>
      </div>
      <div className="mini-card mini-left glass">
        Giảm lãng phí tuần này <strong>24$</strong>
      </div>
      <div className="mini-card mini-right glass">
        Chất lượng kế hoạch <strong>94%</strong>
      </div>
    </div>
  );
}
