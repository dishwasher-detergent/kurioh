import { ProjectFormLoading } from "@/components/form/loading/project";
import { Header } from "@/components/ui/header";

export default async function ProjectsCreateLoading() {
  return (
    <Header
      title="Create a Project"
      description="Show off what you've been working on!"
    >
      <ProjectFormLoading title="Create" />
    </Header>
  );
}
