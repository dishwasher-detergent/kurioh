import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ui/project/card";
import { CreateProject } from "@/components/ui/project/create";
import { ProjectEmpty } from "@/components/ui/project/empty";
import { Portfolios } from "@/interfaces/portfolios";
import { database_service } from "@/lib/appwrite";
import {
  ENDPOINT,
  PORTFOLIO_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECT_ID,
} from "@/lib/constants";

async function fetchProjects(port_slug: string) {
  try {
    const response = await database_service.get<Portfolios>(
      PORTFOLIO_COLLECTION_ID,
      port_slug,
    );

    return response.projects;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Projects({
  params,
}: {
  params: { slug: string; port_slug: string };
}) {
  const { port_slug } = params;
  const projects = await fetchProjects(port_slug);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="py-4">
        <h3 className="flex flex-row items-center gap-2 text-2xl font-bold">
          Projects
          <Badge variant="secondary">{projects?.length ?? 0}</Badge>
        </h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          All your cherished projects in one place.
        </p>
      </header>
      {(projects?.length === 0 || !projects) && <ProjectEmpty />}
      {projects && projects?.length > 0 && <CreateProject />}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {projects?.map((project) => (
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
      </section>
    </div>
  );
}

export const revalidate = 0; // revalidate at most every hour
