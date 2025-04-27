import { EditInformationSkeleton } from "@/components/loading/edit-information-skeleton";
import { PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Information"
        description="Basic portfolio information."
      />
      <EditInformationSkeleton />
    </>
  );
}
