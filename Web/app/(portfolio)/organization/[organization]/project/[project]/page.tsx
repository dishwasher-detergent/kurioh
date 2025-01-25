import ProjectForm from "@/components/forms/project/form";
import { SetOrganization } from "@/components/set-organization";
import { SetProject } from "@/components/set-project";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { createSessionClient } from "@/lib/server/appwrite";
import { getOrganization, getProject } from "@/lib/shared";

import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string; organization: string }>;
}) {
  const { project: projectId, organization: organizationId } = await params;
  const { database } = await createSessionClient();
  const org = await getOrganization(organizationId, database);
  const project = await getProject(projectId, database);

  if (!org || !project) {
    notFound();
  }

  const { organization } = org;

  return (
    <>
      <Header title={project?.title} slug={project?.slug} />
      <Card>
        <CardContent className="p-4">
          <ProjectForm {...project} />
        </CardContent>
      </Card>
      <SetProject {...project} />
      <SetOrganization {...organization} />
    </>
  );
}
