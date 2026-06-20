import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../data/landingContent";
import { AppLink } from "../ui/AppLink";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header ref={headerRef} className="site-header">
      <nav className="navbar" aria-label="Điều hướng chính">
        <Link className="brand" to="/#top" aria-label="Về trang chủ Z-Pantry">
          <span className="brand-mark" />
          <span>Z-Pantry</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? "Đóng điều hướng" : "Mở điều hướng"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <div className="nav-links">
          {navItems.map((item) => (
            <AppLink key={item.label} to={item.to}>
              {item.label}
            </AppLink>
          ))}
          <AppLink className="nav-cta" to="/login">
            Bắt đầu
          </AppLink>
        </div>
      </nav>
    </header>
  );
}
