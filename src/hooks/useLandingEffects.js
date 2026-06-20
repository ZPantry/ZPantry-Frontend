import { useEffect } from "react";

export function useLandingEffects(effectKey) {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    const revealItems = document.querySelectorAll(".reveal");
    const parallaxLayers = document.querySelectorAll(".parallax-layer");
    const heroStage = document.querySelector("[data-hero-stage]");
    const heroDepthItems = document.querySelectorAll("[data-depth]");
    const tiltCards = document.querySelectorAll(".tilt-card");
    const smallScreen = window.matchMedia("(max-width: 760px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let latestScrollY = window.scrollY;
    let ticking = false;
    let parallaxFrame = 0;
    const revealTimers = [];
    const parallaxStates = Array.from(parallaxLayers, (layer) => ({
      current: 0,
      layer,
      target: 0
    }));

    const updateNavbar = () => {
      header?.classList.toggle("scrolled", window.scrollY > 24);
    };

    const updateParallax = () => {
      if (smallScreen.matches || reduceMotion.matches) {
        parallaxLayers.forEach((layer) => {
          layer.style.transform = "";
        });
        return;
      }

      parallaxStates.forEach((state) => {
        const { layer } = state;
        const speed = Number(layer.dataset.speed || 0);
        const rect = layer.getBoundingClientRect();
        const viewportOffset = rect.top - window.innerHeight;

        if (viewportOffset < 220 && rect.bottom > -220) {
          state.target = (latestScrollY - layer.offsetTop) * speed;
        }
      });
    };

    const animateParallax = () => {
      if (smallScreen.matches || reduceMotion.matches) {
        parallaxFrame = 0;
        return;
      }

      let shouldContinue = false;
      parallaxStates.forEach((state) => {
        const delta = state.target - state.current;
        state.current += delta * 0.12;

        if (Math.abs(delta) > 0.2) {
          shouldContinue = true;
        }

        state.layer.style.transform = `translate3d(0, ${state.current.toFixed(2)}px, 0)`;
      });

      if (shouldContinue) {
        parallaxFrame = window.requestAnimationFrame(animateParallax);
      } else {
        parallaxFrame = 0;
      }
    };

    const startParallax = () => {
      if (!parallaxFrame) {
        parallaxFrame = window.requestAnimationFrame(animateParallax);
      }
    };

    const onScroll = () => {
      latestScrollY = window.scrollY;
      updateNavbar();

      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          startParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    const showRevealItem = (item) => {
      if (item.classList.contains("is-visible")) return;

      item.classList.add("is-visible");
      const delay = Number(item.dataset.revealDelay || 0);
      const timer = window.setTimeout(() => {
        item.style.transitionDelay = "";
        item.style.transition =
          "transform 0.46s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.46s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.46s ease, opacity 0.46s ease";
        delete item.dataset.revealDelay;
      }, delay + 960);
      revealTimers.push(timer);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showRevealItem(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    const revealIfInView = (item) => {
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 24 && rect.bottom > 24;

      if (isVisible) {
        showRevealItem(item);
        revealObserver.unobserve(item);
      }
    };

    revealItems.forEach((item, index) => {
      const staggerParent = item.closest(".reveal-stagger, .feature-grid, .problem-cards, .timeline, .testimonial-grid, .download-card-grid");
      const groupItems = staggerParent ? Array.from(staggerParent.querySelectorAll(".reveal")) : [];
      const groupIndex = groupItems.indexOf(item);
      const delay = groupIndex >= 0 ? Math.min(groupIndex, 5) * 110 : Math.min(index % 6, 4) * 70;
      item.dataset.revealDelay = `${delay}`;
      item.style.transitionDelay = `${delay}ms`;
      revealObserver.observe(item);
      window.requestAnimationFrame(() => revealIfInView(item));
    });

    const revealSyncTimer = window.setTimeout(() => {
      revealItems.forEach(revealIfInView);
    }, 180);

    const handleHeroMove = (event) => {
      if (smallScreen.matches || !heroStage) return;

      const rect = heroStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroDepthItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 0.08);
        item.style.setProperty("--mx", `${x * depth * 130}px`);
        item.style.setProperty("--my", `${y * depth * 130}px`);
        item.style.transform = "translate3d(var(--mx), var(--my), 0)";
      });

      const phone = heroStage.querySelector(".phone-mockup");
      if (phone) {
        phone.style.transform = `translate(-50%, -50%) scale(var(--phone-scale, 1)) rotateX(${8 - y * 8}deg) rotateY(${-12 + x * 10}deg) rotateZ(4deg)`;
      }
    };

    const resetHeroMove = () => {
      heroDepthItems.forEach((item) => {
        item.style.transform = "";
      });

      const phone = heroStage?.querySelector(".phone-mockup");
      if (phone) {
        phone.style.transform = "";
      }
    };

    const tiltHandlers = [];
    tiltCards.forEach((card) => {
      const onMove = (event) => {
        if (smallScreen.matches || reduceMotion.matches) return;

        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-10px) scale(1.015)`;
        card.style.boxShadow = "0 34px 82px rgba(88, 52, 23, 0.2)";
      };
      const onLeave = () => {
        card.style.transform = "";
        card.style.boxShadow = "";
        card.style.removeProperty("--glow-x");
        card.style.removeProperty("--glow-y");
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      tiltHandlers.push({ card, onMove, onLeave });
    });

    heroStage?.addEventListener("mousemove", handleHeroMove);
    heroStage?.addEventListener("mouseleave", resetHeroMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateNavbar();
    updateParallax();
    startParallax();
    const parallaxSyncTimer = window.setTimeout(() => {
      latestScrollY = window.scrollY;
      updateParallax();
      startParallax();
    }, 180);

    return () => {
      if (parallaxFrame) {
        window.cancelAnimationFrame(parallaxFrame);
      }
      window.clearTimeout(revealSyncTimer);
      window.clearTimeout(parallaxSyncTimer);
      revealTimers.forEach((timer) => window.clearTimeout(timer));
      revealObserver.disconnect();
      heroStage?.removeEventListener("mousemove", handleHeroMove);
      heroStage?.removeEventListener("mouseleave", resetHeroMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateParallax);
      tiltHandlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [effectKey]);
}
