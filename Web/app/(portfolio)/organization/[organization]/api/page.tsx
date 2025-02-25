import { OrganizationSettings } from "@/components/organization-settings";
import { Request } from "@/components/request";
import { Header } from "@/components/ui/header";
import { API_ENDPOINT } from "@/lib/constants";
import { getOrganization } from "@/lib/server/utils";
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

  const org = await getOrganization(organizationId);

  if (!org.success) {
    notFound();
  }

  const { data: orgData } = org;

  return (
    <>
      <Header
        title={orgData?.organization?.title}
        slug={orgData?.organization?.slug}
      >
        <OrganizationSettings />
      </Header>
      <Request endpoint={endpoint} code={javascript} />
    </>
  );
}
