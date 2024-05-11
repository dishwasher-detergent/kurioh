import { CreateProjectForm } from "@/components/form/project";
import { Projects } from "@/interfaces/projects";
import { database_service } from "@/lib/appwrite";
import { PROJECTS_COLLECTION_ID } from "@/lib/constants";
import { Query } from "appwrite";
import { redirect } from "next/navigation";

async function fetchProject(port_slug: string, slug: string) {
  try {
    const response = await database_service.list<Projects>(
      PROJECTS_COLLECTION_ID,
      [Query.equal("slug", slug)],
    );

    const project = response.documents.filter(
      (x) => x.portfolios.$id === port_slug,
    );

    if (!project) throw new Error("Project not found.");

    return project[0];
  } catch (err) {
    console.error(err);
    redirect(`/portfolio/${port_slug}/projects`);
  }
}

export default async function ProjectsCreate({
  params,
}: {
  params: { slug: string; port_slug: string };
}) {
  const { slug, port_slug } = params;
  const project = await fetchProject(port_slug, slug);

  return <CreateProjectForm title="Edit" data={project} />;
}
