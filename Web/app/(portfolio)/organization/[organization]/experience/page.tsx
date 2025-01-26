import ExperienceForm from "@/components/forms/experience/form";
import { OrganizationSettings } from "@/components/organization-settings";
import { SetOrganization } from "@/components/set-organization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { getOrganization } from "@/lib/server/utils";

import { notFound } from "next/navigation";

export default async function OrganizationExperience({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const org = await getOrganization(organizationId);

  if (org.errors) {
    notFound();
  }

  const { data } = org;

  return (
    <>
      <Header title={data.organization?.title} slug={data.organization?.slug}>
        <OrganizationSettings />
      </Header>
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>
            Job, Volunteer, or Project Experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ExperienceForm experience={data.experience} />
        </CardContent>
      </Card>
      <SetOrganization {...data.organization} />
    </>
  );
}
