import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToHash = (hash, behavior = "smooth", attempt = 0) => {
      if (!hash || hash === "#top") {
        window.scrollTo({ top: 0, left: 0, behavior });
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        if (attempt < 8) {
          window.setTimeout(() => scrollToHash(hash, behavior, attempt + 1), 80);
        }
        return;
      }

      const headerOffset = window.matchMedia("(max-width: 760px)").matches ? 104 : 132;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(targetTop, 0), behavior });
    };

    if (!location.hash || location.hash === "#top") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    const timer = window.setTimeout(() => scrollToHash(location.hash), 120);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleRepeatedHash = (event) => {
      const hash = event.detail?.hash;
      const targetHash = hash || location.hash || "#top";

      window.setTimeout(() => {
        if (!targetHash || targetHash === "#top") {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          return;
        }

        const target = document.querySelector(targetHash);
        if (!target) return;

        const headerOffset = window.matchMedia("(max-width: 760px)").matches ? 104 : 132;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
      }, 40);
    };

    window.addEventListener("app:navigate-hash", handleRepeatedHash);
    return () => window.removeEventListener("app:navigate-hash", handleRepeatedHash);
  }, [location.hash]);

  return null;
}
