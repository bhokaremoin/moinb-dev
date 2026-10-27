import { TagList } from "@/ui/TagList";

import { ProjectThumbnail } from "./ProjectThumbnail";

type CardProject = { title: string; summary: string; stack: string[] };

export function ProjectCard({
  project,
  href,
}: {
  project: CardProject;
  href: string;
}) {
  return (
    <article>
      <a
        href={href}
        className="border-line bg-surface hover:border-accent grid gap-[18px] rounded-[10px] border p-4 no-underline transition-[border-color,transform] duration-200 hover:-translate-y-0.5 sm:grid-cols-[150px_1fr]"
      >
        <div className="max-sm:hidden">
          <ProjectThumbnail />
        </div>
        <div className="min-w-0">
          <h3 className="text-[1.15rem]">{project.title}</h3>
          <p className="text-muted mt-1.5 mb-2.5 text-[0.95rem]">
            {project.summary}
          </p>
          <TagList tags={project.stack} />
        </div>
      </a>
    </article>
  );
}
