"use server";

import { eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";

import { Experience } from "@/interfaces/experience.interface";
import { DocumentList, Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { experience } from "@/lib/db/schema";
import { EditExperienceFormData } from "./schemas";

function toExperience(row: typeof experience.$inferSelect): Experience {
  return {
    $id: row.id,
    title: row.title,
    description: row.description,
    start_date: row.startDate,
    end_date: row.endDate as Date,
    company: row.company,
    type: row.type ?? "",
    website: row.website ? new URL(row.website) : (undefined as unknown as URL),
    skills: row.skills ?? [],
    userId: row.userId,
    teamId: row.teamId,
  };
}

/**
 * Get a list of experiences for a team
 * @param {string} teamId The ID of the team
 * @returns {Promise<Result<DocumentList<Experience>>>} The list of experiences
 */
export async function listExperiences(
  teamId: string,
): Promise<Result<DocumentList<Experience>>> {
  return withAuth(async (user) => {
    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (teamId, userId) => {
        try {
          const rows = await db
            .select()
            .from(experience)
            .where(eq(experience.teamId, teamId));

          return {
            success: true,
            message: "Experiences successfully retrieved.",
            data: {
              documents: rows.map(toExperience),
              total: rows.length,
            },
          };
        } catch (err) {
          const error = err as Error;

          console.error(error);

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["experiences", teamId],
      {
        tags: ["experiences", `experiences:team-${teamId}`],
        revalidate: 600,
      },
    )(teamId, user.$id);
  });
}

/**
 * Create an experience
 * @param {Object} params The parameters for creating an experience
 * @param {EditExperienceFormData} params.data The experience data
 * @param {string} params.teamId The ID of the team
 * @returns {Promise<Result<Experience>>} The created experience
 */
export async function createExperience({
  data,
  teamId,
}: {
  data: EditExperienceFormData;
  teamId: string;
}): Promise<Result<Experience>> {
  return withAuth(async (user) => {
    try {
      const [row] = await db
        .insert(experience)
        .values({
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description,
          startDate: data.start_date,
          endDate: data.end_date,
          company: data.company,
          type: data.type,
          website: data.website && data.website !== "" ? data.website : null,
          skills:
            data.skills?.map((skill) =>
              typeof skill === "string" ? skill : skill.value,
            ) ?? [],
          userId: user.$id,
          teamId,
        })
        .returning();

      revalidateTag(`experiences:team-${teamId}`);
      revalidateTag(`experience:${row.id}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Experience successfully created.",
        data: toExperience(row),
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
 * Update an experience
 * @param {Object} params The parameters for updating an experience
 * @param {string} params.id The ID of the experience
 * @param {EditExperienceFormData} params.data The experience data
 * @returns {Promise<Result<Experience>>} The updated experience
 */
export async function updateExperience({
  id,
  data,
}: {
  id: string;
  data: EditExperienceFormData;
}): Promise<Result<Experience>> {
  return withAuth(async (user) => {
    try {
      const [row] = await db
        .update(experience)
        .set({
          title: data.title,
          description: data.description,
          startDate: data.start_date,
          endDate: data.end_date,
          company: data.company,
          type: data.type,
          website: data.website && data.website !== "" ? data.website : null,
          skills: data.skills?.map((x) =>
            typeof x === "string" ? x : x.value,
          ),
          userId: user.$id,
          updatedAt: new Date(),
        })
        .where(eq(experience.id, id))
        .returning();

      if (!row) {
        return {
          success: false,
          message: "Experience not found.",
        };
      }

      revalidateTag(`experiences:team-${row.teamId}`);
      revalidateTag(`experience:${row.id}`);
      revalidateTag(`team:${row.teamId}`);

      return {
        success: true,
        message: "Experience successfully updated.",
        data: toExperience(row),
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
 * Delete an experience
 * @param {string} id The ID of the experience
 * @returns {Promise<Result<Experience>>} The deleted experience
 */
export async function deleteExperience(
  id: string,
): Promise<Result<Experience>> {
  return withAuth(async () => {
    try {
      const [row] = await db
        .delete(experience)
        .where(eq(experience.id, id))
        .returning();

      if (!row) {
        return {
          success: false,
          message: "Experience not found.",
        };
      }

      revalidateTag(`experiences:team-${row.teamId}`);
      revalidateTag(`experience:${row.id}`);
      revalidateTag(`team:${row.teamId}`);

      return {
        success: true,
        message: "Experience successfully deleted.",
        data: toExperience(row),
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
 * Update multiple experiences for a team
 * @param {Object} params The parameters for updating experiences
 * @param {string} params.teamId The ID of the team
 * @param {EditExperienceFormData[]} params.experiences The experience data array
 * @returns {Promise<Result<{ added: number, updated: number, deleted: number, failed: number }>>} Results summary
 */
export async function updateMultipleExperiences({
  teamId,
  experiences,
}: {
  teamId: string;
  experiences: EditExperienceFormData[];
}): Promise<
  Result<{ added: number; updated: number; deleted: number; failed: number }>
> {
  return withAuth(async () => {
    try {
      const existingExperiencesResult = await listExperiences(teamId);

      if (!existingExperiencesResult.success) {
        return {
          success: false,
          message: existingExperiencesResult.message,
        };
      }

      const existingExperiences =
        existingExperiencesResult.data?.documents || [];

      const newExperienceIds = experiences
        .filter((exp) => exp.id)
        .map((exp) => exp.id as string);

      const toDelete = existingExperiences.filter(
        (exp) => !newExperienceIds.includes(exp.$id),
      );

      let deletedCount = 0;
      let failedCount = 0;

      for (const exp of toDelete) {
        const result = await deleteExperience(exp.$id);
        if (result.success) deletedCount++;
        else failedCount++;
      }

      let updatedCount = 0;
      let addedCount = 0;

      for (const exp of experiences) {
        if (exp.id) {
          const result = await updateExperience({
            id: exp.id,
            data: exp,
          });
          if (result.success) updatedCount++;
          else failedCount++;
        } else {
          const result = await createExperience({
            data: exp,
            teamId,
          });
          if (result.success) addedCount++;
          else failedCount++;
        }
      }

      revalidateTag(`experiences:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: `Experiences updated: ${addedCount} added, ${updatedCount} updated, ${deletedCount} deleted, ${failedCount} failed.`,
        data: {
          added: addedCount,
          updated: updatedCount,
          deleted: deletedCount,
          failed: failedCount,
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

/**
 * Delete all experiences for a team
 * @param teamId The ID of the team
 * @returns {Promise<Result<void>>} The result of the operation
 */
export async function deleteAllExperienceByTeam(
  teamId: string,
): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      await db.delete(experience).where(eq(experience.teamId, teamId));

      revalidateTag(`experiences:team-${teamId}`);

      return {
        success: true,
        message: "Experience successfully deleted.",
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
