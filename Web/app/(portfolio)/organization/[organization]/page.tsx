import { ListProjects } from "@/components/list-projects";
import { OrganizationSettings } from "@/components/organization-settings";
import { SetOrganization } from "@/components/set-organization";
import { Header } from "@/components/ui/header";
import { Organization } from "@/interfaces/organization.interface";
import { DATABASE_ID, ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
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

    return org;
  } catch {
    notFound();
  }
}

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const organization = await validateOrganization(organizationId);

  return (
    <>
      <Header title={organization?.title} slug={organization?.slug}>
        <OrganizationSettings />
      </Header>
      <ListProjects />
      <SetOrganization {...organization} />
    </>
  );
}
