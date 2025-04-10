import ExperienceForm from "@/components/team/experience/edit-experience";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>
            Job, Volunteer, or Project Experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ExperienceForm experience={data.experience} teamId={teamId} />
        </CardContent>
      </Card>
    </>
  );
}
