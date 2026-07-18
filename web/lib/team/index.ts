"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import {
  ADMIN_ROLE,
  MEMBER_ROLE,
  OWNER_ROLE,
} from "@/constants/team.constants";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserMemberData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import { auth } from "@/lib/auth/server";
import { MAX_TEAM_LIMIT } from "@/lib/constants";
import {
  deleteAllEducationByTeam,
  deleteAllExperienceByTeam,
  deleteAllProjectsByTeam,
} from "@/lib/db";
import { db } from "@/lib/db/client";
import { profile, teamProfile } from "@/lib/db/schema";
import { AddTeamFormData, EditTeamFormData } from "./schemas";

async function toUserMemberData(
  members: { userId: string; role: string; createdAt: Date | string }[],
): Promise<UserMemberData[]> {
  return Promise.all(
    members.map(async (member) => {
      const [data] = await db
        .select()
        .from(profile)
        .where(eq(profile.id, member.userId));

      return {
        $id: member.userId,
        name: data?.name ?? "",
        about: data?.about ?? "",
        roles: [member.role],
        confirmed: true,
        joinedAt: String(member.createdAt),
      };
    }),
  );
}

function toTeamData(
  organization: { id: string; name: string; ownerId?: string },
  teamProfileRow: typeof teamProfile.$inferSelect | undefined,
  members?: UserMemberData[],
): TeamData {
  console.log("test4");

  return {
    $id: organization.id,
    name: organization.name,
    title: teamProfileRow?.title ?? "",
    description: teamProfileRow?.description ?? "",
    image: teamProfileRow?.image ?? "",
    favicon: teamProfileRow?.favicon ?? "",
    socials: teamProfileRow?.socials ?? [],
    skills: teamProfileRow?.skills ?? [],
    userId: organization.ownerId ?? "",
    members,
  };
}

/**
 * Get a team by ID
 * @param {string} id The team ID
 * @returns {Promise<Result<TeamData>>} The team
 */
export async function getTeamById(id: string): Promise<Result<TeamData>> {
  return withAuth(async () => {
    try {
      const { data: organization, error } =
        await auth.organization.getFullOrganization({
          query: { organizationId: id },
        });

      if (error || !organization) {
        throw new Error(error?.message ?? "Team not found.");
      }

      const [teamProfileRow] = await db
        .select()
        .from(teamProfile)
        .where(eq(teamProfile.id, id));

      const owner = organization.members.find((m) => m.role === OWNER_ROLE);
      const members = await toUserMemberData(organization.members);

      return {
        success: true,
        message: "Team successfully retrieved.",
        data: toTeamData(
          { ...organization, ownerId: owner?.userId },
          teamProfileRow,
          members,
        ),
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * List all members of a team
 * @param teamId The team ID
 * @returns {Promise<Result<UserMemberData[]>>} The team members
 */
export async function listTeamMembers(
  teamId: string,
): Promise<Result<UserMemberData[]>> {
  return withAuth(async () => {
    try {
      const { data, error } = await auth.organization.listMembers({
        query: { organizationId: teamId },
      });

      if (error || !data) {
        throw new Error(error?.message ?? "Failed to list team members.");
      }

      return {
        success: true,
        message: "Team members successfully retrieved.",
        data: await toUserMemberData(data.members),
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * List all teams the current user belongs to
 * @returns {Promise<Result<TeamData[]>>} The teams
 */
export async function listTeams(): Promise<Result<TeamData[]>> {
  return withAuth(async () => {
    try {
      const { data, error } = await auth.organization.list();

      if (error || !data) {
        throw new Error(error?.message ?? "Failed to list teams.");
      }

      const teamProfileRows = await db.select().from(teamProfile);
      const teamProfileMap = new Map(
        teamProfileRows.map((row) => [row.id, row]),
      );

      return {
        success: true,
        message: "Teams successfully retrieved.",
        data: data.map((organization) =>
          toTeamData(organization, teamProfileMap.get(organization.id)),
        ),
      };
    } catch (err) {
      console.log("test5");

      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Create a team
 * @param {Object} params The parameters for creating a team
 * @param {AddTeamFormData} params.data The team data
 * @returns {Promise<Result<TeamData>>} The created team
 */
export async function createTeam({
  data,
}: {
  data: AddTeamFormData;
}): Promise<Result<TeamData>> {
  return withAuth(async (user) => {
    try {
      const { data: existingTeams, error: listError } =
        await auth.organization.list();

      if (listError) {
        throw new Error(listError.message);
      }

      if ((existingTeams?.length ?? 0) >= MAX_TEAM_LIMIT) {
        throw new Error(
          `You have reached the maximum amount of teams you are allowed to join and/or own. (${MAX_TEAM_LIMIT})`,
        );
      }

      const { data: organization, error } = await auth.organization.create({
        name: data.name,
        slug: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      });

      if (error || !organization) {
        throw new Error(error?.message ?? "Failed to create team.");
      }

      await db.insert(teamProfile).values({
        id: organization.id,
        title: "Welcome to your team!",
        description: "This is your team's information page.",
        image: null,
        favicon: null,
        socials: [],
        skills: [],
      });

      revalidateTag("teams");
      revalidateTag("information");

      return {
        success: true,
        message: "Team successfully created.",
        data: toTeamData({ ...organization, ownerId: user.$id }, undefined),
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Update a team
 * @param {Object} params The parameters for updating a team
 * @param {string} params.id The ID of the team
 * @param {EditTeamFormData} params.data The team data
 * @returns {Promise<Result<TeamData>>} The updated team
 */
export async function updateTeam({
  id,
  data,
}: {
  id: string;
  data: EditTeamFormData;
}): Promise<Result<TeamData>> {
  return withAuth(async () => {
    try {
      await checkUserRole(id, [ADMIN_ROLE, OWNER_ROLE]);

      const { data: organization, error } = await auth.organization.update({
        organizationId: id,
        data: { name: data.name },
      });

      if (error || !organization) {
        throw new Error(error?.message ?? "Failed to update team.");
      }

      const [teamProfileRow] = await db
        .select()
        .from(teamProfile)
        .where(eq(teamProfile.id, id));

      revalidateTag("teams");
      revalidateTag(`team:${id}`);

      return {
        success: true,
        message: "Team successfully updated.",
        data: toTeamData(organization, teamProfileRow),
      };
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Delete a team
 * @param {string} id The ID of the team
 * @returns {Promise<Result<TeamData>>} The deleted team
 */
export async function deleteTeam(id: string): Promise<Result<TeamData>> {
  return withAuth(async () => {
    try {
      await checkUserRole(id, [OWNER_ROLE]);

      const { error } = await auth.organization.delete({
        organizationId: id,
      });

      if (error) {
        throw new Error(error.message);
      }

      await db.delete(teamProfile).where(eq(teamProfile.id, id));

      await deleteAllProjectsByTeam(id);
      await deleteAllExperienceByTeam(id);
      await deleteAllEducationByTeam(id);

      revalidateTag("teams");
      revalidateTag(`team:${id}`);
      revalidateTag(`informations:team-${id}`);

      return {
        success: true,
        message: "Team successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Leave a team
 * @param teamId The team ID
 * @returns {Promise<Result<string>>} The ID of another team the user is in.
 */
export async function leaveTeam(teamId: string): Promise<Result<string>> {
  return withAuth(async () => {
    try {
      const { error } = await auth.organization.leave({
        organizationId: teamId,
      });

      if (error) {
        throw new Error(error.message);
      }

      const { data: remainingTeams } = await auth.organization.list();

      revalidateTag("teams");
      revalidateTag(`team:${teamId}`);

      if (remainingTeams && remainingTeams.length > 0) {
        return {
          success: true,
          message: `You've left the team!`,
          data: remainingTeams[0].id,
        };
      }

      return {
        success: true,
        message: `You've left the team!`,
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Invite a member to the team
 * @param {string} teamId The team ID
 * @param {string} email The email of the user to invite
 * @returns {Promise<Result<void>>}
 */
export async function inviteMember(
  teamId: string,
  email: string,
): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      await checkUserRole(teamId, [MEMBER_ROLE, ADMIN_ROLE, OWNER_ROLE]);

      const { error } = await auth.organization.inviteMember({
        organizationId: teamId,
        email,
        role: MEMBER_ROLE,
      });

      if (error) {
        throw new Error(error.message);
      }

      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: `Invitation sent to ${email}.`,
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 *  Remove a member from the team
 * @param userId The user ID to remove
 * @returns {Promise<Result<void>>}
 */
export async function removeMember(
  teamId: string,
  userId: string,
): Promise<Result<void>> {
  return withAuth(async (user) => {
    try {
      if (userId === user.$id) {
        throw new Error("You cannot remove yourself from the team.");
      }

      const roles = await getCurrentUserRoles(teamId);
      const currentUserRole = roles.data?.[0];

      const { data: members } = await auth.organization.listMembers({
        query: { organizationId: teamId },
      });
      const membership = members?.members.find((m) => m.userId === userId);

      if (!membership) {
        throw new Error("User is not a member of this team.");
      }

      if (membership.role === OWNER_ROLE) {
        throw new Error("You cannot remove the owner of the team.");
      }

      if (membership.role === ADMIN_ROLE && currentUserRole !== OWNER_ROLE) {
        throw new Error("Only team owners can remove admin members.");
      }

      if (currentUserRole !== OWNER_ROLE && currentUserRole !== ADMIN_ROLE) {
        throw new Error(
          "You must be an admin or owner to remove team members.",
        );
      }

      const { error } = await auth.organization.removeMember({
        organizationId: teamId,
        memberIdOrEmail: membership.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: `Member has been removed from the team.`,
      };
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Promote a team member to admin
 * @param {string} teamId The team ID
 * @param {string} userId The user ID to promote
 * @returns {Promise<Result<void>>}
 */
export async function promoteToAdmin(
  teamId: string,
  userId: string,
): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      await checkUserRole(teamId, [OWNER_ROLE]);

      const { data: members } = await auth.organization.listMembers({
        query: { organizationId: teamId },
      });
      const membership = members?.members.find((m) => m.userId === userId);

      if (!membership) {
        throw new Error("User is not a member of this team.");
      }

      const { error } = await auth.organization.updateMemberRole({
        organizationId: teamId,
        memberId: membership.id,
        role: ADMIN_ROLE,
      });

      if (error) {
        throw new Error(error.message);
      }

      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Member has been promoted to admin.",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Remove admin role from a team member
 * @param {string} teamId The team ID
 * @param {string} userId The user ID to demote
 * @returns {Promise<Result<void>>}
 */
export async function removeAdminRole(
  teamId: string,
  userId: string,
): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      await checkUserRole(teamId, [OWNER_ROLE]);

      const { data: members } = await auth.organization.listMembers({
        query: { organizationId: teamId },
      });
      const membership = members?.members.find((m) => m.userId === userId);

      if (!membership) {
        throw new Error("User is not a member of this team.");
      }

      const { error } = await auth.organization.updateMemberRole({
        organizationId: teamId,
        memberId: membership.id,
        role: MEMBER_ROLE,
      });

      if (error) {
        throw new Error(error.message);
      }

      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Admin role has been removed.",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Get the current user's roles in a team
 * @param teamId The team ID
 * @returns {Promise<Result<string[]>>} The user's roles in the team
 */
export async function getCurrentUserRoles(
  teamId: string,
): Promise<Result<string[]>> {
  return withAuth(async () => {
    try {
      const { data, error } = await auth.organization.getActiveMember({
        query: { organizationId: teamId },
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: "User roles successfully retrieved.",
        data: data?.role ? [data.role] : [],
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Check if the current user has one of the required roles for a team action
 * @param teamId The team ID
 * @param requiredRoles Array of allowed roles
 * @throws Error if the user doesn't have any of the required roles
 */
export async function checkUserRole(
  teamId: string,
  requiredRoles: string[],
): Promise<void> {
  const { data, error } = await auth.organization.getActiveMember({
    query: { organizationId: teamId },
  });

  if (error || !data || !requiredRoles.includes(data.role)) {
    throw new Error(
      `You must be ${requiredRoles.join(" or ")} to perform this action.`,
    );
  }
}
