"use client";

import { useEffect, useRef, ReactNode, ElementType } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  mode?: "reveal" | "reveal-scale";
  delay?: number; // extra delay in ms on top of stagger class
  stagger?: number; // 1-8, applies .stagger-N class
  threshold?: number;
  tag?: ElementType;
}

export default function AnimateOnScroll({
  children,
  className = "",
  mode = "reveal",
  stagger,
  threshold = 0.12,
  tag: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const staggerClass = stagger ? `stagger-${stagger}` : "";

  return (
    <Tag ref={ref} className={`${mode} ${staggerClass} ${className}`}>
      {children}
    </Tag>
  );
}
