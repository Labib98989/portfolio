"use client";

import { useEffect, useState } from "react";

// Hook returns whether the given media query currently matches. SSR-safe:
// first paint always returns the `ssrFallback` value, then the real match
// resolves after mount. This means desktop and mobile both render the
// fallback HTML on the server; the client swaps in the correct layout on
// hydration. Pick the fallback that matches the more common visitor — we
// pass desktop=true so search engines and link-preview crawlers see the
// desktop site (it's the richer surface).
export function useMediaQuery(query: string, ssrFallback = false): boolean {
  const [matches, setMatches] = useState(ssrFallback);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

// Single breakpoint for the whole site. Below this width = mobile layout.
// 768px is the conventional tablet/phone boundary; iPad portrait sits at
// 768 exactly and gets the desktop layout, which is fine because the
// desktop stage scales down comfortably to that width.
export const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`, false);
}
