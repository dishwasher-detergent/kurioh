import { Request } from "@/components/request";
import { API_ENDPOINT } from "@/lib/constants";
import { getProjectById } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ projectId: string; teamId: string }>;
}) {
  const { projectId, teamId } = await params;

  const endpoint = `${API_ENDPOINT}/organizations/${teamId}/projects/${projectId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;
  const model = `interface Project {
  id: string,
  organziation_id: string,
  title: string,
  slug: string,
  short_description: string,
  description: string,
  image_ids: string[],
  tags: string[],
  links: string[],
}`;

  const project = await getProjectById(projectId);

  if (!project.success) {
    notFound();
  }

  return <Request endpoint={endpoint} code={javascript} model={model} />;
}
