import { SiteShell } from "@/site-shell/SiteShell";

export default function ProjectsSectionLayout({
  children,
}: LayoutProps<"/projects">) {
  return <SiteShell section="projects">{children}</SiteShell>;
}
