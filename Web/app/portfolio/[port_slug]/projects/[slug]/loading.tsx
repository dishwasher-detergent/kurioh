import { ProjectFormLoading } from "@/components/form/loading/project";
import { Header } from "@/components/ui/header";

export default async function ProjectsLoading() {
  return (
    <Header
      title={`Edit Project`}
      description="Edit your project to make it even better!"
    >
      <ProjectFormLoading title="Edit" />
    </Header>
  );
}
