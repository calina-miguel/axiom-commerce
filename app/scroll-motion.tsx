"use client";

import { useEffect } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function ScrollMotion() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const root = document.querySelector<HTMLElement>(".marketing");
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-motion]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      const mobile = window.innerWidth < 650;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const enter = clamp((height * 0.93 - rect.top) / (height * 0.52));
        const leave = clamp((rect.bottom - height * 0.09) / (height * 0.34));
        const progress = Math.min(enter, leave);
        const eased = 1 - Math.pow(1 - progress, 3);
        const direction = item.dataset.scrollMotion === "left" ? -1 : item.dataset.scrollMotion === "right" ? 1 : 0;
        const distance = mobile ? 42 : 78;
        item.style.setProperty("--scroll-x", `${(1 - eased) * distance * direction}px`);
        item.style.setProperty("--scroll-y", `${(1 - eased) * (direction ? 18 : distance)}px`);
        item.style.setProperty("--scroll-opacity", `${Math.max(0.08, eased)}`);
        item.style.setProperty("--scroll-scale", `${0.88 + eased * 0.12}`);
      }
      const feature = root.querySelector<HTMLElement>(".feature-section");
      if (feature) {
        const bounds = feature.getBoundingClientRect();
        const total = Math.max(1, bounds.height - height);
        feature.style.setProperty("--section-progress", `${clamp(-bounds.top / total)}`);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    root.classList.add("scroll-motion-ready");
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("scroll-motion-ready");
    };
  }, []);

  return null;
}
