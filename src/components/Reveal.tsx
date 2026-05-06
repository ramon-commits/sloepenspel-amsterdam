"use client";

import { useEffect, useRef, ReactNode, CSSProperties, ElementType } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Render as a different tag, e.g. "li" inside <ul>/<ol> for valid a11y. Defaults to "div". */
  as?: ElementType;
};

/**
 * Fades + slides up by 20px when scrolled into view.
 * Pass `delay` in ms for stagger.
 * Honors prefers-reduced-motion via globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  style = {},
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
