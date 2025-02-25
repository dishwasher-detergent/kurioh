import InformationForm from "@/components/forms/information/form";
import { OrganizationSettings } from "@/components/organization-settings";
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

export default async function OrganizationInformation({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const org = await getOrganization(organizationId);

  if (!org.success) {
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
          <CardTitle>Information</CardTitle>
          <CardDescription>Basic portfolio information.</CardDescription>
        </CardHeader>
        <CardContent>
          <InformationForm
            {...data.information}
            orgId={data.organization.$id}
          />
        </CardContent>
      </Card>
    </>
  );
}
