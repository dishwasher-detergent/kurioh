import { redirect } from "next/navigation";

import { Project } from "@/components/realtime/project";
import { getLoggedInUser } from "@/lib/auth";
import { getProjectById } from "@/lib/db";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { data, success } = await getProjectById(projectId);

  if (!success || !data) {
    redirect("/app");
  }

  const user = await getLoggedInUser();
  const isOwnProject = user?.$id === data?.userId;

  return <Project initialProject={data} canEdit={isOwnProject} />;
}
