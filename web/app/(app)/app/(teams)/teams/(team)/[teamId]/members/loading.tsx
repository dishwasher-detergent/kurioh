import { TeamMembersSkeleton } from "@/components/loading/team-members-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader title="Members" description="All members of this team.">
        <Skeleton className="size-8" />
      </PageHeader>
      <TeamMembersSkeleton />
    </>
  );
}
