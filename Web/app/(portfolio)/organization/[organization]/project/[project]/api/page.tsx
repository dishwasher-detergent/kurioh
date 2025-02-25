import { Request } from "@/components/request";
import { Header } from "@/components/ui/header";
import { API_ENDPOINT } from "@/lib/constants";
import { getProject } from "@/lib/server/utils";
import { notFound } from "next/navigation";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ project: string; organization: string }>;
}) {
  const { project: projectId, organization: organizationId } = await params;

  const endpoint = `${API_ENDPOINT}/organizations/${organizationId}/projects/${projectId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;

  const project = await getProject(projectId);

  if (!project.success) {
    notFound();
  }

  const { data: projectData } = project;

  return (
    <>
      <Header title={projectData?.title} slug={projectData?.slug} />
      <Request endpoint={endpoint} code={javascript} />
    </>
  );
}
