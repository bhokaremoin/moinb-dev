import { SiteShell } from "@/site-shell/SiteShell";

export default function HomeSectionLayout({ children }: LayoutProps<"/">) {
  return <SiteShell section="home">{children}</SiteShell>;
}
