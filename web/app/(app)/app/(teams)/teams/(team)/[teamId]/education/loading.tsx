import { EditExperienceSkeleton } from "@/components/loading/edit-experience-skeleton";
import { PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Education"
        description="Add your education details to showcase your academic background."
      />
      <EditExperienceSkeleton />
    </>
  );
}
