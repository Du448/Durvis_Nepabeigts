"use client";

import { useEffect, useRef } from "react";

/* Staggered reveal for grid children. Uses IntersectionObserver plus a plain
   CSS transition - the reference site fades content in the same understated
   way, and this keeps items visible if observation never fires.

   Kept short (0.35s, 12px, stagger capped at 0.2s) so a scroll never waits on
   the animation. Children that have already been revealed stay put when the
   list changes - filtering or "show more" only animates the new cards. With
   prefers-reduced-motion nothing moves at all. */

const DURATION = 0.35;
const MAX_DELAY = 0.2;

export default function RevealGrid({
  children,
  className = "",
  revealKey = "",
  y = 12,
  stagger = 0.04,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const revealed = useRef(new WeakSet());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const done = revealed.current;
    const items = Array.from(el.children).filter((node) => !done.has(node));
    if (!items.length) return;

    const reveal = (node, delay = 0) => {
      done.add(node);
      node.style.transitionDelay = `${delay}s`;
      node.style.opacity = "1";
      node.style.transform = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((node) => done.add(node));
      return;
    }

    items.forEach((node) => {
      node.style.opacity = "0";
      node.style.transform = `translateY(${y}px)`;
      node.style.transition = `opacity ${DURATION}s ease-out, transform ${DURATION}s ease-out`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting && !done.has(e.target))
          .forEach((entry, i) => {
            reveal(entry.target, Math.min(i * stagger, MAX_DELAY));
            observer.unobserve(entry.target);
          });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
    );

    items.forEach((node) => observer.observe(node));

    // Safety net: never leave content invisible if the observer misfires.
    const fallback = setTimeout(() => {
      items.forEach((node) => {
        if (!done.has(node)) reveal(node);
      });
    }, 1500);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [revealKey, y, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
