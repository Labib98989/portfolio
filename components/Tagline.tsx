export function Tagline({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        left: 96,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "color-mix(in srgb, var(--fg) 45%, transparent)",
        zIndex: 5,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 12px var(--accent)",
        }}
      />
      <span>{text}</span>
    </div>
  );
}
