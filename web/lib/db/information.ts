"use server";

import { eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";

import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { withAuth } from "@/lib/auth";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";
import { profile, teamProfile } from "@/lib/db/schema";
import { deleteFile, uploadFile } from "@/lib/storage";
import { EditInformationFormData } from "./schemas";

/**
 * Get a information by ID
 * @param {string} teamId The ID of the information
 * @returns {Promise<Result<TeamData>>} The information
 */
export async function getInformationById(
  teamId: string,
): Promise<Result<TeamData>> {
  return withAuth(async () => {
    try {
      // `auth.organization.*` reads the session cookie, so this can't be
      // wrapped in `unstable_cache` (dynamic data sources aren't allowed
      // inside a cache scope) — only the Postgres reads below are cached.
      const { data: organization, error } =
        await auth.organization.getFullOrganization({
          query: { organizationId: teamId },
        });

      if (error || !organization) {
        throw new Error(error?.message ?? "Team not found.");
      }

      const owner = organization.members.find((m) => m.role === "owner");

      return await unstable_cache(
        async (teamId, organization, ownerId) => {
          const [teamProfileRow] = await db
            .select()
            .from(teamProfile)
            .where(eq(teamProfile.id, teamId));

          const [userRow] = ownerId
            ? await db.select().from(profile).where(eq(profile.id, ownerId))
            : [undefined];

          return {
            success: true,
            message: "Information successfully retrieved.",
            data: {
              $id: organization.id,
              name: organization.name,
              title: teamProfileRow?.title ?? "",
              description: teamProfileRow?.description ?? "",
              image: teamProfileRow?.image ?? "",
              favicon: teamProfileRow?.favicon ?? "",
              socials: teamProfileRow?.socials ?? [],
              skills: teamProfileRow?.skills ?? [],
              userId: ownerId ?? "",
              user: userRow
                ? {
                    $id: userRow.id,
                    name: userRow.name,
                    about: userRow.about ?? "",
                  }
                : undefined,
            },
          };
        },
        ["information", teamId],
        {
          tags: [
            "information",
            `information:${teamId}`,
            `information:team-${teamId}`,
          ],
          revalidate: 600,
        },
      )(teamId, organization, owner?.userId);
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
 * Update a information
 * @param {Object} params The parameters for creating a information
 * @param {string} params.id The ID of the information (team)
 * @param {EditInformationFormData} params.data The information data
 * @returns {Promise<Result<TeamData>>} The updated information
 */
export async function updateInformation({
  id,
  data,
}: {
  id: string;
  data: EditInformationFormData;
}): Promise<Result<TeamData>> {
  return withAuth(async (user) => {
    try {
      const [existingInformation] = await db
        .select()
        .from(teamProfile)
        .where(eq(teamProfile.id, id));

      let image = existingInformation?.image ?? null;
      let favicon = existingInformation?.favicon ?? null;

      if (data.image instanceof File) {
        if (image) {
          await deleteFile(image);
        }

        const uploaded = await uploadFile({ data: data.image });

        if (!uploaded.success) {
          throw new Error(uploaded.message);
        }

        image = uploaded.data?.$id ?? null;
      } else if (data.image === null && image) {
        const deleted = await deleteFile(image);

        if (!deleted.success) {
          throw new Error(deleted.message);
        }

        image = null;
      }

      if (data.favicon instanceof File) {
        if (favicon) {
          await deleteFile(favicon);
        }

        const uploaded = await uploadFile({ data: data.favicon });

        if (!uploaded.success) {
          throw new Error(uploaded.message);
        }

        favicon = uploaded.data?.$id ?? null;
      } else if (data.favicon === null && favicon) {
        const deleted = await deleteFile(favicon);

        if (!deleted.success) {
          throw new Error(deleted.message);
        }

        favicon = null;
      }

      const [row] = await db
        .insert(teamProfile)
        .values({
          id,
          title: data.title,
          description: data.description,
          image,
          favicon,
          socials: data.socials?.map((x) => x.label) ?? [],
          skills: data.skills?.map((x) => x.label) ?? [],
        })
        .onConflictDoUpdate({
          target: teamProfile.id,
          set: {
            title: data.title,
            description: data.description,
            image,
            favicon,
            socials: data.socials?.map((x) => x.label) ?? [],
            skills: data.skills?.map((x) => x.label) ?? [],
          },
        })
        .returning();

      revalidateTag(`information:${id}`);
      revalidateTag(`information:team-${id}`);
      revalidateTag(`team:${id}`);

      const [userRow] = await db
        .select()
        .from(profile)
        .where(eq(profile.id, user.$id));

      return {
        success: true,
        message: "Information successfully updated.",
        data: {
          $id: id,
          name: "",
          title: row.title ?? "",
          description: row.description ?? "",
          image: row.image ?? "",
          favicon: row.favicon ?? "",
          socials: row.socials ?? [],
          skills: row.skills ?? [],
          userId: user.$id,
          user: userRow
            ? {
                $id: userRow.id,
                name: userRow.name,
                about: userRow.about ?? "",
              }
            : undefined,
        },
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
