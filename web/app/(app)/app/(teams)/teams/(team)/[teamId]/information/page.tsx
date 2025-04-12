import { notFound } from "next/navigation";

import InformationForm from "@/components/team/information/edit-information";
import { getInformationById } from "@/lib/db";

export default async function TeamInformation({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const information = await getInformationById(teamId);

  if (!information.success || !information.data) {
    notFound();
  }

  const { data } = information;

  return <InformationForm information={data} teamId={data.teamId} />;
}
