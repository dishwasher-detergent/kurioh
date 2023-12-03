import { ProjectFormLoading } from "@/components/form/loading/project";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-semibold text-slate-600">Project</p>
        <Skeleton className="h-8 w-1/2" />
      </div>
      <ProjectFormLoading title="Edit" />
    </div>
  );
}
