/* "smooth", unless the visitor asked the system for reduced motion. For
   scrollIntoView / scrollBy, which CSS prefers-reduced-motion rules can't reach. */
export function scrollBehavior() {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
