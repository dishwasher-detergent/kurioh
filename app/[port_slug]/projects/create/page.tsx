import { CreateProjectForm } from "@/components/form/project";

export default async function ProjectsCreate({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div>
        <h3 className="pb-1 text-3xl font-bold">Create a Project</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Show off what you&apos;ve been working on!
        </p>
      </div>
      <CreateProjectForm />
    </div>
  );
}
