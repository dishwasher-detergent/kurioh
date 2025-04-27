import { notFound } from "next/navigation";

import EducationForm from "@/components/team/education/edit-education";
import { PageHeader } from "@/components/ui/page-header";
import { listEducations } from "@/lib/db";

export default async function TeamEducation({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const education = await listEducations(teamId);

  if (!education.success || !education.data) {
    notFound();
  }

  const { data } = education;

  return (
    <>
      <PageHeader
        title="Education"
        description="Add your education details to showcase your academic background."
      />
      <EducationForm education={data.documents} teamId={teamId} />
    </>
  );
}
