import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Loading projects..."
        description="All projects created in this team."
      >
        <div className="flex flex-row items-start gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>
      </PageHeader>
      <Skeleton className="mb-4 h-8 max-w-80" />
      <MultiCardSkeleton />
    </>
  );
}
