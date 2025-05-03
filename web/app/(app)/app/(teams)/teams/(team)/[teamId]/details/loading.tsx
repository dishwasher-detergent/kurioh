import { EditInformationSkeleton } from "@/components/loading/edit-information-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader title="Details" description="Basic portfolio information.">
        <Skeleton className="h-8 w-8" />
      </PageHeader>
      <EditInformationSkeleton />
    </>
  );
}
