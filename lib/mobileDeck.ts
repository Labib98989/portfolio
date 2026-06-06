import { PROJECTS, type Project } from "./projects";

// The mobile deck is the work wheel turned into a vertical card stack, with
// two identity end-caps: About sits above the first chapter, Currently sits
// below the last. About/Currently aren't in PROJECTS (they're not "work"), so
// they get their own riso-palette themes here — teal for About, coral for
// Currently, both on the system Riso-Black ground. Matches AboutPage /
// CurrentlyWorkingPage accents so the detail page feels native on arrival.

const RISO_BLACK = "#22201d";
const FG_LIGHT = "#efefec";

export type AboutItem = {
  kind: "about";
  hash: "about";
  href: "/about";
  meta: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
  bg: string;
  bgSecondary: string;
  fg: string;
  shadow: string;
};

export type CurrentlyItem = {
  kind: "currently";
  hash: "currently";
  href: "/currently-working";
  meta: string;
  overline: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
  bg: string;
  bgSecondary: string;
  fg: string;
  shadow: string;
};

export type ProjectItem = {
  kind: "project";
  hash: string; // slug, used for the shallow #deep-link
  href: string; // /projects/<slug>
  chapter: number; // 1-based — drives the glyph + "NN / 09" label
  total: number;
  project: Project;
};

export type DeckItem = AboutItem | ProjectItem | CurrentlyItem;

const ABOUT: AboutItem = {
  kind: "about",
  hash: "about",
  href: "/about",
  meta: "About · the person behind the work",
  title: "Labib Karim",
  subtitle:
    "Currently obsessed with applied AI. Also writes game engines, breaks sandboxes, and squeezes 10k users out of free tiers.",
  cta: "Read the full bio",
  accent: "#8FB3C0", // soft Riso teal — matches AboutPage
  bg: RISO_BLACK,
  bgSecondary: "#2A3133",
  fg: FG_LIGHT,
  shadow: RISO_BLACK,
};

const CURRENTLY: CurrentlyItem = {
  kind: "currently",
  hash: "currently",
  href: "/currently-working",
  meta: "Currently working · architecture phase",
  overline: "Now",
  title: "OmniCare",
  subtitle: "The companion that follows the patient, not the file.",
  cta: "See the architecture",
  accent: "#D9A89C", // warm coral — matches CurrentlyWorkingPage
  bg: RISO_BLACK,
  bgSecondary: "#32292A",
  fg: FG_LIGHT,
  shadow: RISO_BLACK,
};

// [ About, ...9 chapters, Currently ] — the full vertical spine.
export function buildDeckItems(): DeckItem[] {
  const total = PROJECTS.length;
  const chapters: ProjectItem[] = PROJECTS.map((project, i) => ({
    kind: "project",
    hash: project.slug,
    href: `/projects/${project.slug}`,
    chapter: i + 1,
    total,
    project,
  }));
  return [ABOUT, ...chapters, CURRENTLY];
}
