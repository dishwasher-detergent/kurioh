import { Request } from "@/components/request";
import { API_ENDPOINT } from "@/lib/constants";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ project: string; organization: string }>;
}) {
  const { project: projectId, organization: organizationId } = await params;

  const endpoint = `${API_ENDPOINT}/organizations/${organizationId}/projects/${projectId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;

  return <Request endpoint={endpoint} code={javascript} />;
}
