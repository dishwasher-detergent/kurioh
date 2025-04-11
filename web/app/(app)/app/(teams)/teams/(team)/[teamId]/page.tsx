import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { Projects } from "@/components/realtime/projects";
import { TeamActions } from "@/components/team/team-actions";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { listProjects } from "@/lib/db";
import {
  getCurrentUserRoles,
  getTeamById,
  setLastVisitedTeam,
} from "@/lib/team";

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

  const { data: projectData } = await listProjects([
    Query.orderDesc("$createdAt"),
    Query.equal("teamId", teamId),
  ]);

  const { data: roles } = await getCurrentUserRoles(teamId);

  const isOwner = roles!.includes(OWNER_ROLE);
  const isAdmin = roles!.includes(ADMIN_ROLE);

  return (
    <>
      <header className="mb-6 flex flex-row justify-between">
        <div>
          <h2 className="font-bold text-xl mb-1">{data.name}</h2>
          <p className="text-sm font-semibold">
            All projects created in this team.
          </p>
        </div>
        <TeamActions team={data} isAdmin={isAdmin} isOwner={isOwner} />
      </header>
      <Projects
        initialProjects={projectData?.documents ?? []}
        teamId={teamId}
      />
    </>
  );
}
