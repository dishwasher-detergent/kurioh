import { setLastVisitedOrganization } from "@/lib/server/utils";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ organization: string }>;
}>) {
  const { organization: organizationId } = await params;

  if (organizationId) {
    await setLastVisitedOrganization(organizationId);
  }

  return children;
}
