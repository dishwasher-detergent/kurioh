import { TeamActions } from "@/components/team/team-actions";
import { TeamData } from "@/interfaces/team.interface";

interface TeamHeaderProps {
  team: TeamData;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

export function TeamHeader({
  team,
  isOwner,
  isAdmin,
  isMember,
}: TeamHeaderProps) {
  return (
    isMember && <TeamActions team={team} isOwner={isOwner} isAdmin={isAdmin} />
  );
}
