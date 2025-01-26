import ProjectForm from "@/components/forms/project/form";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { getOrganization, getProject } from "@/lib/server/utils";

import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string; organization: string }>;
}) {
  const { project: projectId, organization: organizationId } = await params;
  const org = await getOrganization(organizationId);
  const project = await getProject(projectId);

  if (org.errors || project.errors) {
    notFound();
  }

  const { data } = org;
  const { data: projectData } = project;

  return (
    <>
      <Header title={projectData?.title} slug={projectData?.slug} />
      <Card>
        <CardContent className="p-4">
          <ProjectForm {...projectData} orgId={data.organization.$id} />
        </CardContent>
      </Card>
    </>
  );
}
