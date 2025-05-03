import { EditProjectSkeleton } from "@/components/loading/edit-project-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-4 h-6 w-16" />
      <PageHeader
        title="Loading project..."
        description="Describe your project and its goals."
      >
        <div className="flex flex-row items-start gap-2">
          <Skeleton className="h-8 w-8" />
        </div>
      </PageHeader>
      <EditProjectSkeleton />
    </>
  );
}
