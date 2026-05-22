"use client";

import { useTransition } from "./TransitionShell";

type Props = {
  // Called just before navigation kicks off so the host page can clear
  // hover-driven layout state (e.g. exit the hero B-state on Home).
  onBeforeNavigate?: () => void;
};

export function Header({ onBeforeNavigate }: Props) {
  const { navigate } = useTransition();

  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        left: 96,
        right: 96,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.04em",
        zIndex: 5,
      }}
    >
      <span style={{ textTransform: "uppercase" }}>Labib Karim</span>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <button
          onClick={() => {
            onBeforeNavigate?.();
            navigate("/currently-working", "forward");
          }}
          aria-label="Open Currently Working page"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            textTransform: "uppercase",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "inherit",
            font: "inherit",
            letterSpacing: "0.04em",
            padding: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow:
                "0 0 0 3px color-mix(in srgb, var(--accent) 28%, transparent)",
              flexShrink: 0,
            }}
          />
          Currently Working
        </button>
        <button
          onClick={() => {
            onBeforeNavigate?.();
            navigate("/about", "forward");
          }}
          aria-label="Open About page"
          style={{
            textTransform: "uppercase",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "inherit",
            font: "inherit",
            letterSpacing: "0.04em",
            padding: 0,
          }}
        >
          About
        </button>
      </div>
    </div>
  );
}
