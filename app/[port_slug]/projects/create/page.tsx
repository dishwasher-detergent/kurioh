import { CreateProjectForm } from "@/components/form/project";

export default async function ProjectsCreate({
  params,
}: {
  params: { id: string };
}) {
  return <CreateProjectForm />;
}
