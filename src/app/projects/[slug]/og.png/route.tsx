import { notFound } from "next/navigation";

import { projects } from "#site/content";
import { caseStudies } from "@/projects/project-queries";
import { renderOgCard } from "@/seo/og-card";

export function generateStaticParams() {
  return caseStudies(projects).map((project) => ({ slug: project.slug }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/projects/[slug]/og.png">,
) {
  const { slug } = await params;
  const project = caseStudies(projects).find((study) => study.slug === slug);
  if (!project) {
    notFound();
  }
  return renderOgCard({
    eyebrow: `Case study · ${project.type}`,
    title: project.title,
    summary: project.summary,
  });
}
