"use client";

import Home from "@/components/Home";
import { MobileApp } from "@/components/MobileApp";
import { useIsMobile } from "@/lib/useMediaQuery";

// SSR renders the desktop tree (useIsMobile defaults to false). On client
// hydration the hook resolves to the real viewport — if the visitor is on
// a phone, React swaps in the swipe-driven MobileApp after mount. Mobile
// users see a brief flash of the letterboxed desktop layout before the swap;
// that's the cost of avoiding a hydration mismatch and keeping the SSR HTML
// useful for crawlers + link previews.
export default function Page() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileApp /> : <Home />;
}
