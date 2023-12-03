import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project/card";
import { Projects } from "@/interfaces/projects";
import {
  ENDPOINT,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  PROJECT_ID,
  database_service,
} from "@/lib/appwrite";
import { LucideGhost } from "lucide-react";
import Link from "next/link";

async function fetchProjects() {
  const response = await database_service.list<Projects>(
    PROJECTS_COLLECTION_ID,
  );

  return response;
}

export default async function Projects() {
  const projects = await fetchProjects();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex flex-row items-center gap-2 text-2xl font-bold">
        Projects
        <Badge variant="secondary">{projects.total}</Badge>
      </h3>
      {projects.documents.length === 0 && (
        <div className="space-y-4 rounded-lg border bg-slate-100 p-4">
          <p className="flex flex-row items-center text-sm font-semibold text-slate-500">
            <LucideGhost className="mr-2 h-4 w-4" />
            No Projects!
          </p>
          <Button asChild>
            <Link href="/projects/create">Create one here!</Link>
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {projects.documents.map((project) => (
          <ProjectCard
            key={project.$id}
            id={project.$id}
            slug={project.slug}
            title={project.title}
            description={project.short_description}
            badges={project.tags}
            websites={project.links}
            images={project.images.map(
              (x) =>
                `${ENDPOINT}/storage/buckets/${PROJECTS_BUCKET_ID}/files/${x}/view?project=${PROJECT_ID}`,
            )}
          />
        ))}
      </div>
    </div>
  );
}
