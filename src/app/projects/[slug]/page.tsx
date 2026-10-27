import { notFound } from "next/navigation";

import { projects } from "#site/content";
import { adjacentItems } from "@/content/adjacent-items";
import { MdxContent } from "@/content/MdxContent";
import { ArchitectureDiagram } from "@/projects/ArchitectureDiagram";
import { FactsGrid } from "@/projects/FactsGrid";
import { MetricCards } from "@/projects/MetricCards";
import { caseStudies } from "@/projects/project-queries";
import { ScreenshotFrame } from "@/projects/ScreenshotFrame";
import { sectionPath } from "@/routing/site-urls";
import { BackLink } from "@/ui/BackLink";
import { ButtonLink } from "@/ui/ButtonLink";
import { PrevNextLinks } from "@/ui/PrevNextLinks";

export function generateStaticParams() {
  return caseStudies(projects).map((project) => ({ slug: project.slug }));
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const studies = caseStudies(projects);
  const project = studies.find((study) => study.slug === slug);
  if (!project) {
    notFound();
  }

  const { previous, next } = adjacentItems(studies, slug);
  const caseStudyLink = (
    title: string,
    neighbourSlug: string,
    label: string,
  ) => ({
    label,
    title,
    href: sectionPath("projects", `/${neighbourSlug}`),
  });

  return (
    <article>
      <BackLink href={sectionPath("projects")}>← All projects</BackLink>
      <h1 className="mt-4 text-[clamp(1.9rem,5vw,2.6rem)] tracking-[-0.015em]">
        {project.tagline
          ? `${project.title}: ${project.tagline}`
          : project.title}
      </h1>
      <p className="text-muted mt-3 text-[1.08rem]">{project.summary}</p>
      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl && (
            <ButtonLink href={project.liveUrl} variant="primary">
              Live site ↗
            </ButtonLink>
          )}
          {project.repoUrl && (
            <ButtonLink href={project.repoUrl}>Source code ↗</ButtonLink>
          )}
        </div>
      )}
      <FactsGrid project={project} />
      <ScreenshotFrame />
      <div className="article-prose">
        <MdxContent
          code={project.content}
          components={{
            ArchitectureDiagram: () => (
              <ArchitectureDiagram nodes={project.architecture} />
            ),
            MetricCards: () => <MetricCards metrics={project.metrics} />,
          }}
        />
      </div>
      <PrevNextLinks
        previous={
          previous && caseStudyLink(previous.title, previous.slug, "Previous")
        }
        next={next && caseStudyLink(next.title, next.slug, "Next")}
      />
    </article>
  );
}
