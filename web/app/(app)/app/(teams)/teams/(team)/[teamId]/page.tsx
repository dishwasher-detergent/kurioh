import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { AddProject } from "@/components/project/create-project";
import { Projects } from "@/components/realtime/projects";
import { TeamActions } from "@/components/team/team-actions";
import { PageHeader } from "@/components/ui/page-header";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { setLastVisitedTeam } from "@/lib/auth";
import { listProjectsByTeam } from "@/lib/db";
import { getCurrentUserRoles, getTeamById } from "@/lib/team";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamId: string }>;
}): Promise<Metadata> {
  const { teamId } = await params;
  const { data, success } = await getTeamById(teamId);

  if (!success || !data) {
    return {};
  }

  return {
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name,
      description: data.description,
    },
    twitter: {
      title: data.name,
      description: data.description,
    },
  };
}

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
    Query.limit(5),
  ]);

  const { data: roles } = await getCurrentUserRoles(teamId);

  const isOwner = roles!.includes(OWNER_ROLE);
  const isAdmin = roles!.includes(ADMIN_ROLE);

  return (
    <>
      <PageHeader
        title={data.name}
        description="All projects created in this team."
      >
        <div className="flex flex-row items-start gap-2">
          <AddProject teamId={teamId} />
          <TeamActions team={data} isAdmin={isAdmin} isOwner={isOwner} />
        </div>
      </PageHeader>
      <Projects initialProjects={projectData} teamId={teamId} />
    </>
  );
}
