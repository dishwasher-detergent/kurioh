import { Metadata } from "next";
import { redirect } from "next/navigation";

import EditProject from "@/components/project/edit-project";
import { ProjectActions } from "@/components/project/project-actions";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { ENDPOINT, PROJECT_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
import { getProjectById } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  const { data, success } = await getProjectById(projectId);

  if (!success || !data) {
    return {};
  }

  const image =
    data.images.length > 0
      ? `${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${data.image[0]}/view?project=${PROJECT_ID}`
      : null;

  return {
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name,
      description: data.description,
      images: image ? [image] : [],
    },
    twitter: {
      title: data.name,
      description: data.description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ teamId: string; projectId: string }>;
}) {
  const { projectId, teamId } = await params;
  const { data, success } = await getProjectById(projectId);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <>
      {data.published && <Badge className="mb-4">Published</Badge>}
      <PageHeader
        title={data.name}
        description="Describe your project and its goals."
      >
        <ProjectActions project={data} />
      </PageHeader>
      <EditProject project={data} teamId={teamId} />
    </>
  );
}
