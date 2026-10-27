import type { Metadata } from "next";

import { sectionUrl } from "@/routing/site-urls";
import { SiteShell } from "@/site-shell/SiteShell";

export const metadata: Metadata = { title: "Page not found · moinb.dev" };

// Unknown section slugs are rewritten here by the proxy, so links are absolute: the visitor
// may be on any subdomain.
export function NotFoundContent() {
  return (
    <>
      <p className="eyebrow">404</p>
      <h1 className="text-[clamp(1.9rem,5vw,2.6rem)]">Page not found</h1>
      <p className="text-muted mt-3">
        That page doesn&apos;t exist, or it has moved. Try one of these instead:
      </p>
      <ul className="mt-4 flex list-none gap-5 p-0">
        <li>
          <a href={sectionUrl("home")} className="text-accent">
            Home
          </a>
        </li>
        <li>
          <a href={sectionUrl("projects")} className="text-accent">
            Projects
          </a>
        </li>
        <li>
          <a href={sectionUrl("blog")} className="text-accent">
            Blog
          </a>
        </li>
      </ul>
    </>
  );
}

export default function NotFound() {
  return (
    <SiteShell section={undefined}>
      <NotFoundContent />
    </SiteShell>
  );
}
