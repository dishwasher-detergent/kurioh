"use client";

import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";
import { ProjectCard } from "@/components/project/project-card";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/interfaces/project.interface";

interface ProjectsProps {
  initialProjects?: Project[];
  teamId?: string;
  userId?: string;
}

export function Projects({ initialProjects, teamId, userId }: ProjectsProps) {
  const { loading, projects } = useProjects({
    initialProjects,
    teamId,
    userId,
  });

  if (loading) return <MultiCardSkeleton />;

  return (
    <section className="min-h-full columns-xs items-start gap-4 space-y-4">
      {projects?.map((project) => (
        <ProjectCard key={project.$id} {...project} />
      ))}
      {projects?.length === 0 && (
        <p className="text-muted-foreground font-semibold">No projects found</p>
      )}
    </section>
  );
}
