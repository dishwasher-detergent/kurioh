import InformationForm from "@/components/team/information/edit-information";
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
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Information</h2>
        <p className="text-sm font-semibold">Basic portfolio information.</p>
      </header>
      <InformationForm {...data.information} />
    </>
  );
}
