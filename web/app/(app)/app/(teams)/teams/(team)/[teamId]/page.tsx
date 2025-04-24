import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { AddProject } from "@/components/project/create-project";
import { Projects } from "@/components/realtime/projects";
import { TeamActions } from "@/components/team/team-actions";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { setLastVisitedTeam } from "@/lib/auth";
import { listProjectsByTeam } from "@/lib/db";
import { getCurrentUserRoles, getTeamById } from "@/lib/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const { data, success } = await getTeamById(teamId);

  if (!success || !data) {
    redirect("/app");
  }

  await setLastVisitedTeam(teamId);

  const { data: projectData } = await listProjectsByTeam(teamId, [
    Query.orderAsc("ordinal"),
  ]);

  const { data: roles } = await getCurrentUserRoles(teamId);

  const isOwner = roles!.includes(OWNER_ROLE);
  const isAdmin = roles!.includes(ADMIN_ROLE);

  return (
    <>
      <header className="mb-6 flex flex-row justify-between gap-4">
        <div>
          <h2 className="mb-1 text-xl font-bold">{data.name}</h2>
          <p className="text-sm font-semibold">
            All projects created in this team.
          </p>
        </div>
        <div className="flex flex-row items-start gap-2">
          <AddProject teamId={teamId} />
          <TeamActions team={data} isAdmin={isAdmin} isOwner={isOwner} />
        </div>
      </header>
      <Projects
        initialProjects={projectData?.documents ?? []}
        teamId={teamId}
      />
    </>
  );
}
