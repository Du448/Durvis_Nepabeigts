"use client";

import { createContext, useContext, useMemo } from "react";

/* Client-side counterpart of @/lib/i18n-data: instead of shipping every
   catalogue translation to the browser, each page passes the handful its
   components will look up (built on the server with buildDict). Anything not
   in the dictionary renders as the Latvian source, exactly like trData. */

const DictContext = createContext({ t: {}, c: {} });

export function DictProvider({ dict, children }) {
  return <DictContext value={dict || { t: {}, c: {} }}>{children}</DictContext>;
}

export function useTr() {
  const dict = useContext(DictContext);
  return useMemo(() => {
    const tr = (value) => (typeof value === "string" ? (dict.t?.[value] ?? value) : value);
    const trColor = (value) => dict.c?.[value] ?? dict.t?.[value] ?? String(value);
    return {
      tr,
      trColor,
      // Same signatures as @/lib/i18n-data; the locale is already baked into the dictionary.
      trData: (_locale, value) => tr(value),
      trRow: (_locale, row) => [tr(row?.[0]), tr(row?.[1])],
      translateColorLabel: (_locale, value) => trColor(value),
    };
  }, [dict]);
}
