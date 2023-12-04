import { CreateProjectForm } from "@/components/form/project";

export default function ProjectsCreate({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Projects</h3>
      <CreateProjectForm />
    </div>
  );
}
