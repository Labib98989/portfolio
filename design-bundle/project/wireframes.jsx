// Homepage wireframes — 5 distinct directions channeling Robin's patterns.
// Each artboard is 1440×900; all share a black/cream palette + single accent.

const W = 1440;
const H = 900;

// Inject hero chapter-transition keyframes once
if (typeof document !== 'undefined' && !document.getElementById('wf-keyframes')) {
  const s = document.createElement('style');
  s.id = 'wf-keyframes';
  s.textContent = `
    @keyframes wfHeroFromBelow {
      from { opacity: 0; transform: translateY(48px) rotate(-2.2deg); }
      to   { opacity: 1; transform: translateY(0)    rotate(0deg); }
    }
    @keyframes wfHeroFromAbove {
      from { opacity: 0; transform: translateY(-48px) rotate(2.2deg); }
      to   { opacity: 1; transform: translateY(0)     rotate(0deg); }
    }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
// Shared scaffolding — annotations, ticker, header, canvas bg
// ─────────────────────────────────────────────────────────────

function WFShell({ children, dark = true, showCanvas = true, accent }) {
  return (
    <div style={{
      width: W, height: H, position: 'relative', overflow: 'hidden',
      background: dark ? '#0a0a0a' : '#efefec',
      color: dark ? '#efefec' : '#0a0a0a',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      {showCanvas && dark && <CanvasPlaceholder accent={accent} />}
      {children}
    </div>
  );
}

function CanvasPlaceholder({ accent }) {
  // Dashed-bordered diagonal-striped placeholder showing "WebGL canvas lives here"
  return (
    <div style={{
      position: 'absolute', inset: 24,
      border: '1.5px dashed rgba(239,239,236,0.18)',
      borderRadius: 2,
      backgroundImage:
        'repeating-linear-gradient(135deg, rgba(239,239,236,0.025) 0 12px, transparent 12px 24px)',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 16,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(239,239,236,0.32)',
      }}>
        ◇ persistent webgl canvas · survives route changes
      </div>
    </div>
  );
}

function WFHeader({ name = "Your Name", accent }) {
  return (
    <div style={{
      position: 'absolute', top: 32, left: 96, right: 96,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500,
      letterSpacing: '0.04em', zIndex: 5,
    }}>
      <span style={{ textTransform: 'uppercase' }}>{name}</span>
      <span style={{ textTransform: 'uppercase' }}>About</span>
    </div>
  );
}

function Tagline({ text, accent }) {
  return (
    <div style={{
      position: 'absolute', bottom: 28, left: 96,
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'rgba(239,239,236,0.45)', zIndex: 5,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: accent,
        boxShadow: `0 0 12px ${accent}`,
      }}></span>
      <span>{text}</span>
    </div>
  );
}

function ScrollbarHint({ side = 'right' }) {
  return (
    <div style={{
      position: 'absolute', [side]: 6, top: '38%', width: 4, height: 120,
      background: 'rgba(239,239,236,0.08)', borderRadius: 2, zIndex: 4,
    }}>
      <div style={{ width: 4, height: 36, background: 'rgba(239,239,236,0.35)', borderRadius: 2 }}></div>
    </div>
  );
}

// Hand-drawn annotation line + label
function Annotation({ x, y, w = 180, label, anchor = 'bl', accent }) {
  // anchor: where the label sits relative to the arrow tip
  return (
    <div style={{
      position: 'absolute', left: x, top: y, pointerEvents: 'none',
      fontFamily: '"Caveat", cursive', fontSize: 19, lineHeight: 1.15,
      color: accent, zIndex: 20, width: w,
      transform: anchor === 'br' ? 'translate(-100%, 0)' :
                 anchor === 'tl' ? 'translate(0, -100%)' :
                 anchor === 'tr' ? 'translate(-100%, -100%)' : 'none',
    }}>
      {label}
    </div>
  );
}

// Squiggly arrow SVG, draws from (x1,y1) → (x2,y2)
function Arrow({ x1, y1, x2, y2, accent, curve = 30 }) {
  const cx = (x1 + x2) / 2 + curve;
  const cy = (y1 + y2) / 2 - curve;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 19 }}>
      <defs>
        <marker id={`arr-${x1}-${y1}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L7,4 L0,8" stroke={accent} strokeWidth="1.4" fill="none" />
        </marker>
      </defs>
      <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
        stroke={accent} strokeWidth="1.4" fill="none"
        strokeDasharray="3 3" markerEnd={`url(#arr-${x1}-${y1})`} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Placeholder data
// ─────────────────────────────────────────────────────────────
const PROJECTS = [
  { slug: 'fieldnote',  name: 'Fieldnote',   blurb: 'A reading app that thinks in the margins, for messy thinkers and serial annotators.',  color: '#3d6681', year: '2025' },
  { slug: 'kelp',       name: 'Kelp',        blurb: 'Coastal-mapping toolkit for kelp-farming co-ops along the North Atlantic.',           color: '#5a8f7b', year: '2024' },
  { slug: 'lacuna',     name: 'Lacuna',      blurb: 'A typeface and a website for a small press that publishes nothing but lost books.',    color: '#b8654a', year: '2024' },
  { slug: 'tonewheel',  name: 'Tonewheel',   blurb: 'Browser-native synth that responds to your room, not your keyboard.',                  color: '#8a6dbb', year: '2023' },
  { slug: 'parade',     name: 'Parade',      blurb: 'Open-data dashboard for municipal events. Pet project; surprisingly used.',            color: '#c79a3e', year: '2023' },
  { slug: 'softline',   name: 'Softline',    blurb: 'Identity + product for a sleep-tech startup. Mostly the bits between screens.',        color: '#6a91b8', year: '2022' },
  { slug: 'almanac',    name: 'Almanac',     blurb: 'A weather almanac for people who garden. Daily, hyperlocal, prose-first.',             color: '#7c8a5a', year: '2022' },
  { slug: 'echoroom',   name: 'Echo Room',   blurb: 'Voice-only social experiment. Quiet on purpose.',                                       color: '#a8567f', year: '2021' },
  { slug: 'foundry',    name: 'Field Foundry', blurb: 'Brand + book for a small-batch furniture maker.',                                     color: '#4d6b5a', year: '2020' },
];

const TAGLINES = [
  "Tagline 04/10 — wherever, whenever",
  "Tagline 02/10 — the designer you didn't know you needed",
  "Tagline 07/10 — every brief you take, I'll be helping you",
  "Tagline 09/10 — only one designer left!!! #darkpatterns",
];

// ─────────────────────────────────────────────────────────────
// A · CLASSIC MIRROR — Robin's faithful homepage, original copy
// ─────────────────────────────────────────────────────────────
function WireframeA({ accent, annotations, showCanvas }) {
  const current = PROJECTS[0];
  return (
    <WFShell accent={accent} showCanvas={showCanvas}>
      <WFHeader accent={accent} />
      {/* Hero column */}
      <div style={{ position: 'absolute', left: 96, top: 220, width: 720, zIndex: 3 }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(239,239,236,0.55)', marginBottom: 24,
        }}>
          ◦ 01 / 09 &nbsp;·&nbsp; {current.year}
        </div>
        <div style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300, fontSize: 168,
          lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 28,
        }}>
          {current.name}
        </div>
        <div style={{
          fontFamily: '"Inter", sans-serif', fontSize: 17, lineHeight: 1.45,
          maxWidth: 480, color: 'rgba(239,239,236,0.82)', marginBottom: 40,
        }}>
          {current.blurb}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          paddingBottom: 6, borderBottom: `1px solid ${accent}`,
        }}>
          <span style={{ fontSize: 16 }}>→</span> Open case study
        </div>
      </div>
      {/* Right rail */}
      <div style={{
        position: 'absolute', right: 96, top: 220, zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14,
        fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500,
      }}>
        {PROJECTS.map((p, i) => (
          <div key={p.slug} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: i === 0 ? '#efefec' : 'rgba(239,239,236,0.42)',
            fontWeight: i === 0 ? 600 : 500,
          }}>
            {i === 0 && <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent }}></span>}
            <span>{p.name}</span>
          </div>
        ))}
      </div>
      <Tagline text={TAGLINES[0]} accent={accent} />
      <ScrollbarHint />

      {annotations && (
        <>
          <Arrow x1={460} y1={620} x2={310} y2={478} accent={accent} curve={30} />
          <Annotation x={300} y={640} accent={accent} label={'big serif hero ·\nleft-aligned · 168px'} />
          <Arrow x1={1100} y1={310} x2={1240} y2={232} accent={accent} curve={-20} />
          <Annotation x={1050} y={328} accent={accent} label={'right rail nav · 9 projects ·\ncurrent gets dot + emphasis'} />
          <Arrow x1={140} y1={120} x2={48} y2={48} accent={accent} curve={-15} />
          <Annotation x={150} y={110} accent={accent} label={'persistent canvas\nbehind everything'} />
          <Arrow x1={250} y1={830} x2={140} y2={862} accent={accent} curve={-10} />
          <Annotation x={260} y={812} accent={accent} label={'random tagline · 1 of 10'} />
        </>
      )}
    </WFShell>
  );
}

// ─────────────────────────────────────────────────────────────
// B · CHAPTER SNAP — one project per viewport, centered, snap-scroll
// ─────────────────────────────────────────────────────────────
function WireframeB({ accent, annotations, showCanvas }) {
  const current = PROJECTS[2];
  return (
    <WFShell accent={accent} showCanvas={showCanvas}>
      <WFHeader accent={accent} />
      {/* Centered hero */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', zIndex: 3,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(239,239,236,0.55)', marginBottom: 22,
        }}>
          Chapter 03 &nbsp;—&nbsp; 09
        </div>
        <div style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300, fontSize: 196,
          lineHeight: 0.92, letterSpacing: '-0.035em', marginBottom: 32,
        }}>
          {current.name}
        </div>
        <div style={{
          fontFamily: '"Inter", sans-serif', fontSize: 17, lineHeight: 1.5,
          maxWidth: 520, margin: '0 auto 36px',
          color: 'rgba(239,239,236,0.78)',
        }}>
          {current.blurb}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span style={{ width: 36, height: 1, background: accent }}></span>
          Open case study
        </div>
      </div>
      {/* Snap dots right */}
      <div style={{
        position: 'absolute', right: 64, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 14, zIndex: 4,
      }}>
        {PROJECTS.map((p, i) => (
          <div key={p.slug} style={{
            display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end',
            fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.04em',
            color: i === 2 ? '#efefec' : 'transparent',
          }}>
            <span style={{ whiteSpace: 'nowrap' }}>{p.name.toUpperCase()}</span>
            <span style={{
              width: i === 2 ? 22 : 8, height: 2,
              background: i === 2 ? accent : 'rgba(239,239,236,0.32)',
              transition: 'all .3s',
            }}></span>
          </div>
        ))}
      </div>
      {/* Up/down hint */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(239,239,236,0.45)', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span>↑ ↓ &nbsp; scroll or arrow keys</span>
      </div>
      <Tagline text={TAGLINES[1]} accent={accent} />

      {annotations && (
        <>
          <Arrow x1={920} y1={420} x2={720} y2={400} accent={accent} curve={-30} />
          <Annotation x={930} y={420} accent={accent} label={'one project = one viewport ·\nsnap on intent (Lethargy)'} />
          <Arrow x1={1240} y1={460} x2={1320} y2={460} accent={accent} curve={-10} />
          <Annotation x={1110} y={500} accent={accent} label={'snap dots ·\nname on current only'} />
          <Annotation x={96} y={780} accent={accent} label={'shorter pages →\nbigger type, no rail noise'} />
        </>
      )}
    </WFShell>
  );
}

// ─────────────────────────────────────────────────────────────
// C · HORIZONTAL SWEEP — pinned horizontal scroll, thumbnail strip
// ─────────────────────────────────────────────────────────────
function WireframeC({ accent, annotations, showCanvas }) {
  const current = PROJECTS[4];
  return (
    <WFShell accent={accent} showCanvas={showCanvas}>
      {/* Top sticky bar */}
      <div style={{
        position: 'absolute', top: 32, left: 96, right: 96, zIndex: 5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500,
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        <span>Your Name</span>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: 'rgba(239,239,236,0.65)',
        }}>
          05 / 09 &nbsp;—&nbsp; {current.name}
        </span>
        <span>About</span>
      </div>
      {/* Per-project color bar */}
      <div style={{
        position: 'absolute', top: 76, left: 96, right: 96, height: 2,
        background: 'rgba(239,239,236,0.08)', zIndex: 4,
      }}>
        <div style={{
          width: '52%', height: '100%', background: accent,
          transition: 'width .8s',
        }}></div>
      </div>
      {/* Big project title left */}
      <div style={{ position: 'absolute', left: 96, top: 260, zIndex: 3 }}>
        <div style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300, fontSize: 220,
          lineHeight: 0.88, letterSpacing: '-0.035em',
        }}>
          {current.name.split(' ').map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>
      </div>
      {/* Description right-side block */}
      <div style={{
        position: 'absolute', right: 96, top: 280, width: 360, zIndex: 3,
        fontFamily: '"Inter", sans-serif',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(239,239,236,0.55)', marginBottom: 16, fontFamily: '"JetBrains Mono", monospace' }}>
          Brand · Web · 2023
        </div>
        <div style={{ fontSize: 17, lineHeight: 1.5, color: 'rgba(239,239,236,0.82)', marginBottom: 28 }}>
          {current.blurb}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: accent,
        }}>
          Open case study &nbsp;→
        </div>
      </div>
      {/* Bottom thumbnail strip */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0, zIndex: 4,
        display: 'flex', gap: 14, paddingLeft: 96, paddingRight: 96,
        alignItems: 'flex-end',
      }}>
        {PROJECTS.map((p, i) => {
          const isCurrent = i === 4;
          return (
            <div key={p.slug} style={{
              flex: isCurrent ? '0 0 200px' : '0 0 88px',
              height: isCurrent ? 124 : 88,
              border: '1px dashed rgba(239,239,236,0.22)',
              borderColor: isCurrent ? accent : 'rgba(239,239,236,0.22)',
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(239,239,236,0.04) 0 8px, transparent 8px 16px)',
              position: 'relative',
              transition: 'all .4s',
            }}>
              <div style={{
                position: 'absolute', bottom: -22, left: 0,
                fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: isCurrent ? '#efefec' : 'rgba(239,239,236,0.45)',
              }}>
                {String(i + 1).padStart(2, '0')} · {p.name}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        position: 'absolute', bottom: 18, right: 96,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(239,239,236,0.4)',
      }}>
        ← drag or scroll →
      </div>

      {annotations && (
        <>
          <Arrow x1={520} y1={550} x2={350} y2={500} accent={accent} curve={40} />
          <Annotation x={520} y={555} accent={accent} label={'huge serif · 2-line stack ·\nleft-aligned, full bleed'} />
          <Arrow x1={920} y1={640} x2={780} y2={760} accent={accent} curve={20} />
          <Annotation x={925} y={620} accent={accent} label={'current thumbnail\nexpands as it passes'} />
          <Annotation x={96} y={92} accent={accent} label={'per-project color bar fills\nwith current'} />
        </>
      )}
    </WFShell>
  );
}

// ─────────────────────────────────────────────────────────────
// D · EDITORIAL INDEX — all 9 projects on one screen, asymmetric tiles
// ─────────────────────────────────────────────────────────────
function WireframeD({ accent, annotations }) {
  // Hand-laid asymmetric grid in absolute coords. 1440×900, header at top.
  const tiles = [
    { p: 0, x: 96,   y: 144, w: 560, h: 360, big: true },
    { p: 1, x: 672,  y: 144, w: 320, h: 172 },
    { p: 2, x: 1008, y: 144, w: 336, h: 172 },
    { p: 3, x: 672,  y: 332, w: 240, h: 172 },
    { p: 4, x: 928,  y: 332, w: 240, h: 172 },
    { p: 5, x: 1184, y: 332, w: 160, h: 172 },
    { p: 6, x: 96,   y: 520, w: 400, h: 220 },
    { p: 7, x: 512,  y: 520, w: 480, h: 220, accent: true },
    { p: 8, x: 1008, y: 520, w: 336, h: 220 },
  ];
  return (
    <WFShell accent={accent} showCanvas={false}>
      <WFHeader accent={accent} />
      <div style={{
        position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'rgba(239,239,236,0.55)', zIndex: 5,
      }}>
        Index · 09 selected works
      </div>
      {tiles.map((t, i) => {
        const p = PROJECTS[t.p];
        const isAccent = t.accent;
        return (
          <div key={i} style={{
            position: 'absolute', left: t.x, top: t.y, width: t.w, height: t.h,
            background: isAccent ? accent : 'transparent',
            border: isAccent ? 'none' : '1px solid rgba(239,239,236,0.14)',
            color: isAccent ? '#0a0a0a' : '#efefec',
            padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            backgroundImage: isAccent ? 'none' : 'repeating-linear-gradient(135deg, rgba(239,239,236,0.025) 0 12px, transparent 12px 24px)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              opacity: 0.7,
            }}>
              <span>{String(t.p + 1).padStart(2, '0')}</span>
              <span>{p.year}</span>
            </div>
            <div>
              <div style={{
                fontFamily: '"Fraunces", serif', fontWeight: 300,
                fontSize: t.big ? 72 : 32, lineHeight: 0.95,
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>
                {p.name}
              </div>
              {t.big && (
                <div style={{
                  fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.45,
                  maxWidth: 360, opacity: 0.78,
                }}>
                  {p.blurb}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <Tagline text={TAGLINES[2]} accent={accent} />

      {annotations && (
        <>
          <Arrow x1={500} y1={250} x2={400} y2={310} accent={accent} curve={20} />
          <Annotation x={500} y={250} accent={accent} label={'narrative ordering ·\nnot chronological'} />
          <Arrow x1={760} y1={680} x2={680} y2={640} accent={accent} curve={-20} />
          <Annotation x={770} y={680} accent={accent} label={'one accent tile breaks\nthe grayscale rhythm'} />
          <Annotation x={1100} y={92} accent={accent} label={'static index · no scroll\nchoreography needed'} />
        </>
      )}
    </WFShell>
  );
}

// ─────────────────────────────────────────────────────────────
// E · NOTCH DIAL — wheel/dial nav on right, watermark number, payoff message
// ─────────────────────────────────────────────────────────────
function WireframeE({ accent, annotations, showCanvas }) {
  const current = PROJECTS[5];
  const idx = 5;
  return (
    <WFShell accent={accent} showCanvas={showCanvas}>
      <WFHeader accent={accent} />
      {/* Huge background number watermark */}
      <div style={{
        position: 'absolute', left: 40, top: 60, zIndex: 1,
        fontFamily: '"Fraunces", serif', fontWeight: 100, fontSize: 760,
        lineHeight: 0.8, letterSpacing: '-0.08em',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(239,239,236,0.08)',
      }}>
        {String(idx + 1).padStart(2, '0')}
      </div>
      {/* Project title + body */}
      <div style={{ position: 'absolute', left: 96, top: 320, width: 640, zIndex: 3 }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(239,239,236,0.55)', marginBottom: 22,
        }}>
          ◦ Identity &amp; Product · {current.year}
        </div>
        <div style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300, fontSize: 124,
          lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 24,
        }}>
          {current.name}
        </div>
        <div style={{
          fontFamily: '"Inter", sans-serif', fontSize: 17, lineHeight: 1.5,
          maxWidth: 460, color: 'rgba(239,239,236,0.82)', marginBottom: 36,
        }}>
          {current.blurb}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${accent}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>→</span>
          Open case study
        </div>
      </div>
      {/* Right notch wheel */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        paddingRight: 24, zIndex: 4,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PROJECTS.map((p, i) => {
            const isCurrent = i === idx;
            return (
              <div key={p.slug} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
                height: 28,
              }}>
                <span style={{
                  fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.03em',
                  color: isCurrent ? '#efefec' : 'transparent',
                  whiteSpace: 'nowrap',
                }}>
                  {p.name}
                </span>
                <span style={{
                  height: 1, width: isCurrent ? 48 : (i === idx-1 || i === idx+1 ? 28 : 18),
                  background: isCurrent ? accent : 'rgba(239,239,236,0.32)',
                  opacity: isCurrent ? 1 : (i === idx-1 || i === idx+1 ? 0.7 : 0.4),
                  transition: 'all .3s',
                }}></span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Back-to-home payoff preview */}
      <div style={{
        position: 'absolute', left: 96, bottom: 28,
        display: 'flex', alignItems: 'center', gap: 14, zIndex: 5,
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: '50%', border: `1px solid rgba(239,239,236,0.3)`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>↑</span>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(239,239,236,0.4)', marginBottom: 2,
          }}>
            ↳ scrolls to reveal
          </div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 22, color: '#efefec',
          }}>
            Sleep well, friends. 💤
          </div>
        </div>
      </div>

      {annotations && (
        <>
          <Arrow x1={420} y1={250} x2={300} y2={220} accent={accent} curve={-30} />
          <Annotation x={430} y={250} accent={accent} label={'massive numeric watermark ·\nthin outline serif'} />
          <Arrow x1={1100} y1={420} x2={1280} y2={450} accent={accent} curve={-20} />
          <Annotation x={920} y={420} accent={accent} label={'notch wheel · drag or scroll ·\nnames fade in around current'} />
          <Arrow x1={420} y1={830} x2={330} y2={862} accent={accent} curve={-10} />
          <Annotation x={430} y={812} accent={accent} label={'per-project back-home\npayoff message'} />
        </>
      )}
    </WFShell>
  );
}

// ─────────────────────────────────────────────────────────────
// F · HERO + RADIAL DIAL — A's hero layout, dial replaces the right rail.
// Hover-driven state: hovering the hero zone morphs the layout toward B
// (centered chapter, type grows, dial fades + slides off right, snap dots in).
// ─────────────────────────────────────────────────────────────
const EASE = 'cubic-bezier(.4,.05,.15,1)';
const DUR = '.6s';

function WireframeF({ accent, annotations, showCanvas }) {
  const [zone, setZone] = React.useState(null);
  const [projectIdx, setProjectIdx] = React.useState(0);
  const [dir, setDir] = React.useState(1); // +1 next (from below), -1 prev (from above)
  const [focused, setFocused] = React.useState(false);
  const isHero = zone === 'hero';
  const isDial = zone === 'dial';
  const current = PROJECTS[projectIdx];

  // Dial geometry — anchored well past the right edge (~30% off-screen).
  const cx = 1370, cy = 480;
  const rOuter = 210, rTickIn = 188, rLabel = 246;
  const SEG = 360 / PROJECTS.length;          // 40° per notch
  const rotationDeg = -projectIdx * SEG;       // CCW for next; CW for prev
  const rotRad = rotationDeg * Math.PI / 180;

  // Base tick positions (idx 0 sits at 9 o'clock; the rest fan clockwise).
  const ticks = PROJECTS.map((p, i) => {
    const angle = (180 + i * SEG) * Math.PI / 180;
    return { p, i, angle, x: Math.cos(angle), y: Math.sin(angle) };
  });

  // Capture scroll on the dial zone — one accumulated threshold = one notch.
  // preventDefault keeps the page (and the design canvas pan/zoom) still
  // while the wheel is "active".
  const dialOverlayRef = React.useRef(null);
  React.useEffect(() => {
    if (!isDial && !focused) return;
    const el = dialOverlayRef.current;
    if (!el) return;
    let accum = 0;
    let lastSwap = 0;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      accum += e.deltaY;
      const now = Date.now();
      if (Math.abs(accum) >= 50 && now - lastSwap > 360) {
        const d = accum > 0 ? 1 : -1;
        setDir(d);
        setProjectIdx((p) => (p + d + PROJECTS.length) % PROJECTS.length);
        accum = 0;
        lastSwap = now;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isDial, focused]);

  // Focus mode — wheel takes over center, hero fades, backdrop dims
  const jumpToIndex = (newIdx) => {
    setFocused(false);
    if (newIdx === projectIdx) return;
    const len = PROJECTS.length;
    const forward = (newIdx - projectIdx + len) % len;
    const backward = (projectIdx - newIdx + len) % len;
    const d = forward <= backward ? 1 : -1;
    setDir(d);
    setProjectIdx(newIdx);
  };
  React.useEffect(() => {
    if (!focused) return;
    const onKey = (e) => { if (e.key === 'Escape') setFocused(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused]);

  // Dial transform — translate to artboard center + scale up when focused
  const FOCUS_CX = 720, FOCUS_CY = 480, FOCUS_SCALE = 1.55;
  const dialOffsetX = focused ? FOCUS_CX - cx : 0;
  const dialOffsetY = focused ? FOCUS_CY - cy : 0;
  const dialScale = focused ? FOCUS_SCALE : 1;

  return (
    <WFShell accent={accent} showCanvas={showCanvas}>
      <WFHeader accent={accent} />

      {/* Hero hover overlay — left zone; morphs layout to B-state */}
      <div
        onMouseEnter={() => setZone('hero')}
        onMouseLeave={() => setZone(null)}
        style={{
          position: 'absolute',
          left: 0, top: 88, bottom: 56,
          width: isHero ? 1100 : 760,
          zIndex: isHero ? 7 : 6,
          background: 'transparent',
          outline: annotations ? `1px dashed ${accent}` : 'none',
          outlineOffset: -8,
          transition: `width ${DUR} ${EASE}`,
          cursor: 'pointer',
          pointerEvents: isDial ? 'none' : 'auto',
        }}
      >
        {annotations && (
          <div style={{
            position: 'absolute', top: 4, left: 20,
            fontFamily: '"Caveat", cursive', fontSize: 18,
            color: accent, pointerEvents: 'none',
          }}>
            hover zone · hero → centered chapter (B)
          </div>
        )}
      </div>

      {/* Dial hover overlay — right zone; scroll spins, bg-click toggles focus */}
      <div
        ref={dialOverlayRef}
        onMouseEnter={() => !focused && setZone('dial')}
        onMouseLeave={() => !focused && setZone(null)}
        onClick={() => setFocused((f) => !f)}
        style={{
          position: 'absolute',
          left: focused ? 0 : 760,
          top: focused ? 0 : 88,
          right: 0,
          bottom: focused ? 0 : 56,
          zIndex: focused ? 9 : (isDial ? 7 : 6),
          background: focused ? 'rgba(8,8,8,0.62)' : 'transparent',
          outline: annotations && !focused ? `1px dashed ${accent}` : 'none',
          outlineOffset: -8,
          cursor: focused ? 'zoom-out' : (isDial ? 'zoom-in' : 'pointer'),
          pointerEvents: (isHero && !focused) ? 'none' : 'auto',
          transition: `left ${DUR} ${EASE}, top ${DUR} ${EASE}, bottom ${DUR} ${EASE}, background-color ${DUR} ${EASE}`,
        }}
      >
        {annotations && !focused && (
          <div style={{
            position: 'absolute', top: 4, right: 20,
            fontFamily: '"Caveat", cursive', fontSize: 18,
            color: accent, pointerEvents: 'none', textAlign: 'right',
          }}>
            scroll spins · click notch jumps · click bg focuses
          </div>
        )}
      </div>

      {/* Hero — outer wrapper handles hover-state morph (left↔center) */}
      <div style={{
        position: 'absolute',
        left: isHero ? '50%' : 96,
        top: isHero ? 196 : 232,
        transform: isHero ? 'translateX(-50%)' : 'none',
        width: isHero ? 'auto' : 680,
        textAlign: isHero ? 'center' : 'left',
        zIndex: 3,
        pointerEvents: 'none',
        opacity: focused ? 0 : 1,
        transition: `left ${DUR} ${EASE}, top ${DUR} ${EASE}, transform ${DUR} ${EASE}, width ${DUR} ${EASE}, opacity ${DUR} ${EASE}`,
      }}>
        {/* Inner wrapper — re-mounts per projectIdx for the chapter swap.
            Pivots from its wheel-facing edge so the rotation feels coupled
            to the wheel spin. Suppressed when in B-state (hover hero). */}
        <div
          key={`hero-${projectIdx}`}
          style={{
            transformOrigin: isHero ? '50% 50%' : '100% 50%',
            animation: isHero
              ? 'none'
              : `${dir > 0 ? 'wfHeroFromBelow' : 'wfHeroFromAbove'} .6s ${EASE}`,
          }}
        >
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: isHero ? '0.2em' : '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(239,239,236,0.55)', marginBottom: 24,
            transition: `letter-spacing ${DUR} ${EASE}`,
          }}>
            {isHero
              ? <>Chapter {String(projectIdx + 1).padStart(2, '0')} &nbsp;—&nbsp; 09</>
              : <>◦ {String(projectIdx + 1).padStart(2, '0')} / 09 &nbsp;·&nbsp; {current.year}</>}
          </div>
          <div style={{
            fontFamily: '"Fraunces", serif', fontWeight: 300,
            fontSize: isHero ? 200 : 168,
            lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 28,
            transition: `font-size ${DUR} ${EASE}`,
          }}>
            {current.name}
          </div>
          <div style={{
            fontFamily: '"Inter", sans-serif', fontSize: 17, lineHeight: 1.45,
            maxWidth: isHero ? 520 : 460,
            margin: isHero ? '0 auto 36px' : '0 0 40px',
            color: 'rgba(239,239,236,0.82)',
            transition: `max-width ${DUR} ${EASE}, margin ${DUR} ${EASE}`,
          }}>
            {current.blurb}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            paddingBottom: 6, borderBottom: `1px solid ${accent}`,
          }}>
            {isHero
              ? <><span style={{ width: 36, height: 1, background: accent }}></span>Open case study</>
              : <><span style={{ fontSize: 16 }}>→</span> Open case study</>}
          </div>
        </div>
      </div>

      {/* Dial group — fades on hero hover; ring spins with projectIdx;
          translates + scales when focused */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: focused ? 10 : 3,
        opacity: isHero ? 0 : 1,
        transform: focused
          ? `translate(${dialOffsetX}px, ${dialOffsetY}px) scale(${dialScale})`
          : isHero ? 'translateX(180px)' : 'translateX(0)',
        transformOrigin: `${cx}px ${cy}px`,
        transition: `opacity ${DUR} ${EASE}, transform ${DUR} ${EASE}`,
        pointerEvents: 'none',
      }}>
        <svg
          style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, pointerEvents: 'none', overflow: 'visible' }}
          viewBox={`0 0 ${W} ${H}`}
        >
          {/* Rotating ring + notches */}
          <g style={{
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: `transform .55s ${EASE}`,
          }}>
            <circle cx={cx} cy={cy} r={rOuter} fill="none"
              stroke="rgba(239,239,236,0.18)" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={rOuter - 32} fill="none"
              stroke="rgba(239,239,236,0.07)" strokeWidth="1" strokeDasharray="2 6" />
            {ticks.map(({ p, x, y }) => (
              <line key={p.slug}
                x1={cx + x * rTickIn} y1={cy + y * rTickIn}
                x2={cx + x * rOuter}  y2={cy + y * rOuter}
                stroke="rgba(239,239,236,0.42)" strokeWidth="1"
                strokeLinecap="round"
              />
            ))}
          </g>
          {/* Fixed active indicator at 9 o'clock — marks which notch is "current" */}
          <line
            x1={cx - rTickIn} y1={cy}
            x2={cx - (rOuter + 18)} y2={cy}
            stroke={accent} strokeWidth="2.4" strokeLinecap="round"
          />
          {(() => {
            const span = (SEG / 2) * Math.PI / 180 * 0.6;
            const a1 = Math.PI - span, a2 = Math.PI + span;
            const r = rOuter + 8;
            const p1x = cx + Math.cos(a1) * r, p1y = cy + Math.sin(a1) * r;
            const p2x = cx + Math.cos(a2) * r, p2y = cy + Math.sin(a2) * r;
            return <path d={`M ${p1x} ${p1y} A ${r} ${r} 0 0 1 ${p2x} ${p2y}`}
              stroke={accent} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
          })()}
        </svg>

        {/* Labels — orbit with rotation; only the left hemisphere is legible */}
        {ticks.map(({ p, i, angle }) => {
          const a = angle + rotRad;
          const x = Math.cos(a), y = Math.sin(a);
          if (x > 0.06) return null;
          const distance = Math.min(
            Math.abs(i - projectIdx),
            PROJECTS.length - Math.abs(i - projectIdx)
          );
          const isCurrent = i === projectIdx;
          const opacity = isCurrent ? 1 : Math.max(0.22, 0.7 - distance * 0.16);
          return (
            <div key={p.slug} style={{
              position: 'absolute', left: cx, top: cy,
              transform: `translate(${x * rLabel}px, ${y * rLabel}px) translate(-100%, -50%)`,
              transition: `transform .55s ${EASE}, opacity .55s ${EASE}`,
              paddingRight: 12,
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: '"Inter", sans-serif',
              fontSize: isCurrent ? 14 : 12,
              fontWeight: isCurrent ? 600 : 500,
              letterSpacing: '0.03em',
              color: '#efefec', opacity, whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: 'rgba(239,239,236,0.45)',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {p.name}
              {isCurrent && <span style={{
                width: 6, height: 6, borderRadius: '50%', background: accent,
                boxShadow: `0 0 8px ${accent}`,
              }}></span>}
            </div>
          );
        })}

        {/* Center wordmark + counter */}
        <div style={{
          position: 'absolute', left: cx, top: cy, zIndex: 4,
          transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: `1.2px solid ${accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Fraunces", serif', fontWeight: 400, fontSize: 22,
            color: accent, letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Y
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(239,239,236,0.55)',
          }}>
            {String(projectIdx + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(PROJECTS.length).padStart(2, '0')}
          </div>
        </div>

        {/* Rotation hint — brightens when the dial is active */}
        <div style={{
          position: 'absolute', left: cx - rOuter + 24, top: cy + rOuter + 36, zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: isDial ? accent : 'rgba(239,239,236,0.4)',
          whiteSpace: 'nowrap',
          transition: `color ${DUR} ${EASE}`,
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            border: `1px solid ${isDial ? accent : 'rgba(239,239,236,0.3)'}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
            transition: `border-color ${DUR} ${EASE}`,
          }}>↕</span>
          {isDial ? 'Scrolling spins the wheel' : 'Hover · scroll to rotate'}
        </div>
      </div>{/* /dial group */}

      {/* Snap dots — appear when hero zone hovered (B-style snap navigation) */}
      <div style={{
        position: 'absolute', right: 80, top: '50%',
        display: 'flex', flexDirection: 'column', gap: 14, zIndex: 4,
        opacity: isHero ? 1 : 0,
        transform: isHero ? 'translate(0, -50%)' : 'translate(40px, -50%)',
        transition: `opacity ${DUR} ${EASE} .1s, transform ${DUR} ${EASE} .1s`,
        pointerEvents: 'none',
      }}>
        {PROJECTS.map((p, i) => (
          <div key={p.slug} style={{
            display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end',
            fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.04em',
            color: i === projectIdx ? '#efefec' : 'transparent',
          }}>
            <span style={{ whiteSpace: 'nowrap' }}>{p.name.toUpperCase()}</span>
            <span style={{
              width: i === projectIdx ? 22 : 8, height: 2,
              background: i === projectIdx ? accent : 'rgba(239,239,236,0.32)',
            }}></span>
          </div>
        ))}
      </div>

      {/* Up/down hint — appears with snap dots in B-state */}
      <div style={{
        position: 'absolute', bottom: 76, left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(239,239,236,0.45)',
        opacity: isHero ? 1 : 0,
        transition: `opacity ${DUR} ${EASE} .15s`,
        pointerEvents: 'none',
      }}>
        ↑ ↓ &nbsp; scroll or arrow keys
      </div>

      <Tagline text={TAGLINES[3]} accent={accent} />
      <ScrollbarHint />

      {/* Notch hit areas — wide pill-shaped click targets that cover each
          notch + its label. Anchored with the right edge near the notch
          so the pill extends LEFT over the label. Only renders for the
          visible (left-hemisphere) notches in default mode; in focus
          mode the whole dial is on-screen so all 9 get pills. */}
      <div style={{ position: 'absolute', inset: 0, zIndex: focused ? 11 : 8, pointerEvents: 'none' }}>
        {ticks.map(({ p, i, angle }) => {
          const a = angle + rotRad;
          const xx = Math.cos(a), yy = Math.sin(a);
          if (!focused && xx > 0.06) return null;
          const px = cx + dialOffsetX + xx * rOuter * dialScale;
          const py = cy + dialOffsetY + yy * rOuter * dialScale;
          const hitW = 220 * dialScale;
          const hitH = 70 * dialScale;
          // Only the 4 pills called out in review (idx 0, 1, 2, 8) get the
          // rightward shift; everything else keeps the original anchoring.
          const SHIFT_RIGHT = new Set([0, 1, 2, 8]);
          const overR = (SHIFT_RIGHT.has(i) ? 60 : 24) * dialScale;
          return (
            <div
              key={`hit-${p.slug}`}
              onClick={(e) => { e.stopPropagation(); jumpToIndex(i); }}
              style={{
                position: 'absolute',
                left: px - hitW + overR,
                top: py - hitH / 2,
                width: hitW,
                height: hitH,
                borderRadius: hitH / 2,
                cursor: 'pointer',
                pointerEvents: isHero ? 'none' : 'auto',
                opacity: isHero ? 0 : 1,
                transition: `left .55s ${EASE}, top .55s ${EASE}, width .55s ${EASE}, height .55s ${EASE}, opacity ${DUR} ${EASE}`,
                background: annotations ? `${accent}1A` : 'transparent',
                border: annotations ? `1px dashed ${accent}66` : 'none',
              }}
              title={`Jump to ${p.name}`}
            />
          );
        })}
      </div>

      {/* Focused-mode close button (top-right) */}
      <button
        onClick={(e) => { e.stopPropagation(); setFocused(false); }}
        style={{
          position: 'absolute', top: 24, right: 96, zIndex: 12,
          width: 38, height: 38, borderRadius: '50%',
          border: `1px solid rgba(239,239,236,0.45)`,
          background: 'rgba(8,8,8,0.4)', color: '#efefec',
          cursor: 'pointer', fontFamily: '"Inter", sans-serif',
          fontSize: 18, lineHeight: 1, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: focused ? 1 : 0,
          pointerEvents: focused ? 'auto' : 'none',
          transition: `opacity ${DUR} ${EASE}`,
        }}
        aria-label="Exit focus"
      >×</button>

      {/* Focused-mode chapter info — blurb + CTA below the scaled-up dial */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 56,
        transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 11,
        maxWidth: 560, width: '100%', padding: '0 32px',
        opacity: focused ? 1 : 0,
        transition: `opacity ${DUR} ${EASE} ${focused ? '.22s' : '0s'}`,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.55,
          color: 'rgba(239,239,236,0.82)', marginBottom: 22,
        }}>
          {current.blurb}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          paddingBottom: 6, borderBottom: `1px solid ${accent}`,
          color: '#efefec',
        }}>
          <span style={{ fontSize: 16 }}>→</span> Open case study
        </div>
        <div style={{
          marginTop: 22,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(239,239,236,0.4)',
        }}>
          esc or click backdrop to exit
        </div>
      </div>

      {annotations && (
        <>
          <Arrow x1={460} y1={620} x2={310} y2={478} accent={accent} curve={30} />
          <Annotation x={300} y={640} accent={accent} label={'hero swap on wheel-spin ·\nslides + tilts from wheel side'} />
          <Arrow x1={950} y1={300} x2={cx + 30} y2={cy - rOuter - 10} accent={accent} curve={-30} />
          <Annotation x={830} y={300} accent={accent} label={'wheel spins ·\nfixed accent marks active notch'} />
          <Arrow x1={820} y1={520} x2={cx - rLabel - 90} y2={cy - 8} accent={accent} curve={-20} />
          <Annotation x={680} y={520} accent={accent} label={'labels orbit with the spin ·\nleft hemisphere only · fade by distance'} />
        </>
      )}
    </WFShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Root — design canvas + tweaks
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d97757",
  "annotations": true,
  "canvas": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="homepage"
          title="Homepage — 5 directions"
          subtitle="Channeling Robin's design patterns · placeholder content · desktop 1440">
          <DCArtboard id="A" label="A · Classic Mirror" width={W} height={H}>
            <WireframeA accent={accent} annotations={t.annotations} showCanvas={t.canvas} />
          </DCArtboard>
          <DCArtboard id="B" label="B · Chapter Snap" width={W} height={H}>
            <WireframeB accent={accent} annotations={t.annotations} showCanvas={t.canvas} />
          </DCArtboard>
          <DCArtboard id="C" label="C · Horizontal Sweep" width={W} height={H}>
            <WireframeC accent={accent} annotations={t.annotations} showCanvas={t.canvas} />
          </DCArtboard>
          <DCArtboard id="D" label="D · Editorial Index" width={W} height={H}>
            <WireframeD accent={accent} annotations={t.annotations} />
          </DCArtboard>
          <DCArtboard id="E" label="E · Notch Dial" width={W} height={H}>
            <WireframeE accent={accent} annotations={t.annotations} showCanvas={t.canvas} />
          </DCArtboard>
          <DCArtboard id="F" label="F · Hero + Dial Nav" width={W} height={H}>
            <WireframeF accent={accent} annotations={t.annotations} showCanvas={t.canvas} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Sketch options">
          <TweakToggle label="Annotations" value={t.annotations} onChange={(v) => setTweak('annotations', v)} />
          <TweakToggle label="Canvas placeholder" value={t.canvas} onChange={(v) => setTweak('canvas', v)} />
          <TweakColor
            label="Accent"
            value={accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#d97757', '#3d6681', '#7c8a5a', '#b8654a', '#8a6dbb']}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
