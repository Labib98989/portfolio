import { DUR, EASE } from "@/lib/motion";

type Props = {
  focused: boolean;
  onClose: () => void;
};

// Focus mode is the chapter-selector view — no per-chapter content lives
// here; the wheel + glyph carry the whole interface. Only chrome that
// stays is the close button and a small exit hint.
export function FocusOverlay({ focused, onClose }: Props) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: "absolute",
          top: 24,
          right: 96,
          zIndex: 12,
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: `1px solid color-mix(in srgb, var(--fg) 45%, transparent)`,
          background: "color-mix(in srgb, var(--shadow) 40%, transparent)",
          color: "var(--fg)",
          cursor: "pointer",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: focused ? 1 : 0,
          pointerEvents: focused ? "auto" : "none",
          transition: `opacity ${DUR} ${EASE}`,
        }}
        aria-label="Exit focus"
      >
        ×
      </button>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 32,
          transform: "translateX(-50%)",
          zIndex: 11,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "color-mix(in srgb, var(--fg) 40%, transparent)",
          opacity: focused ? 1 : 0,
          transition: `opacity ${DUR} ${EASE} ${focused ? ".22s" : "0s"}`,
          pointerEvents: "none",
        }}
      >
        esc or click backdrop to exit
      </div>
    </>
  );
}
