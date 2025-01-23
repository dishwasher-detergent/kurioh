import { Request } from "@/components/request";
import { API_ENDPOINT } from "@/lib/constants";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const { organization: organizationId } = await params;
  const endpoint = `${API_ENDPOINT}/organizations/${organizationId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;

  return <Request endpoint={endpoint} code={javascript} />;
}
