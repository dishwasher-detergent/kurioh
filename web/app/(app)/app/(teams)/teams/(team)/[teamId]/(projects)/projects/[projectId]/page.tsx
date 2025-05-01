import { redirect } from "next/navigation";

import EditProject from "@/components/project/edit-project";
import { ProjectActions } from "@/components/project/project-actions";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
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
      {data.published && <Badge className="mb-4">Published</Badge>}
      <PageHeader
        title={data.name}
        description="Describe your project and its goals."
      >
        <ProjectActions project={data} />
      </PageHeader>
      <EditProject project={data} teamId={teamId} />
    </>
  );
}
