# Portfolio — Stack Status (audited 2026-05-19)

Project context lives in `~/.claude/.../memory/project_portfolio.md`. This file is a current-state snapshot of the dependency stack with deprecation flags and action items.

## Action items surfaced by audit

1. **Rename `middleware.ts` → `proxy.ts`.** Next.js 16 deprecated the `middleware.ts` filename. The untracked `middleware.ts` in git status should be renamed before commit. Same API, only the filename changed.
2. **Plan doc says Contentlayer; actual install is Velite.** Contentlayer is abandoned (maintainer publicly stepped back; stuck on pre-Next-13 deps). Velite is the correct call. Update the plan doc to match reality so future Claude sessions don't re-introduce Contentlayer.
3. **Verify no sync `params` / `searchParams` / `cookies()` / `headers()` access** in App Router code. Next 16 fully removed the sync variants — they now throw, not warn.
4. **Check `next.config.ts` for a `webpack()` block.** Turbopack is the default builder in Next 16; custom webpack config breaks the build unless you pass `--webpack` to `next build`.
5. **`next lint` was removed.** If CI calls it, swap to `eslint` or Biome directly.

## Stack status — May 2026

| Tech | Installed | Current | Status | Notes |
|---|---|---|---|---|
| Next.js | ^16.0.0 | 16.2.6 | Active | Turbopack now default; middleware.ts → proxy.ts; React Compiler stable behind `reactCompiler: true` |
| React / React DOM | ^19.0.0 | 19.2 | Active | Ships native `startViewTransition` hook; reconciler version bump is what R3F 9.5+ addresses |
| @react-three/fiber | ^9.6.1 | 9.6.1 | Active | R3F v10 alpha exists (WebGPU + new scheduler) — don't adopt yet |
| @react-three/drei | ^10.7.7 | 10.x | Active | React 19 compatibility issues from 2024 are resolved |
| three | ^0.184.0 | 0.184.0 | Active | WebGPURenderer production-ready since r171 (Sept 2025) |
| gsap + @gsap/react | ^3.15.0 | 3.x | Active | **License changed 2025-04-30: GSAP + all former Club plugins (ScrollTrigger, MorphSVG, etc.) are 100% free for commercial use under Webflow ownership.** Only restriction is competing no-code builders. |
| Motion (was Framer Motion) | not yet installed | 12.x | Active | Package is now `motion` on npm; import from `motion/react`. Independent of Framer. Do NOT install `framer-motion` — wrong package. |
| Velite | ^0.3.1 | 0.3.x | Active | Replaces Contentlayer. Zod-validated, type-safe MDX/MD/YAML/JSON layer. |
| ~~Contentlayer~~ | — | — | **Deprecated / abandoned** | Don't reintroduce. Velite is the migration target. |
| TypeScript | ^5.6.0 | 5.8.x (5.9 RC) | Active | Safe to bump to 5.8; non-breaking |
| Vercel | — | — | Active | Build Adapters API (alpha) reduces lock-in long-term, but Vercel is still the zero-config target |
| Plausible | — | CE v2.2 | Active | AGPL-3.0; CE lacks Funnels / GA4 import / SSO (cloud-only) |
| detect-gpu | not yet installed | 5.0.70 | **Sustainability risk** | gfxbench.com (upstream benchmark source) stopped updating Dec 2025. Existing entries still accurate; new GPUs won't be scored. pmndrs exploring alternatives. Have a manual fallback path. |
| lygia (GLSL) | not yet installed | 1.4.1 | Active | Multi-language (GLSL/HLSL/WGSL/Metal) |
| View Transitions API | browser | — | Chromium + Safari 18+ + Firefox 144+ | Same-doc transitions broadly available; cross-doc partial. Wrap in feature-detect; keep Motion as fallback. Next 16 has `viewTransition: true` flag (experimental). |

## Ecosystem flags

- **React Compiler is stable.** Opt-in via `reactCompiler: true` in `next.config.ts`. Likely removes the need for most manual `useMemo`/`useCallback` — worth trying once Phase 1 is past Robin study.
- **Node minimum is 20.9+** for Next 16. Node 18 is dropped.
- **R3F v10 (WebGPU)** is alpha. Don't gate the portfolio on it; revisit during Phase 4 polish if stable by then.

## Sources

Audit was a web research pass against official release blogs (Next.js, React, R3F, GSAP/Webflow, Motion, Three.js, Plausible) and npm/GitHub for version + maintenance status. Re-run when starting a new phase or if a release candidate of any pinned dep drops.
