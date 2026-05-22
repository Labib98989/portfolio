"use client";

import { useEffect, type CSSProperties } from "react";
import { PROJECTS } from "@/lib/projects";
import { useTransition } from "./TransitionShell";

type Props = {
  open: boolean;
  active: number;
  onClose: () => void;
  onSelect: (i: number) => void;
};

// Bottom sheet that replaces the desktop FocusOverlay on mobile. Surfaces
// all 9 chapters in a scrollable list plus the two cross-route links
// (Currently Working, About) so the whole nav surface lives in one place.
// Tap a chapter → onSelect (the host scrolls the snap container to that
// section). ESC and backdrop click close the sheet.
export function MobileChapterSheet({ open, active, onClose, onSelect }: Props) {
  const { navigate } = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(8,8,8,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 280ms cubic-bezier(.4,.05,.15,1)",
          zIndex: 40,
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chapter index"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#22201d",
          color: "#efefec",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          boxShadow: "0 -10px 40px rgba(0,0,0,0.55)",
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: "transform 320ms cubic-bezier(.4,.05,.15,1)",
          zIndex: 41,
          maxHeight: "82dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <span
            aria-hidden
            style={{
              width: 38,
              height: 4,
              borderRadius: 2,
              background: "color-mix(in srgb, #efefec 28%, transparent)",
            }}
          />
        </div>

        <div
          style={{
            padding: "8px 24px 4px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, #efefec 52%, transparent)",
          }}
        >
          Selected works · 9
        </div>

        {/* Chapter list */}
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "8px 12px 12px",
            overflowY: "auto",
            flex: 1,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {PROJECTS.map((p, i) => {
            const isActive = i === active;
            return (
              <li key={p.slug}>
                <button
                  onClick={() => onSelect(i)}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "32px 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 12px",
                    background: isActive
                      ? "color-mix(in srgb, " + p.theme.accent + " 14%, transparent)"
                      : "transparent",
                    border: "none",
                    borderRadius: 10,
                    color: "#efefec",
                    textAlign: "left",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      color: isActive
                        ? p.theme.accent
                        : "color-mix(in srgb, #efefec 45%, transparent)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 16,
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {p.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "color-mix(in srgb, #efefec 45%, transparent)",
                    }}
                  >
                    {p.year}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Cross-route links */}
        <div
          style={{
            borderTop: "1px solid color-mix(in srgb, #efefec 12%, transparent)",
            padding: "14px 24px 22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <SheetRouteLink
            label="Currently Working"
            onClick={() => {
              onClose();
              navigate("/currently-working", "forward");
            }}
          />
          <SheetRouteLink
            label="About"
            onClick={() => {
              onClose();
              navigate("/about", "forward");
            }}
          />
        </div>
      </div>
    </>
  );
}

function SheetRouteLink({ label, onClick }: { label: string; onClick: () => void }) {
  const style: CSSProperties = {
    padding: "14px 16px",
    border: "1px solid color-mix(in srgb, #efefec 22%, transparent)",
    borderRadius: 10,
    background: "transparent",
    color: "#efefec",
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    textAlign: "left",
    cursor: "pointer",
  };
  return (
    <button onClick={onClick} style={style}>
      {label} <span aria-hidden style={{ float: "right", opacity: 0.6 }}>↗</span>
    </button>
  );
}
