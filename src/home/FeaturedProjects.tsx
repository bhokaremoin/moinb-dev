import { projects } from "#site/content";
import { ProjectCard } from "@/projects/ProjectCard";
import { featuredProjects } from "@/projects/project-queries";
import { sectionHref } from "@/routing/site-urls";
import { MoreLink } from "@/ui/MoreLink";
import { PageSection } from "@/ui/PageSection";

export function FeaturedProjects() {
  return (
    <PageSection id="featured-projects" title="Featured projects">
      <div className="grid gap-4">
        {featuredProjects(projects).map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            href={sectionHref("projects", "home", `/${project.slug}`)}
          />
        ))}
      </div>
      <MoreLink href={sectionHref("projects", "home")}>
        All projects on projects.moinb.dev →
      </MoreLink>
    </PageSection>
  );
}
