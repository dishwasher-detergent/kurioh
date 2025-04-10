"use client";

import { CreatorSkeleton } from "@/components/loading/creator-skeleton";
import { DescriptionSkeleton } from "@/components/loading/description-skeleton";
import { HeaderSkeleton } from "@/components/loading/header-skeleton";
import { ProjectCreator } from "@/components/project/project-creator";
import { ProjectDescription } from "@/components/project/project-description";
import { ProjectHeader } from "@/components/project/project-header";
import { useProject } from "@/hooks/useProject";
import { Project as ProjectType } from "@/interfaces/project.interface";

interface ProjectProps {
  initialProject: ProjectType;
  canEdit: boolean;
}

export function Project({ initialProject, canEdit }: ProjectProps) {
  const { project, loading } = useProject({ initialProject });

  if (loading)
    return (
      <article className="space-y-6">
        <HeaderSkeleton />
        <main className="px-4 space-y-6">
          <CreatorSkeleton />
          <DescriptionSkeleton />
        </main>
      </article>
    );

  return (
    <article className="space-y-6">
      <ProjectHeader project={project} canEdit={canEdit} />
      <main className="px-4 space-y-6">
        <ProjectCreator project={project} />
        <ProjectDescription project={project} />
      </main>
    </article>
  );
}
