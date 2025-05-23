import {
  LucideEllipsisVertical,
  LucideMailWarning,
  LucideStar,
} from "lucide-react";

import { DemoteMemberAdmin } from "@/components/team/demote-admin";
import { PromoteMemberAdmin } from "@/components/team/promote-admin";
import { RemoveTeamMember } from "@/components/team/remove-team-member";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { UserMemberData } from "@/interfaces/user.interface";

interface TeamMembersProps {
  members: UserMemberData[];
  teamId: string;
  isOwner: boolean;
  isAdmin: boolean;
}

export function TeamMembers({
  members,
  teamId,
  isOwner,
  isAdmin,
}: TeamMembersProps) {
  return (
    <section>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead className="w-full">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.$id}>
                <TableCell>
                  <div className="flex flex-row items-center gap-2">
                    {member.roles.includes(ADMIN_ROLE) && (
                      <LucideStar className="size-3.5 text-amber-600" />
                    )}
                    {!member.confirmed && (
                      <LucideMailWarning className="size-3.5" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.roles.join(", ")}</TableCell>
                <TableCell>
                  {member.joinedAt
                    ? new Date(member.joinedAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {!member.roles.includes(OWNER_ROLE) && isAdmin && (
                    <MemberActions
                      member={member}
                      teamId={teamId}
                      isOwner={isOwner}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

interface MemberActionsProps {
  member: UserMemberData;
  teamId: string;
  isOwner: boolean;
}

function MemberActions({ member, teamId, isOwner }: MemberActionsProps) {
  const isAdmin = member.roles.includes(ADMIN_ROLE);
  const isOwnerRole = member.roles.includes(OWNER_ROLE);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="size-8">
          <LucideEllipsisVertical className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <RemoveTeamMember teamId={teamId} userId={member.$id} />
        {isOwner && isAdmin && !isOwnerRole && (
          <DemoteMemberAdmin teamId={teamId} userId={member.$id} />
        )}
        {isOwner && !isAdmin && (
          <PromoteMemberAdmin teamId={teamId} userId={member.$id} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
