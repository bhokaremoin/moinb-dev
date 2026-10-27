import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { OG_IMAGE_SIZE } from "./page-metadata";

// The dark theme tokens: they read well as a thumbnail in both light and dark feeds.
const COLORS = {
  background: "#0f1115",
  foreground: "#e8eaf0",
  muted: "#949bab",
  accent: "#8fa3ff",
  line: "#262a33",
};

function loadFont(fileName: string): Promise<Buffer> {
  return readFile(join(process.cwd(), "src/seo/fonts", fileName));
}

/** A 1200×630 share card: an eyebrow (section), the page title and a one-line summary. */
export async function renderOgCard(card: {
  eyebrow: string;
  title: string;
  summary: string;
}): Promise<ImageResponse> {
  const [display, body, mono] = await Promise.all([
    loadFont("bricolage-grotesque-latin-700-normal.woff"),
    loadFont("ibm-plex-sans-latin-400-normal.woff"),
    loadFont("jetbrains-mono-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: COLORS.background,
        color: COLORS.foreground,
        fontFamily: "Plex",
        borderTop: `12px solid ${COLORS.accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "JetBrains",
          fontSize: 26,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.muted,
        }}
      >
        {card.eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontFamily: "Bricolage",
            fontSize: card.title.length > 48 ? 60 : 76,
            lineHeight: 1.1,
            letterSpacing: -1.5,
          }}
        >
          {card.title}
        </div>
        <div style={{ fontSize: 32, color: COLORS.muted, lineHeight: 1.4 }}>
          {card.summary}
        </div>
      </div>
      <div style={{ display: "flex", fontFamily: "Bricolage", fontSize: 32 }}>
        moin<span style={{ color: COLORS.accent }}>b</span>.dev
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: "Bricolage", data: display, weight: 700, style: "normal" },
        { name: "Plex", data: body, weight: 400, style: "normal" },
        { name: "JetBrains", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
