"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Active chapter index lives above the route boundary so navigating away
// from "/" (to /about, /currently-working, or /projects/[slug]) and back
// resumes on the same chapter instead of resetting to 0.
//
// The provider is mounted in app/layout.tsx, which App Router preserves
// across page navigations — so this state survives a route change without
// touching storage. First load defaults to chapter 0.

type Ctx = {
  chapterIdx: number;
  setChapterIdx: (i: number) => void;
};

const ChapterStateContext = createContext<Ctx | null>(null);

export function ChapterStateProvider({ children }: { children: ReactNode }) {
  const [chapterIdx, setChapterIdxRaw] = useState(0);
  const setChapterIdx = useCallback(
    (i: number) => setChapterIdxRaw(i),
    [],
  );
  return (
    <ChapterStateContext.Provider value={{ chapterIdx, setChapterIdx }}>
      {children}
    </ChapterStateContext.Provider>
  );
}

export function useChapterState() {
  const ctx = useContext(ChapterStateContext);
  if (!ctx) {
    throw new Error(
      "useChapterState must be used inside <ChapterStateProvider>",
    );
  }
  return ctx;
}
