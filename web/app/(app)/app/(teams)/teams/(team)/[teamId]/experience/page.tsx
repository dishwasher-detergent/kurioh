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

  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Experience</h2>
        <p className="text-sm font-semibold">
          Add Your Job, Volunteer, or Project Experience.
        </p>
      </header>
      <ExperienceForm experience={data.documents} teamId={teamId} />
    </>
  );
}
