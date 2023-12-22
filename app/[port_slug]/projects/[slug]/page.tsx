import { CreateProjectForm } from "@/components/form/project";
import { BreadCrumb } from "@/components/ui/breadcrumb";
import { Projects } from "@/interfaces/projects";
import { PROJECTS_COLLECTION_ID, database_service } from "@/lib/appwrite";
import { Query } from "appwrite";
import { redirect } from "next/navigation";

async function fetchProject(port_slug: string, slug: string) {
  try {
    const response = await database_service.list<Projects>(
      PROJECTS_COLLECTION_ID,
      [Query.equal("slug", slug)],
    );

    if (response.documents.length === 0) throw new Error("Project not found");

    return response;
  } catch (err) {
    redirect(`/${port_slug}/projects`);
  }
}

export default async function ProjectsCreate({
  params,
}: {
  params: { slug: string; port_slug: string };
}) {
  const { slug, port_slug } = params;
  const project = await fetchProject(port_slug, slug);

  return (
    <div className="flex flex-col gap-4">
      <BreadCrumb />
      <div>
        <h3 className="pb-1 text-3xl font-bold capitalize">Edit {slug}</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Edit your project to make it even better!
        </p>
      </div>
      <CreateProjectForm title="Edit" data={project.documents[0]} />
    </div>
  );
}
