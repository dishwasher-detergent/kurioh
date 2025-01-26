import { CreateProject } from "@/components/create-project";
import { OrganizationSettings } from "@/components/organization-settings";
import ProjectCard from "@/components/project-card";
import { SetOrganization } from "@/components/set-organization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { createSessionClient } from "@/lib/server/appwrite";
import { getOrganization, getProjects } from "@/lib/shared";

import { notFound } from "next/navigation";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const { database } = await createSessionClient();
  const org = await getOrganization(organizationId, database);
  const projects = await getProjects(organizationId, database);

  if (!org) {
    notFound();
  }

  const { organization } = org;

  return (
    <>
      <Header title={organization?.title} slug={organization?.slug}>
        <OrganizationSettings />
      </Header>
      <section className="min-h-full columns-xs items-start gap-4 space-y-4">
        {projects && projects.length > 0 && (
          <Card className="break-inside-avoid-column overflow-hidden transition-all hover:border-primary hover:ring hover:ring-primary/10">
            <CardHeader>
              <CardDescription className="text-xs">Ooh Aah!</CardDescription>
              <CardTitle className="text-xl">Made something new?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex w-full">
                <CreateProject />
              </div>
            </CardContent>
          </Card>
        )}
        {projects && projects.map((x) => <ProjectCard key={x.$id} {...x} />)}
        {!projects && (
          <Card className="break-inside-avoid-column overflow-hidden transition-all hover:border-primary hover:ring hover:ring-primary/10">
            <CardHeader>
              <CardDescription className="text-xs">Uh oh!</CardDescription>
              <CardTitle className="text-xl">No Projects Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex w-full">
                <CreateProject />
              </div>
            </CardContent>
          </Card>
        )}
      </section>
      <SetOrganization {...organization} />
    </>
  );
}
