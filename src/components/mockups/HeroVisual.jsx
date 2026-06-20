import { images } from "../../data/images";
import { PhoneMockup } from "./PhoneMockup";

const floatingItems = [
  { className: "tomato", depth: "0.12", image: images.tomato, alt: "Cà chua tươi" },
  { className: "avocado", depth: "0.16", image: images.avocado, alt: "Nửa quả bơ" },
  { className: "lettuce", depth: "0.1", image: images.lettuce, alt: "Rau xà lách tươi" },
  { className: "bowl", depth: "0.2", image: images.bowl, alt: "Bowl đồ ăn lành mạnh" }
];

const notes = [
  { className: "note-one", depth: "0.18", text: "Công thức AI đã sẵn sàng" },
  { className: "note-two", depth: "0.14", text: "Tiết kiệm 3 nguyên liệu" },
  { className: "note-three", depth: "0.22", text: "Danh sách mua thông minh" }
];

export function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Xem trước trợ lý lập kế hoạch bữa ăn Z-Pantry">
      <div className="visual-stage" data-hero-stage>
        {floatingItems.map((item) => (
          <img
            key={item.className}
            className={`float-img ${item.className}`}
            data-depth={item.depth}
            src={item.image}
            alt={item.alt}
          />
        ))}

        <PhoneMockup />

        {notes.map((note) => (
          <div key={note.className} className={`glass-note ${note.className}`} data-depth={note.depth}>
            {note.text}
          </div>
        ))}
      </div>
    </div>
  );
}
