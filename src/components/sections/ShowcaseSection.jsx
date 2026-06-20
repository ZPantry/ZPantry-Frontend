import { images } from "../../data/images";

export function ShowcaseSection() {
  return (
    <section className="food-showcase" id="showcase" aria-labelledby="showcase-title">
      <img
        className="showcase-bg parallax-layer"
        data-speed="0.08"
        src={images.showcaseBg}
        alt="Bàn ăn với nhiều món lành mạnh đầy màu sắc"
      />
      <img
        className="showcase-float float-one parallax-layer"
        data-speed="0.22"
        src={images.strawberries}
        alt="Dâu tây tươi"
      />
      <img
        className="showcase-float float-two parallax-layer"
        data-speed="-0.16"
        src={images.herbs}
        alt="Rau thơm và rau xanh tươi"
      />
      <img
        className="showcase-float float-three parallax-layer"
        data-speed="0.18"
        src={images.mealBowl}
        alt="Bowl bữa ăn đã chuẩn bị"
      />
      <div className="showcase-copy reveal">
        <h2 id="showcase-title">Nguyên liệu tươi. Lựa chọn thông minh. Ít lãng phí hơn.</h2>
        <p>Z-Pantry kết nối những gì đang có trong bếp với bữa ăn bạn muốn nấu tiếp theo.</p>
      </div>
    </section>
  );
}
