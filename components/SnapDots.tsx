import type { Project } from "@/lib/projects";
import { DUR, EASE } from "@/lib/motion";

type Props = {
  projects: Project[];
  projectIdx: number;
  visible: boolean;
  accent: string;
};

export function SnapDots({ projects, projectIdx, visible, accent }: Props) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          zIndex: 4,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate(0, -50%)"
            : "translate(40px, -50%)",
          transition: `opacity ${DUR} ${EASE} .1s, transform ${DUR} ${EASE} .1s`,
          pointerEvents: "none",
        }}
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              justifyContent: "flex-end",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: i === projectIdx ? "var(--fg)" : "transparent",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              {(p.shortName ?? p.name).toUpperCase()}
            </span>
            <span
              style={{
                width: i === projectIdx ? 22 : 8,
                height: 2,
                background:
                  i === projectIdx
                    ? accent
                    : "color-mix(in srgb, var(--fg) 32%, transparent)",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 76,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "color-mix(in srgb, var(--fg) 45%, transparent)",
          opacity: visible ? 1 : 0,
          transition: `opacity ${DUR} ${EASE} .15s`,
          pointerEvents: "none",
        }}
      >
        ↑ ↓ &nbsp; scroll or arrow keys
      </div>
    </>
  );
}
