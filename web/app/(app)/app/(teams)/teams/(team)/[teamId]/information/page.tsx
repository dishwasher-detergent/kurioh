import { notFound } from "next/navigation";

import InformationForm from "@/components/team/information/edit-information";
import { PageHeader } from "@/components/ui/page-header";
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

  return (
    <>
      <PageHeader
        title="Information"
        description="Basic portfolio information."
      />
      <InformationForm information={data} teamId={data.teamId} />;
    </>
  );
}
