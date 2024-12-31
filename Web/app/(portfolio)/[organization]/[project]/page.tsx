import ProjectForm from "@/components/forms/project/form";
import { SetProject } from "@/components/set-project";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Organization } from "@/interfaces/organization.interface";
import { Project } from "@/interfaces/project.interface";
import {
  API_ENDPOINT,
  DATABASE_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";

import { notFound, redirect } from "next/navigation";

async function validateProject(projectId: string) {
  try {
    const { database } = await createSessionClient();
    const project = await database.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
    );

    return project;
  } catch {
    notFound();
  }
}

async function validateOrganization(organizationId: string) {
  try {
    const { database } = await createSessionClient();
    await database.getDocument<Organization>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
      organizationId,
    );
  } catch {
    redirect(`/${organizationId}`);
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string; organization: string }>;
}) {
  const { project: projectId, organization: organizationId } = await params;
  await validateOrganization(organizationId);
  const project = await validateProject(projectId);

  return (
    <>
      <main className="mx-auto max-w-6xl space-y-4 p-4 px-4 md:px-8">
        <Header
          title={project?.title}
          slug={project?.slug}
          endpoint={`${API_ENDPOINT}/organizations/${project?.organization_id}/projects/${project?.$id}`}
        />
        <Card>
          <CardContent className="p-4">
            <ProjectForm {...project} />
          </CardContent>
        </Card>
        <SetProject {...project} />
      </main>
    </>
  );
}
