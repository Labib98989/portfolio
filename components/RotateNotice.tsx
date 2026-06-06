// Global landscape guard. There's no reliable way to hardware-lock orientation
// on the web — iOS Safari ignores the Screen Orientation API, and Android only
// honours it in fullscreen/installed-PWA mode — so instead we gate landscape
// behind this overlay. The site is a portrait experience; a phone held sideways
// gets a tasteful "rotate" prompt instead of a broken layout.
//
// It's CSS-only (shown via a media query: landscape + short viewport + coarse
// pointer), so it works no matter which tree is mounted underneath — the mobile
// deck on narrow phones, or the desktop stage on wide phones whose landscape
// width jumps past the mobile breakpoint. Laptops and tablets (tall viewports)
// never trigger it. See `.rotate-notice` in globals.css.
export function RotateNotice() {
  return (
    <div className="rotate-notice" aria-hidden>
      <div className="rotate-notice__inner">
        <svg
          viewBox="0 0 80 80"
          width="72"
          height="72"
          fill="none"
          stroke="#D9A89C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* phone, upright */}
          <rect x="31" y="22" width="18" height="38" rx="4" />
          <line x1="36" y1="55" x2="44" y2="55" />
          {/* rotation arrow arcing up toward portrait */}
          <path d="M20 32 A 24 24 0 0 1 40 14" />
          <polyline points="20 21 20 32 31 32" />
        </svg>
        <p className="rotate-notice__title">Turn me upright</p>
        <p className="rotate-notice__sub">Built for portrait</p>
      </div>
    </div>
  );
}
