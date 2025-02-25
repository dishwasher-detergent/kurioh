import {
  getOrganization,
  setLastVisitedOrganization,
} from "@/lib/server/utils";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ organization: string }>;
}>) {
  const { organization: organizationId } = await params;

  const org = await getOrganization(organizationId);

  if (org.success) {
    await setLastVisitedOrganization(organizationId);
  }

  return children;
}
