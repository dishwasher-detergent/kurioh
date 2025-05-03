import { notFound } from "next/navigation";

import InformationForm from "@/components/team/information/edit-information";
import { TeamActions } from "@/components/team/team-actions";
import { PageHeader } from "@/components/ui/page-header";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { getInformationById } from "@/lib/db";
import { getCurrentUserRoles } from "@/lib/team";

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

  const { data: roles } = await getCurrentUserRoles(teamId);

  const isOwner = roles!.includes(OWNER_ROLE);
  const isAdmin = roles!.includes(ADMIN_ROLE);

  return (
    <>
      <PageHeader title="Details" description="Basic portfolio information.">
        <div className="flex flex-row items-start gap-2">
          <TeamActions team={data} isAdmin={isAdmin} isOwner={isOwner} />
        </div>
      </PageHeader>
      <InformationForm information={data} teamId={data.$id} />
    </>
  );
}
