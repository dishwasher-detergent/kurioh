import { CreateProjectForm } from "@/components/form/project";
import { Projects } from "@/interfaces/projects";
import { PROJECTS_COLLECTION_ID, database_service } from "@/lib/appwrite";

async function fetchProject(slug: string) {
  console.log(slug);

  const response = await database_service.get<Projects>(
    PROJECTS_COLLECTION_ID,
    slug,
  );

  return response;
}

export default async function ProjectsCreate({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const project = await fetchProject(slug);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-semibold text-slate-600 dark:text-slate-300">
          Project
        </p>
        <h3 className="text-2xl font-bold">{slug}</h3>
      </div>
      <CreateProjectForm title="Edit" data={project} />
    </div>
  );
}
