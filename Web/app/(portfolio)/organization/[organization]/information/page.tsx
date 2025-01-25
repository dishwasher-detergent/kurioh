import InformationForm from "@/components/forms/information/form";
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
import { createSessionClient } from "@/lib/server/appwrite";
import { getOrganization } from "@/lib/shared";

import { notFound } from "next/navigation";

export default async function OrganizationInformation({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const { database } = await createSessionClient();
  const org = await getOrganization(organizationId, database);

  if (!org) {
    notFound();
  }

  const { information, organization } = org;

  return (
    <>
      <Header title={organization?.title} slug={organization?.slug}>
        <OrganizationSettings />
      </Header>
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
          <CardDescription>Basic portfolio information.</CardDescription>
        </CardHeader>
        <CardContent>
          <InformationForm {...information} />
        </CardContent>
      </Card>
      <SetOrganization {...organization} />
    </>
  );
}
