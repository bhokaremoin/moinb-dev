import Link from "next/link";

import { site } from "@content/site";
import { type Section, sectionHref } from "@/routing/site-urls";

const FOOTER_LINK_CLASS = "no-underline hover:text-foreground";

export function SiteFooter({
  section,
  year,
}: {
  section: Section | undefined;
  year: number;
}) {
  return (
    <footer className="border-line border-t pt-7 pb-10">
      <div className="page-column text-muted flex flex-wrap justify-between gap-4 text-[0.85rem]">
        <span>
          © {year} {site.name} · {site.builtWith}
        </span>
        <span>
          <Link
            href={sectionHref("home", section, "/now")}
            className={FOOTER_LINK_CLASS}
          >
            /now
          </Link>
          {" · "}
          <Link
            href={sectionHref("home", section, "/uses")}
            className={FOOTER_LINK_CLASS}
          >
            /uses
          </Link>
          {" · "}
          <a
            href={sectionHref("blog", section, "/rss.xml")}
            className={FOOTER_LINK_CLASS}
          >
            RSS
          </a>
          {" · "}
          <a href={site.socials.github} className={FOOTER_LINK_CLASS}>
            GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
