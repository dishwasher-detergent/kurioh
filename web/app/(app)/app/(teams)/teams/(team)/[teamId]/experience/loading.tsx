import { EditExperienceSkeleton } from "@/components/loading/edit-experience-skeleton";
import { PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Experience"
        description="Add Your Job, Volunteer, or Project Experience."
      />
      <EditExperienceSkeleton />
    </>
  );
}
