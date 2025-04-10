import InformationForm from "@/components/team/information/edit-information";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTeamById } from "@/lib/team";

import { notFound } from "next/navigation";

export default async function TeamInformation({
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
          <CardTitle>Information</CardTitle>
          <CardDescription>Basic portfolio information.</CardDescription>
        </CardHeader>
        <CardContent>
          <InformationForm {...data.information} />
        </CardContent>
      </Card>
    </>
  );
}
