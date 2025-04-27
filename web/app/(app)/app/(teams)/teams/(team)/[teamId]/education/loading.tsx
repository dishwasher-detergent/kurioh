import { EditEducationSkeleton } from "@/components/loading/edit-education-skeleton";
import { PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Education"
        description="Add your education details to showcase your academic background."
      />
      <EditEducationSkeleton />
    </>
  );
}
