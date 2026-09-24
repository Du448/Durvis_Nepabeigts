"use client";

import { useMemo, useSyncExternalStore } from "react";

/* The query string, read without next/navigation's useSearchParams. In a
   statically generated page useSearchParams switches everything under the
   nearest Suspense boundary to browser-only rendering, which would leave the
   catalogue grid (or the contact details) out of the HTML search engines get.
   Here the server and the first client render see an empty query - the
   unfiltered page - and the real one is applied right after hydration.

   Call replaceSearch() instead of history.replaceState so subscribers update. */

const EVENT = "url-search-change";

function subscribe(cb) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useUrlSearchParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function replaceSearch(url) {
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(EVENT));
}
