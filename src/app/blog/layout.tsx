import { SiteShell } from "@/site-shell/SiteShell";

export default function BlogSectionLayout({ children }: LayoutProps<"/blog">) {
  return <SiteShell section="blog">{children}</SiteShell>;
}
