import { redirect } from "next/navigation";

import EditProject from "@/components/project/edit-project";
import { getProjectById } from "@/lib/db";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ teamId: string; projectId: string }>;
}) {
  const { projectId, teamId } = await params;
  const { data, success } = await getProjectById(projectId);

  if (!success || !data) {
    redirect("/app");
  }

  return <EditProject project={data} teamId={teamId} />;
}
