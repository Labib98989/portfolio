import { ImageResponse } from "next/og";

// Branded link-preview card (1200x630), generated at build time. Uses
// ImageResponse's built-in font — the brand is carried by the riso palette, the
// signature dial mark, and the layout, so no custom font needs vendoring.
// Renders via Satori: flexbox + a CSS subset only (no grid), so every container
// with multiple children sets display:flex and the dial rings are positioned
// absolutely.

export const alt = "Labib Karim — Selected Works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RISO_BLACK = "#22201d";
const FG = "#efefec";
const ACCENT = "#D9A89C";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: RISO_BLACK,
          color: FG,
          padding: "72px 80px",
        }}
      >
        {/* Brand line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: ACCENT,
              marginRight: 16,
            }}
          />
          <div>labibkarim.com</div>
        </div>

        {/* Name + tagline, with the dial mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 740 }}>
            <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
              Labib Karim
            </div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.3,
                marginTop: 28,
                color: "rgba(239,239,236,0.72)",
              }}
            >
              Selected works — applied AI, security, hardware, and the systems
              behind them.
            </div>
          </div>

          {/* Dial mark */}
          <div style={{ position: "relative", display: "flex", width: 200, height: 200, marginLeft: 48 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "3px solid rgba(239,239,236,0.18)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 34,
                left: 34,
                width: 132,
                height: 132,
                borderRadius: "50%",
                border: "4px solid #D9A89C",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 92,
                left: 24,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: ACCENT,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(239,239,236,0.5)",
          }}
        >
          Nine selected works · 2021—2026
        </div>
      </div>
    ),
    { ...size },
  );
}
