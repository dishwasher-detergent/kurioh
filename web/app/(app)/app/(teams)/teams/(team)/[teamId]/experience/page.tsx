import ExperienceForm from "@/components/team/experience/edit-experience";
import { getTeamById } from "@/lib/team";

import { notFound } from "next/navigation";

export default async function TeamExperience({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const org = await getTeamById(teamId);

  if (!org.success || !org.data) {
    notFound();
  }

  const { data } = org;

  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Experience</h2>
        <p className="text-sm font-semibold">
          Add Your Job, Volunteer, or Project Experience.
        </p>
      </header>
      <ExperienceForm experience={data.experience} teamId={teamId} />
    </>
  );
}
