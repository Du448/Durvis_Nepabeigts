"use client";

import { useEffect, useRef } from "react";

/* Staggered reveal for grid children. Uses IntersectionObserver plus a plain
   CSS transition — the reference site fades content in the same understated
   way, and this keeps items visible if observation never fires. */

export default function RevealGrid({
  children,
  className = "",
  revealKey = "",
  y = 24,
  stagger = 0.07,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children);
    if (!items.length) return;

    const reveal = (node, delay = 0) => {
      node.style.transitionDelay = `${delay}s`;
      node.style.opacity = "1";
      node.style.transform = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((node) => reveal(node));
      return;
    }

    items.forEach((node) => {
      node.style.opacity = "0";
      node.style.transform = `translateY(${y}px)`;
      node.style.transition = "opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1)";
      node.style.willChange = "opacity, transform";
    });

    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting && !seen.has(e.target));
        entering.forEach((entry, i) => {
          seen.add(entry.target);
          reveal(entry.target, i * stagger);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
    );

    items.forEach((node) => observer.observe(node));

    // Safety net: never leave content invisible if the observer misfires.
    const fallback = setTimeout(() => {
      items.forEach((node) => {
        if (node.style.opacity !== "1") reveal(node);
      });
    }, 2500);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
      items.forEach((node) => {
        node.style.willChange = "";
      });
    };
  }, [revealKey, y, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
