import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ui/project/card";
import { ProjectEmpty } from "@/components/ui/project/empty";
import { Portfolios } from "@/interfaces/portfolios";
import {
  ENDPOINT,
  PORTFOLIO_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECT_ID,
  database_service,
} from "@/lib/appwrite";

async function fetchProjects(port_slug: string) {
  const response = await database_service.get<Portfolios>(
    PORTFOLIO_COLLECTION_ID,
    port_slug,
  );

  return response.projects;
}

export default async function Projects({
  params,
}: {
  params: { slug: string; port_slug: string };
}) {
  const { port_slug } = params;
  const projects = await fetchProjects(port_slug);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex flex-row items-center gap-2 text-2xl font-bold">
        Projects
        <Badge variant="secondary">{projects.length}</Badge>
      </h3>
      {projects.length === 0 && <ProjectEmpty />}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
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
