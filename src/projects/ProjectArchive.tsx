import { yearOf } from "@/content/format-date";
import { sectionPath } from "@/routing/site-urls";

import { projectLink, sortProjectsByDate } from "./project-queries";

type ArchivedProject = Parameters<typeof projectLink>[0] & {
  title: string;
  stack: string[];
};

const HEADER_CELL =
  "border-b border-line py-2 pr-2 text-left font-mono text-[0.7rem] font-medium tracking-[0.08em] text-muted uppercase";
const BODY_CELL = "border-b border-line py-2.5 pr-2 align-top";

function ArchiveLink({ project }: { project: ArchivedProject }) {
  const link = projectLink(project);
  if (!link) {
    return null;
  }
  const href =
    link.kind === "case-study" ? sectionPath("projects", link.path) : link.href;
  return <a href={href}>{link.label}</a>;
}

export function ProjectArchive({ projects }: { projects: ArchivedProject[] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-[0.9rem]">
        <thead>
          <tr>
            <th className={HEADER_CELL}>Year</th>
            <th className={HEADER_CELL}>Project</th>
            <th className={HEADER_CELL}>Built with</th>
            <th className={HEADER_CELL}>Link</th>
          </tr>
        </thead>
        <tbody>
          {sortProjectsByDate(projects).map((project) => (
            <tr key={project.slug}>
              <td className={`${BODY_CELL} font-mono text-[0.8rem]`}>
                {yearOf(project.date)}
              </td>
              <td className={BODY_CELL}>{project.title}</td>
              <td className={`${BODY_CELL} text-muted`}>
                {project.stack.join(", ")}
              </td>
              <td className={BODY_CELL}>
                <ArchiveLink project={project} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
