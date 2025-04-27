import { redirect } from "next/navigation";

import { TeamActions } from "@/components/team/team-actions";
import { TeamMembers } from "@/components/team/team-members";
import { PageHeader } from "@/components/ui/page-header";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { getCurrentUserRoles, getTeamById, listTeamMembers } from "@/lib/team";

export default async function TeamMembersPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const { data: team } = await getTeamById(teamId);
  const { data, success } = await listTeamMembers(teamId);

  if (!success || !data || !team) {
    redirect("/app");
  }

  const { data: roles } = await getCurrentUserRoles(teamId);

  const isOwner = roles!.includes(OWNER_ROLE);
  const isAdmin = roles!.includes(ADMIN_ROLE);

  return (
    <>
      <PageHeader title="Members" description="All members of this team.">
        <TeamActions team={team} isAdmin={isAdmin} isOwner={isOwner} />
      </PageHeader>
      <TeamMembers
        members={data ?? []}
        teamId={teamId}
        isOwner={isOwner}
        isAdmin={isAdmin}
      />
    </>
  );
}
