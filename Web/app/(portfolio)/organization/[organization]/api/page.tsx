import { OrganizationSettings } from "@/components/organization-settings";
import { Request } from "@/components/request";
import { Header } from "@/components/ui/header";
import { API_ENDPOINT } from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { getOrganization } from "@/lib/shared";
import { notFound } from "next/navigation";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;

  const endpoint = `${API_ENDPOINT}/organizations/${organizationId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;

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
      <Request endpoint={endpoint} code={javascript} />
    </>
  );
}
