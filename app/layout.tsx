import type { Metadata } from "next";
import { Caveat, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ChapterStateProvider } from "@/components/ChapterState";
import { TransitionShell } from "@/components/TransitionShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Labib Karim — Selected Works",
  description:
    "Portfolio of Labib Karim — applied AI, security, hardware, and the systems-level work behind them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <body>
        <ChapterStateProvider>
          <TransitionShell>{children}</TransitionShell>
        </ChapterStateProvider>
      </body>
    </html>
  );
}
