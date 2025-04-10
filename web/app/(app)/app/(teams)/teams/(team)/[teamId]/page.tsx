import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { Projects } from "@/components/realtime/projects";
import { listProjects } from "@/lib/db";
import { getTeamById } from "@/lib/team";

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

  const { data: projectData } = await listProjects([
    Query.orderDesc("$createdAt"),
    Query.equal("teamId", teamId),
  ]);

  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Projects</h2>
        <p className="text-sm font-semibold">
          All projects created in this team.
        </p>
      </header>
      <Projects
        initialProjects={projectData?.documents ?? []}
        teamId={teamId}
      />
    </>
  );
}
