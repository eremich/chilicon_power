import { useEffect, useRef, useState } from 'react';

/** Nearest ancestor that scrolls vertically, so headers work in the app and in Storybook */
export const scrollParent = (el: HTMLElement | null): HTMLElement | null => {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const oy = getComputedStyle(n).overflowY;
    if (oy === 'auto' || oy === 'scroll') return n;
  }
  return null;
};

/**
 * True once the referenced element has scrolled under the top `offset` px of its scroll container.
 * Drives the iOS nav bar: large title gone → compact title and blurred bar appear.
 */
export const useScrolledPast = <T extends HTMLElement>(offset: number) => {
  const ref = useRef<T>(null);
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), { root: scrollParent(el), rootMargin: `-${offset}px 0px 0px 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [offset]);
  return [ref, past] as const;
};
