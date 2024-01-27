import { Header } from "@/components/ui/header";
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
    <Header
      title="Projects"
      description="All your cherished projects in one place."
      action={projects && projects?.length > 0 && <CreateProject />}
    >
      {(projects?.length === 0 || !projects) && <ProjectEmpty />}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
    </Header>
  );
}

export const revalidate = 0; // revalidate at most every hour
