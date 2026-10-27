"use client";

import { useState } from "react";

import { FilterChips } from "@/ui/FilterChips";

import { ProjectCard } from "./ProjectCard";
import { projectTypes } from "./project-queries";

const ALL_TYPES = "All";

type FilterableProject = {
  slug: string;
  title: string;
  summary: string;
  type: string;
  stack: string[];
  href: string;
};

/** Every card is server-rendered, so the list is complete before (or without) JavaScript. */
export function ProjectFilters({
  projects,
}: {
  projects: FilterableProject[];
}) {
  const [selectedType, setSelectedType] = useState(ALL_TYPES);

  const visibleProjects =
    selectedType === ALL_TYPES
      ? projects
      : projects.filter((project) => project.type === selectedType);

  return (
    <>
      <FilterChips
        label="Filter projects by type"
        options={[ALL_TYPES, ...projectTypes(projects)]}
        selected={selectedType}
        onSelect={setSelectedType}
      />
      <div className="grid gap-4">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            href={project.href}
          />
        ))}
      </div>
    </>
  );
}
