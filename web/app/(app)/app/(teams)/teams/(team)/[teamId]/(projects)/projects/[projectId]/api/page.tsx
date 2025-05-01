import { notFound } from "next/navigation";

import { Request } from "@/components/request";
import { CodeData } from "@/components/ui/code-snippit";
import { API_ENDPOINT } from "@/lib/constants";
import { getProjectById } from "@/lib/db";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ projectId: string; teamId: string }>;
}) {
  const { projectId, teamId } = await params;

  const endpoint = `${API_ENDPOINT}/teams/${teamId}/projects/${projectId}`;
  const javascript: CodeData[] = [
    {
      title: "SDK",
      language: "js",
      code: `import { Client } from "@kurioh/client";

const client = new Client("${API_ENDPOINT}", "${teamId}");
const { data, error, isError, isSuccess, isLoading } = await client.project.get('PROJECT_ID');`,
    },
    {
      title: "JS",
      language: "js",
      code: `const res = await fetch("${endpoint}");
const data = await res.json();`,
    },
  ];
  const model: CodeData[] = [
    {
      title: "JS",
      language: "js",
      code: `interface Project {
  id: string,
  team: string,
  title: string,
  shortDescription: string,
  description: string,
  images: string[],
  tags: string[],
  links: string[],
}`,
    },
  ];

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
