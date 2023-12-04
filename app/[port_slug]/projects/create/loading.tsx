import { ProjectFormLoading } from "@/components/form/loading/project";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectsCreateLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Skeleton className="h-8 w-1/2" />
      </div>
      <ProjectFormLoading title="Create" />
    </div>
  );
}
