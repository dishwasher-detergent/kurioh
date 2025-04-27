import { EditInformationSkeleton } from "@/components/loading/edit-information-skeleton";
import { PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader title="Details" description="Basic portfolio information." />
      <EditInformationSkeleton />
    </>
  );
}
