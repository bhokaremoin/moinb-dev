import { site } from "@content/site";
import { renderOgCard } from "@/seo/og-card";

export function GET() {
  return renderOgCard({
    eyebrow: `${site.status} · ${site.location}`,
    title: `${site.headline.before}${site.headline.emphasis}${site.headline.after}`,
    summary: site.name,
  });
}
