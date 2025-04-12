import { notFound } from "next/navigation";

import ExperienceForm from "@/components/team/experience/edit-experience";
import { listExperiences } from "@/lib/db";

export default async function TeamExperience({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const experience = await listExperiences(teamId);

  if (!experience.success || !experience.data) {
    notFound();
  }

  const { data } = experience;

  return <ExperienceForm experience={data.documents} teamId={teamId} />;
}
