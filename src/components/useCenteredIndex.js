"use client";
import { useEffect, useRef, useState } from "react";

export function useCenteredIndex({
  itemSelector = ".snap-item",
  depsKey, // e.g. `${isMobile}-${sets.length}`
} = {}) {
  const ref = useRef(null);               // attach to the scroller (.sets-grid)
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;

    let raf = 0;

    const measure = () => {
      const items = scroller.querySelectorAll(itemSelector);
      if (!items.length) return;

      const scRect = scroller.getBoundingClientRect();
      const scCenterX = scRect.left + scRect.width / 2;

      let bestIdx = 0;
      let best = Infinity;

      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const midX = r.left + r.width / 2;
        const d = Math.abs(midX - scCenterX);
        if (d < best) { best = d; bestIdx = i; }
      });

      setCenterIndex(bestIdx);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    // initial
    measure();

    // scroll updates
    scroller.addEventListener("scroll", onScroll, { passive: true });

    // size/layout changes
    const ro = new ResizeObserver(() => measure());
    ro.observe(scroller);

    // DOM mutations (items added/removed, ul swapped on mobile/desktop)
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    mo.observe(scroller, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, [itemSelector, depsKey]); // no spread; ESLint-friendly

  return { ref, centerIndex };
}
