"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/* One delegated listener instead of wiring every tel:/mailto: link by hand:
   any link added later is counted too. A link can name where it sits with
   data-placement="..."; otherwise the nearest header/footer/main decides. */
function placementOf(link) {
  const tagged = link.closest("[data-placement]");
  if (tagged) return tagged.getAttribute("data-placement");
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  return "page";
}

export default function ClickTracking() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const href = link.getAttribute("href");
      track(href.startsWith("tel:") ? "phone_click" : "email_click", {
        placement: placementOf(link),
        path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
