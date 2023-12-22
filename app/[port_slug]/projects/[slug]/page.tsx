import { CreateProjectForm } from "@/components/form/project";
import { Projects } from "@/interfaces/projects";
import { PROJECTS_COLLECTION_ID, database_service } from "@/lib/appwrite";
import { Query } from "appwrite";

async function fetchProject(slug: string) {
  const response = await database_service.list<Projects>(
    PROJECTS_COLLECTION_ID,
    [Query.equal("slug", slug)],
  );

  return response;
}

export default async function ProjectsCreate({
  params,
}: {
  params: { slug: string; port_slug: string };
}) {
  const { slug, port_slug } = params;
  const project = await fetchProject(slug);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-semibold text-slate-600 dark:text-slate-300">
          Project
        </p>
        <h3 className="text-2xl font-bold">{slug}</h3>
      </div>
      <CreateProjectForm title="Edit" data={project.documents[0]} />
    </div>
  );
}
