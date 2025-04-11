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

  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">{data.name}</h2>
        <p className="text-sm font-semibold">
          Describe your project and its goals.
        </p>
      </header>
      <EditProject project={data} teamId={teamId} />
    </>
  );
}
