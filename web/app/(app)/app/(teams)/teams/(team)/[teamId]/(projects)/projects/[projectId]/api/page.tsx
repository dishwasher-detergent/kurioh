import { notFound } from "next/navigation";

import { Request } from "@/components/request";
import { API_ENDPOINT } from "@/lib/constants";
import { getProjectById } from "@/lib/db";

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
  team: string,
  title: string,
  slug: string,
  shortDescription: string,
  description: string,
  images: string[],
  tags: string[],
  links: string[],
}`;

  const project = await getProjectById(projectId);

  if (!project.success) {
    notFound();
  }

  return (
    <Request endpoint={endpoint} code={javascript} model={model}>
      <p className="text-lg font-bold">Fetch Project</p>
      <p className="text-muted-foreground text-sm">
        Fetch a complete project with one simple API call. Includes title,
        description, images, tags, and links.
      </p>
    </Request>
  );
}
