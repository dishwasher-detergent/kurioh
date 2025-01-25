import { ListProjects } from "@/components/list-projects";
import { OrganizationSettings } from "@/components/organization-settings";
import { SetOrganization } from "@/components/set-organization";
import { Header } from "@/components/ui/header";
import { createSessionClient } from "@/lib/server/appwrite";
import { getOrganization } from "@/lib/shared";

import { notFound } from "next/navigation";

export default async function OrganizationPage({
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

  const { organization } = org;

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
