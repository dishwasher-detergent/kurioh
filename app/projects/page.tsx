import { ProjectCard } from "@/components/ui/project/card";
import { Projects } from "@/interfaces/projects";
import {
  ENDPOINT,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  PROJECT_ID,
  database_service,
} from "@/lib/appwrite";

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
      <h3 className="text-2xl font-bold">Projects</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {projects.documents.map((project) => (
          <ProjectCard
            key={project.$id}
            id={project.$id}
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
