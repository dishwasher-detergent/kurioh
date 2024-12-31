import InformationForm from "@/components/forms/information/form";
import { OrganizationSettings } from "@/components/organization-settings";
import { SetOrganization } from "@/components/set-organization";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Information } from "@/interfaces/information.interface";
import { Organization } from "@/interfaces/organization.interface";
import {
  API_ENDPOINT,
  DATABASE_ID,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";

import { notFound } from "next/navigation";

async function validateOrganization(organizationId: string) {
  try {
    const { database } = await createSessionClient();
    const org = await database.getDocument<Organization>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
      organizationId,
    );

    if (!org) throw new Error("Missing organization.");

    const info = await database.getDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      organizationId,
    );

    return {
      organization: org,
      information: info,
    };
  } catch {
    notFound();
  }
}

export default async function OrganizationInformation({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const { organization, information } =
    await validateOrganization(organizationId);

  return (
    <main className="mx-auto min-h-full max-w-6xl p-4 px-4 md:px-8">
      <Header
        title={organization?.title}
        slug={organization?.slug}
        endpoint={`${API_ENDPOINT}/organizations/${organization?.$id}`}
      >
        <OrganizationSettings />
      </Header>
      <Card className="p-4">
        <CardContent>
          <InformationForm {...information} />
        </CardContent>
      </Card>
      <SetOrganization {...organization} />
    </main>
  );
}
