import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const enabled = ["/", "/login", "/register"].includes(location.pathname);

  useEffect(() => {
    if (!enabled) return undefined;

    let frame = 0;

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, location.pathname]);

  if (!enabled) return null;

  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
}
