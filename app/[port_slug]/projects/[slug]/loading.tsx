import { ProjectFormLoading } from "@/components/form/loading/project";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div>
        <p className="font-semibold text-slate-600 dark:text-slate-300">
          Project
        </p>
        <Skeleton className="h-8 w-1/2" />
      </div>
      <ProjectFormLoading title="Edit" />
    </div>
  );
}
