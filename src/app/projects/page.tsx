import { projects } from "#site/content";
import { ProjectArchive } from "@/projects/ProjectArchive";
import { ProjectFilters } from "@/projects/ProjectFilters";
import { caseStudies } from "@/projects/project-queries";
import { sectionPath } from "@/routing/site-urls";
import { PageIntro } from "@/ui/PageIntro";
import { PageSection } from "@/ui/PageSection";

export default function ProjectsPage() {
  const cards = caseStudies(projects).map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    type: project.type,
    stack: project.stack,
    href: sectionPath("projects", `/${project.slug}`),
  }));

  return (
    <>
      <PageIntro
        eyebrow="Projects"
        title="Things I've built"
        intro="Case studies of my best work, plus an archive of everything else."
      />
      <ProjectFilters projects={cards} />
      <PageSection id="archive" title="Archive">
        <ProjectArchive projects={projects} />
      </PageSection>
    </>
  );
}
