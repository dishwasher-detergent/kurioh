import { CreateProject } from "@/components/create-project";
import { OrganizationSettings } from "@/components/organization-settings";
import ProjectCard from "@/components/project-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { getOrganization, getProjects } from "@/lib/server/utils";

import { notFound } from "next/navigation";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const org = await getOrganization(organizationId);
  const { data: projectData } = await getProjects(organizationId);

  if (org?.errors) {
    notFound();
  }

  const { data: orgData } = org;

  return (
    <>
      <Header
        title={orgData?.organization.title}
        slug={orgData?.organization?.slug}
      >
        <OrganizationSettings />
      </Header>
      <section className="min-h-full columns-xs items-start gap-4 space-y-4">
        {projectData && projectData.length > 0 && (
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
        {projectData &&
          projectData.map((x) => <ProjectCard key={x.$id} {...x} />)}
        {!projectData && (
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
    </>
  );
}
