import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  JetBrains_Mono,
} from "next/font/google";

import { site } from "@content/site";
import { buildThemeScript } from "@/theme/theme-script";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moinb.dev"),
  title: {
    default: `${site.name} · Full-stack developer`,
    template: "%s · moinb.dev",
  },
  description: "Portfolio and showcase of the applications Moin builds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme before React hydrates, so the attribute differs by design.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${plexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
