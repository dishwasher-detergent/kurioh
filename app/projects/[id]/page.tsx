import { CreateProjectForm } from "@/components/form/project";

export default function ProjectsCreate({ params }: { params: { id: string } }) {
  return (
    <div>
      Projects Create {params.id}
      <CreateProjectForm />
    </div>
  );
}
