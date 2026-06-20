import { ChefHat, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const foodImages = [
  {
    src: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=700&q=80",
    label: "Phở bò"
  },
  {
    src: "https://gastrofun.net/wp-content/uploads/2025/06/Banh-mi-1-2048x1152.jpeg",
    label: "Bánh mì"
  },
  {
    src: "https://i1-giadinh.vnecdn.net/2023/09/16/Buoc-4-Thanh-pham-1-1-1411-1694856861.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=nYLgavSGbDEeMyiUX5o8Cw",
    label: "Cá kho tộ"
  },
  {
    src: "https://i1-giadinh.vnecdn.net/2025/12/09/Goi-cuon-tom-thit-6-vnexpress-5204-4845-1765272698.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=NicT2wFPIXdI3MQZnXvExQ",
    label: "Gỏi cuốn"
  },
  {
    src: "https://i1-giadinh.vnecdn.net/2021/03/19/ca2-1616122035-2163-1616122469.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=8PTOflZJZdwzP68MSUhLhg",
    label: "Canh chua"
  }
];

export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="auth-page relative grid min-h-screen overflow-hidden px-4 py-3">
      <div className="auth-page-bg" aria-hidden="true" />

      <Link to="/" className="relative z-10 mx-auto mb-3 flex w-fit items-center gap-3 font-heading text-base font-black">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-orange-500 text-white">
          <ChefHat size={19} />
        </span>
        Z-Pantry
      </Link>

      <section className="auth-card relative z-10 mx-auto grid w-full max-w-[900px] overflow-hidden rounded-[24px] border border-white/75 bg-white/88 shadow-xl shadow-orange-200/70 backdrop-blur-xl lg:grid-cols-[0.82fr_1fr]">
        <aside className="auth-visual hidden bg-[#24170f] p-4 text-white lg:block">
          <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/12 bg-[linear-gradient(145deg,rgba(249,115,22,.24),rgba(22,163,74,.18))] p-5">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-orange-100">
                <Sparkles size={13} />
                Bếp Việt thông minh
              </span>
              <h1 className="mt-4 max-w-md font-heading text-[24px] font-black leading-tight">
                Lên thực đơn từ nguyên liệu có sẵn.
              </h1>
              <p className="mt-2 max-w-sm text-xs leading-5 text-white/72">
                Gợi ý món ăn gần gũi, quản lý tủ bếp rõ ràng và giảm lãng phí mỗi ngày.
              </p>
            </div>

            <div className="auth-food-grid my-4 grid grid-cols-2 gap-2">
              {foodImages.map((image, index) => (
                <figure className={`auth-dish-card ${index === 0 ? "row-span-2" : ""}`} key={image.label}>
                  <img src={image.src} alt="" />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-black">
              <span className="rounded-2xl bg-white/12 px-2 py-2 backdrop-blur">Ít lãng phí</span>
              <span className="rounded-2xl bg-white/12 px-2 py-2 backdrop-blur">Nấu nhanh</span>
              <span className="rounded-2xl bg-white/12 px-2 py-2 backdrop-blur">Hợp vị</span>
            </div>
          </div>
        </aside>

        <div className="auth-form-panel relative overflow-hidden p-5 sm:p-6">
          <div className="auth-form-bg" aria-hidden="true" />
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-orange-500">Chào mừng đến Z-Pantry</p>
            <h2 className="mt-2 font-heading text-2xl font-black leading-tight text-slate-950 sm:text-[28px]">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-5 text-slate-600">{subtitle}</p>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
