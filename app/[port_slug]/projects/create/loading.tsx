import { ProjectFormLoading } from "@/components/form/loading/project";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectsCreateLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div>
        <Skeleton className="h-8 w-1/2" />
      </div>
      <ProjectFormLoading title="Create" />
    </div>
  );
}
