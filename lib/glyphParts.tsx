import React from "react";

// Each chapter's glyph is composed of named parts. A "role" is the morphing
// key: parts that share a role across chapters are connected by the morph
// (interpolated position + shape crossfade). Parts unique to one side just
// fade in/out. Shapes use `currentColor` so the two-pass (shadow + accent)
// renderer can color them by setting `color:` on a wrapper group.
export type Part = {
  role: string;
  cx: number; // role centerpoint on the 100x100 viewBox
  cy: number;
  render: React.ReactNode;
};

export type GlyphSpec = {
  chapter: number;
  parts: Part[]; // rendered in array order (later = on top)
};

// Stable role ordering. Both chapters render parts in this order so that
// shared roles morph in matching z-positions and unique parts slot in
// predictably. Roles missing from a chapter are skipped.
export const ROLE_ORDER = [
  "line_top_1",
  "line_top_2",
  "line_top_3",
  "line_bot_1",
  "line_bot_2",
  "line_bot_3",
  "echo",
  "dot_a",
  "dot_b",
  "corner_tl",
  "corner_br",
  "primary",
  "ring",
  "handle",
];

// CH.1 — Dev Tooling. Subject: a document scanned by a magnifier; the em-dash
// is the AI "tell" highlighted at center; surrounding text suggests a real
// paragraph with two suspect punctuation marks; marquee corners frame the
// scanned region.
export const ch1: GlyphSpec = {
  chapter: 1,
  parts: [
    {
      role: "line_top_1",
      cx: 50,
      cy: 18,
      render: (
        <rect
          x={22}
          y={17}
          width={56}
          height={2}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "line_top_2",
      cx: 48,
      cy: 24,
      render: (
        <rect
          x={22}
          y={23}
          width={48}
          height={2}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "line_top_3",
      cx: 52,
      cy: 30,
      render: (
        <rect
          x={22}
          y={29}
          width={58}
          height={2}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "line_bot_1",
      cx: 48,
      cy: 70,
      render: (
        <rect
          x={22}
          y={69}
          width={50}
          height={2}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "line_bot_2",
      cx: 50,
      cy: 76,
      render: (
        <rect
          x={22}
          y={75}
          width={54}
          height={2}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "line_bot_3",
      cx: 46,
      cy: 82,
      render: (
        <rect
          x={22}
          y={81}
          width={44}
          height={2}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "echo",
      cx: 18,
      cy: 88,
      render: (
        <rect
          x={10}
          y={86}
          width={18}
          height={3}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "dot_a",
      cx: 84,
      cy: 18,
      render: <circle cx={84} cy={18} r={2} fill="currentColor" />,
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 12,
      render: <circle cx={14} cy={12} r={1.5} fill="currentColor" />,
    },
    {
      role: "corner_tl",
      cx: 7,
      cy: 7,
      render: (
        <path
          d="M3 10 L 3 3 L 10 3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
        />
      ),
    },
    {
      role: "corner_br",
      cx: 93,
      cy: 93,
      render: (
        <path
          d="M97 90 L 97 97 L 90 97"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
        />
      ),
    },
    {
      role: "primary",
      cx: 50,
      cy: 48,
      render: (
        <rect
          x={28}
          y={44}
          width={44}
          height={8}
          rx={1.5}
          fill="currentColor"
        />
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 48,
      render: (
        <circle
          cx={50}
          cy={48}
          r={26}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        />
      ),
    },
    {
      role: "handle",
      cx: 80,
      cy: 78,
      render: (
        <g>
          <line
            x1={68}
            y1={66}
            x2={88}
            y2={86}
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      ),
    },
  ],
};

// CH.2 — Blockchain Security. Subject: a broken chain caught mid-snap; top
// link intact, link below is shattered with shards flying outward; a dashed
// scanner ring centers on the break; a hanging fragment dangles low-left.
export const ch2: GlyphSpec = {
  chapter: 2,
  parts: [
    {
      role: "line_top_1",
      cx: 38,
      cy: 50,
      render: (
        <path
          d="M30 48 L 46 52"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_2",
      cx: 62,
      cy: 50,
      render: (
        <path
          d="M54 52 L 70 48"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_3",
      cx: 50,
      cy: 42,
      render: (
        <rect
          x={47}
          y={36}
          width={6}
          height={12}
          rx={1}
          fill="currentColor"
        />
      ),
    },
    {
      role: "line_bot_1",
      cx: 36,
      cy: 70,
      render: (
        <path
          d="M30 68 L 44 72"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_2",
      cx: 50,
      cy: 76,
      render: (
        <path
          d="M44 76 L 56 76"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_3",
      cx: 64,
      cy: 70,
      render: (
        <path
          d="M56 72 L 70 68"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "echo",
      cx: 22,
      cy: 86,
      render: (
        <g transform="rotate(-22 22 86)">
          <ellipse
            cx={22}
            cy={86}
            rx={11}
            ry={4.5}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          />
        </g>
      ),
    },
    {
      role: "dot_a",
      cx: 86,
      cy: 20,
      render: (
        <polygon points="83,17 89,19 88,23 82,21" fill="currentColor" />
      ),
    },
    {
      role: "dot_b",
      cx: 12,
      cy: 14,
      render: (
        <polygon points="10,11 15,12 14,16 9,15" fill="currentColor" />
      ),
    },
    {
      role: "corner_tl",
      cx: 7,
      cy: 7,
      render: (
        <path
          d="M3 10 L 3 3 L 10 3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
        />
      ),
    },
    {
      role: "corner_br",
      cx: 93,
      cy: 93,
      render: (
        <path
          d="M97 90 L 97 97 L 90 97"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
        />
      ),
    },
    {
      role: "primary",
      cx: 50,
      cy: 26,
      render: (
        <ellipse
          cx={50}
          cy={26}
          rx={22}
          ry={9}
          fill="none"
          stroke="currentColor"
          strokeWidth={5}
        />
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 58,
      render: (
        <circle
          cx={50}
          cy={58}
          r={24}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
      ),
    },
    {
      role: "handle",
      cx: 80,
      cy: 88,
      render: (
        <g>
          <line
            x1={70}
            y1={78}
            x2={88}
            y2={96}
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      ),
    },
  ],
};

// Reusable corner-bracket renders — identical across all chapters so they
// stay anchored as a visual constant during the morph.
const cornerTL = (
  <path
    d="M3 10 L 3 3 L 10 3"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  />
);
const cornerBR = (
  <path
    d="M97 90 L 97 97 L 90 97"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  />
);

// CH.3 — Cost Engineering. Subject: a $0 postmark/stamp. Dashed stamp
// border around a chunky "$0" mark; handwritten address lines above; a
// postal barcode strip below; cancellation arc sweeping out to the right.
export const ch3: GlyphSpec = {
  chapter: 3,
  parts: [
    {
      role: "line_top_1",
      cx: 50,
      cy: 18,
      render: <rect x={18} y={17} width={60} height={2.5} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_2",
      cx: 46,
      cy: 24,
      render: <rect x={18} y={23} width={48} height={2.5} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_3",
      cx: 50,
      cy: 30,
      render: <rect x={18} y={29} width={54} height={2.5} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_1",
      cx: 30,
      cy: 78,
      render: <rect x={28} y={70} width={3} height={16} fill="currentColor" />,
    },
    {
      role: "line_bot_2",
      cx: 48,
      cy: 78,
      render: <rect x={40} y={70} width={2} height={16} fill="currentColor" />,
    },
    {
      role: "line_bot_3",
      cx: 64,
      cy: 78,
      render: <rect x={56} y={70} width={4} height={16} fill="currentColor" />,
    },
    {
      role: "echo",
      cx: 18,
      cy: 86,
      render: (
        <g>
          <circle cx={18} cy={86} r={6} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <text
            x={18}
            y={89}
            fontSize={7}
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            fontFamily="ui-monospace, monospace"
            fontWeight={700}
          >
            0
          </text>
        </g>
      ),
    },
    {
      role: "dot_a",
      cx: 86,
      cy: 18,
      render: <circle cx={86} cy={18} r={2} fill="currentColor" />,
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 14,
      render: <circle cx={14} cy={14} r={2} fill="currentColor" />,
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 50,
      cy: 52,
      render: (
        <text
          x={50}
          y={62}
          fontSize={28}
          fontWeight={800}
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          $0
        </text>
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 50,
      render: (
        <circle
          cx={50}
          cy={50}
          r={22}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeDasharray="5 4"
        />
      ),
    },
    {
      role: "handle",
      cx: 82,
      cy: 84,
      render: (
        <path
          d="M65 70 Q 80 80 92 92"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ),
    },
  ],
};

// CH.4 — Frontend. Subject: an event wristband. Header text rows above; a
// solid wrapping band across the middle with a small entry stamp; perforated
// barcode strip below; receipt-stub echo bottom-left; dashed tear-strip
// extending out the bottom-right.
export const ch4: GlyphSpec = {
  chapter: 4,
  parts: [
    {
      role: "line_top_1",
      cx: 50,
      cy: 16,
      render: <rect x={18} y={15} width={62} height={2.5} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_2",
      cx: 46,
      cy: 22,
      render: <rect x={18} y={21} width={42} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_3",
      cx: 52,
      cy: 28,
      render: <rect x={18} y={27} width={50} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_1",
      cx: 32,
      cy: 78,
      render: <rect x={30} y={72} width={3} height={12} fill="currentColor" />,
    },
    {
      role: "line_bot_2",
      cx: 46,
      cy: 78,
      render: <rect x={42} y={72} width={2} height={12} fill="currentColor" />,
    },
    {
      role: "line_bot_3",
      cx: 64,
      cy: 78,
      render: <rect x={56} y={72} width={4} height={12} fill="currentColor" />,
    },
    {
      role: "echo",
      cx: 22,
      cy: 88,
      render: (
        <g>
          <rect x={10} y={84} width={22} height={8} fill="currentColor" />
          <line
            x1={20}
            y1={84}
            x2={20}
            y2={92}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="1.5 1.5"
          />
        </g>
      ),
    },
    {
      role: "dot_a",
      cx: 84,
      cy: 18,
      render: (
        <circle cx={84} cy={18} r={2.5} fill="none" stroke="currentColor" strokeWidth={1.5} />
      ),
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 12,
      render: (
        <circle cx={14} cy={12} r={2.5} fill="none" stroke="currentColor" strokeWidth={1.5} />
      ),
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 50,
      cy: 56,
      render: (
        <path d="M8 50 L 92 58 L 88 68 L 6 60 Z" fill="currentColor" />
      ),
    },
    {
      role: "ring",
      cx: 70,
      cy: 42,
      render: (
        <circle
          cx={70}
          cy={42}
          r={7}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
      ),
    },
    {
      role: "handle",
      cx: 84,
      cy: 84,
      render: (
        <line
          x1={70}
          y1={66}
          x2={94}
          y2={94}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeDasharray="3 2"
          strokeLinecap="round"
        />
      ),
    },
  ],
};

// CH.5 — Embodied AI. Subject: a speech bubble whose content is a watching
// eye. Stroke-only bubble (so the eye inside isn't hidden by a same-color
// fill); chat-line scaffolding above and below; smaller "typing" bubble
// echo bottom-left; pointy tail extending bottom-right.
export const ch5: GlyphSpec = {
  chapter: 5,
  parts: [
    {
      role: "line_top_1",
      cx: 36,
      cy: 14,
      render: <rect x={14} y={13} width={42} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_2",
      cx: 32,
      cy: 20,
      render: <rect x={14} y={19} width={34} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_3",
      cx: 38,
      cy: 26,
      render: <rect x={14} y={25} width={46} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_1",
      cx: 62,
      cy: 74,
      render: <rect x={40} y={73} width={42} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_2",
      cx: 60,
      cy: 80,
      render: <rect x={40} y={79} width={38} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_3",
      cx: 64,
      cy: 86,
      render: <rect x={40} y={85} width={46} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "echo",
      cx: 18,
      cy: 86,
      render: (
        <g>
          <ellipse cx={18} cy={86} rx={11} ry={5} fill="none" stroke="currentColor" strokeWidth={2} />
          <circle cx={14} cy={86} r={1.2} fill="currentColor" />
          <circle cx={18} cy={86} r={1.2} fill="currentColor" />
          <circle cx={22} cy={86} r={1.2} fill="currentColor" />
        </g>
      ),
    },
    {
      role: "dot_a",
      cx: 86,
      cy: 18,
      render: <circle cx={86} cy={18} r={2} fill="currentColor" />,
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 12,
      render: <circle cx={14} cy={12} r={1.5} fill="currentColor" />,
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 50,
      cy: 48,
      render: (
        <path
          d="M14 40 C 14 24, 86 24, 86 48 C 86 60, 56 64, 42 66 C 40 64, 14 56, 14 40 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 44,
      render: (
        <g>
          <ellipse cx={50} cy={44} rx={12} ry={6} fill="none" stroke="currentColor" strokeWidth={2.5} />
          <circle cx={50} cy={44} r={3} fill="currentColor" />
        </g>
      ),
    },
    {
      role: "handle",
      cx: 70,
      cy: 70,
      render: (
        <path d="M62 60 L 78 78 L 74 64 Z" fill="currentColor" />
      ),
    },
  ],
};

// CH.6 — Assistive Tech. Subject: a featureless face caught by detection,
// with one distinctive marker. Face oval (stroke-only) framed by a dashed
// recognition target; the marker is the dot_a slot positioned on the face
// itself; hair/brow strokes above and shoulder/neck below; a dashed leader
// line points to the marker. Corner brackets read as detection-box corners.
export const ch6: GlyphSpec = {
  chapter: 6,
  parts: [
    {
      role: "line_top_1",
      cx: 50,
      cy: 16,
      render: (
        <path
          d="M28 18 Q 38 12 50 14 T 72 18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_2",
      cx: 32,
      cy: 22,
      render: (
        <path
          d="M22 22 Q 30 18 38 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_3",
      cx: 68,
      cy: 22,
      render: (
        <path
          d="M62 24 Q 70 18 78 22"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_1",
      cx: 38,
      cy: 84,
      render: (
        <path
          d="M28 88 Q 36 80 44 82"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_2",
      cx: 50,
      cy: 84,
      render: (
        <line
          x1={42}
          y1={84}
          x2={58}
          y2={84}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_3",
      cx: 62,
      cy: 84,
      render: (
        <path
          d="M56 82 Q 64 80 72 88"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "echo",
      cx: 18,
      cy: 82,
      render: (
        <ellipse
          cx={18}
          cy={82}
          rx={7}
          ry={9}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      role: "dot_a",
      cx: 62,
      cy: 44,
      render: <circle cx={62} cy={44} r={3.5} fill="currentColor" />,
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 14,
      render: <circle cx={14} cy={14} r={1.5} fill="currentColor" />,
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 50,
      cy: 52,
      render: (
        <ellipse
          cx={50}
          cy={52}
          rx={22}
          ry={28}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 52,
      render: (
        <circle
          cx={50}
          cy={52}
          r={34}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
      ),
    },
    {
      role: "handle",
      cx: 80,
      cy: 78,
      render: (
        <line
          x1={66}
          y1={46}
          x2={90}
          y2={90}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
      ),
    },
  ],
};

// CH.7 — Game Engineering. Subject: a hit-spark / impact burst with HUD
// scaffolding. Beat-pulse bars above (rhythm), damage-number bars below;
// shockwave ring outside the star; long motion-streak handle slicing out
// the bottom-right; a smaller combo spark echoing bottom-left.
export const ch7: GlyphSpec = {
  chapter: 7,
  parts: [
    {
      role: "line_top_1",
      cx: 24,
      cy: 18,
      render: <rect x={22} y={14} width={3} height={9} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_2",
      cx: 36,
      cy: 16,
      render: <rect x={34} y={10} width={3} height={13} rx={1} fill="currentColor" />,
    },
    {
      role: "line_top_3",
      cx: 48,
      cy: 18,
      render: <rect x={46} y={14} width={3} height={9} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_1",
      cx: 28,
      cy: 78,
      render: <rect x={20} y={76} width={16} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_2",
      cx: 50,
      cy: 84,
      render: <rect x={40} y={82} width={20} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "line_bot_3",
      cx: 72,
      cy: 78,
      render: <rect x={64} y={76} width={16} height={2} rx={1} fill="currentColor" />,
    },
    {
      role: "echo",
      cx: 18,
      cy: 82,
      render: (
        <polygon
          points="18,74 22,80 28,82 22,84 18,90 14,84 8,82 14,80"
          fill="currentColor"
        />
      ),
    },
    {
      role: "dot_a",
      cx: 86,
      cy: 22,
      render: (
        <polygon points="83,18 88,18 88,23 86,26 83,23" fill="currentColor" />
      ),
    },
    {
      role: "dot_b",
      cx: 12,
      cy: 22,
      render: <circle cx={12} cy={22} r={1.5} fill="currentColor" />,
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 50,
      cy: 50,
      render: (
        <polygon
          points="50,16 58,38 80,42 62,52 70,76 50,60 30,76 38,52 20,42 42,38"
          fill="currentColor"
        />
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 50,
      render: (
        <circle
          cx={50}
          cy={50}
          r={32}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="2 4"
        />
      ),
    },
    {
      role: "handle",
      cx: 82,
      cy: 82,
      render: (
        <path
          d="M62 60 L 94 94"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ),
    },
  ],
};

// CH.8 — Embedded Audio. Subject: a skewed membrane key with waveforms
// emanating; a knob to the right (ring); a row of additional keys below;
// LED indicator dots; a wave-tail handle extending bottom-right.
export const ch8: GlyphSpec = {
  chapter: 8,
  parts: [
    {
      role: "line_top_1",
      cx: 24,
      cy: 16,
      render: (
        <path
          d="M14 18 Q 20 8 26 18 T 36 18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_2",
      cx: 50,
      cy: 14,
      render: (
        <path
          d="M38 16 Q 46 4 54 16 T 62 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_3",
      cx: 76,
      cy: 16,
      render: (
        <path
          d="M64 18 Q 72 8 78 18 T 88 18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_1",
      cx: 24,
      cy: 80,
      render: (
        <rect
          x={18}
          y={76}
          width={10}
          height={10}
          rx={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      role: "line_bot_2",
      cx: 38,
      cy: 80,
      render: (
        <rect
          x={32}
          y={76}
          width={10}
          height={10}
          rx={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      role: "line_bot_3",
      cx: 52,
      cy: 80,
      render: (
        <rect
          x={46}
          y={76}
          width={10}
          height={10}
          rx={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      role: "echo",
      cx: 16,
      cy: 86,
      render: (
        <g>
          <circle cx={16} cy={86} r={5.5} fill="none" stroke="currentColor" strokeWidth={2} />
          <line x1={16} y1={82} x2={16} y2={84.5} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </g>
      ),
    },
    {
      role: "dot_a",
      cx: 86,
      cy: 22,
      render: <circle cx={86} cy={22} r={2.5} fill="currentColor" />,
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 14,
      render: <circle cx={14} cy={14} r={2} fill="currentColor" />,
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 44,
      cy: 52,
      render: (
        <g transform="skewX(-12)">
          <rect x={42} y={40} width={28} height={26} rx={3} fill="currentColor" />
        </g>
      ),
    },
    {
      role: "ring",
      cx: 74,
      cy: 50,
      render: (
        <g>
          <circle cx={74} cy={50} r={9} fill="none" stroke="currentColor" strokeWidth={2.5} />
          <line x1={74} y1={43} x2={74} y2={46} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </g>
      ),
    },
    {
      role: "handle",
      cx: 82,
      cy: 68,
      render: (
        <path
          d="M64 62 Q 74 54 84 64 T 96 68"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ),
    },
  ],
};

// CH.9 — AI Systems. Subject: a schematic node in an architecture diagram.
// Central box (primary) connected by labeled arrows from above and below;
// dashed system-boundary ring; upstream node echo bottom-left; a labeled
// connection handle drops to the bottom-right; diagram corners.
export const ch9: GlyphSpec = {
  chapter: 9,
  parts: [
    {
      role: "line_top_1",
      cx: 22,
      cy: 22,
      render: (
        <path
          d="M12 22 L 30 22 M 27 19 L 30 22 L 27 25"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_2",
      cx: 50,
      cy: 18,
      render: (
        <path
          d="M50 8 L 50 26 M 47 23 L 50 26 L 53 23"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_top_3",
      cx: 78,
      cy: 22,
      render: (
        <path
          d="M70 22 L 88 22 M 73 19 L 70 22 L 73 25"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_1",
      cx: 22,
      cy: 78,
      render: (
        <path
          d="M12 78 L 30 78 M 27 75 L 30 78 L 27 81"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_2",
      cx: 50,
      cy: 82,
      render: (
        <path
          d="M50 74 L 50 92 M 47 89 L 50 92 L 53 89"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "line_bot_3",
      cx: 78,
      cy: 78,
      render: (
        <path
          d="M70 78 L 88 78 M 73 75 L 70 78 L 73 81"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ),
    },
    {
      role: "echo",
      cx: 18,
      cy: 86,
      render: (
        <rect
          x={10}
          y={82}
          width={16}
          height={8}
          rx={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      role: "dot_a",
      cx: 86,
      cy: 18,
      render: <circle cx={86} cy={18} r={2} fill="currentColor" />,
    },
    {
      role: "dot_b",
      cx: 14,
      cy: 14,
      render: <circle cx={14} cy={14} r={2} fill="currentColor" />,
    },
    { role: "corner_tl", cx: 7, cy: 7, render: cornerTL },
    { role: "corner_br", cx: 93, cy: 93, render: cornerBR },
    {
      role: "primary",
      cx: 50,
      cy: 50,
      render: (
        <rect
          x={34}
          y={38}
          width={32}
          height={24}
          rx={2}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        />
      ),
    },
    {
      role: "ring",
      cx: 50,
      cy: 50,
      render: (
        <circle
          cx={50}
          cy={50}
          r={32}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      ),
    },
    {
      role: "handle",
      cx: 82,
      cy: 84,
      render: (
        <path
          d="M66 62 L 92 92 M 88 89 L 92 92 L 89 88"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ),
    },
  ],
};

export const GLYPH_SPECS: Record<number, GlyphSpec> = {
  1: ch1,
  2: ch2,
  3: ch3,
  4: ch4,
  5: ch5,
  6: ch6,
  7: ch7,
  8: ch8,
  9: ch9,
};
