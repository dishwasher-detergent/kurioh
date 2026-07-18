"use server";

import { eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";

import { Education } from "@/interfaces/education.interface";
import { DocumentList, Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { education } from "@/lib/db/schema";
import { EditEducationFormData } from "./schemas";

function toEducation(row: typeof education.$inferSelect): Education {
  return {
    $id: row.id,
    institution: row.institution,
    type: row.type ?? "",
    fieldOfStudy: row.fieldOfStudy,
    degree: row.degree,
    start_date: row.startDate,
    end_date: row.endDate as Date,
    userId: row.userId,
    teamId: row.teamId,
  };
}

/**
 * Get a list of educations for a team
 * @param {string} teamId The ID of the team
 * @returns {Promise<Result<DocumentList<Education>>>} The list of educations
 */
export async function listEducations(
  teamId: string,
): Promise<Result<DocumentList<Education>>> {
  return withAuth(async (user) => {
    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (teamId, userId) => {
        try {
          const rows = await db
            .select()
            .from(education)
            .where(eq(education.teamId, teamId));

          return {
            success: true,
            message: "Educations successfully retrieved.",
            data: {
              documents: rows.map(toEducation),
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
      ["educations", teamId],
      {
        tags: ["educations", `educations:team-${teamId}`],
        revalidate: 600,
      },
    )(teamId, user.$id);
  });
}

/**
 * Create an education
 * @param {Object} params The parameters for creating an education
 * @param {EditEducationFormData} params.data The education data
 * @param {string} params.teamId The ID of the team
 * @returns {Promise<Result<Education>>} The created education
 */
export async function createEducation({
  data,
  teamId,
}: {
  data: EditEducationFormData;
  teamId: string;
}): Promise<Result<Education>> {
  return withAuth(async (user) => {
    try {
      const [row] = await db
        .insert(education)
        .values({
          id: crypto.randomUUID(),
          institution: data.institution,
          fieldOfStudy: data.fieldOfStudy,
          startDate: data.start_date,
          endDate: data.end_date,
          degree: data.degree,
          type: data.type,
          userId: user.$id,
          teamId,
        })
        .returning();

      revalidateTag(`educations:team-${teamId}`);
      revalidateTag(`education:${row.id}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Education successfully created.",
        data: toEducation(row),
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
 * Update an education
 * @param {Object} params The parameters for updating an education
 * @param {string} params.id The ID of the education
 * @param {EditEducationFormData} params.data The education data
 * @returns {Promise<Result<Education>>} The updated education
 */
export async function updateEducation({
  id,
  data,
}: {
  id: string;
  data: EditEducationFormData;
}): Promise<Result<Education>> {
  return withAuth(async (user) => {
    try {
      const [row] = await db
        .update(education)
        .set({
          institution: data.institution,
          fieldOfStudy: data.fieldOfStudy,
          startDate: data.start_date,
          endDate: data.end_date,
          degree: data.degree,
          type: data.type,
          userId: user.$id,
          updatedAt: new Date(),
        })
        .where(eq(education.id, id))
        .returning();

      if (!row) {
        return {
          success: false,
          message: "Education not found.",
        };
      }

      revalidateTag(`educations:team-${row.teamId}`);
      revalidateTag(`education:${row.id}`);
      revalidateTag(`team:${row.teamId}`);

      return {
        success: true,
        message: "Education successfully updated.",
        data: toEducation(row),
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
 * Delete an education
 * @param {string} id The ID of the education
 * @returns {Promise<Result<Education>>} The deleted education
 */
export async function deleteEducation(id: string): Promise<Result<Education>> {
  return withAuth(async () => {
    try {
      const [row] = await db
        .delete(education)
        .where(eq(education.id, id))
        .returning();

      if (!row) {
        return {
          success: false,
          message: "Education not found.",
        };
      }

      revalidateTag(`educations:team-${row.teamId}`);
      revalidateTag(`education:${row.id}`);
      revalidateTag(`team:${row.teamId}`);

      return {
        success: true,
        message: "Education successfully deleted.",
        data: toEducation(row),
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
 * Update multiple educations for a team
 * @param {Object} params The parameters for updating educations
 * @param {string} params.teamId The ID of the team
 * @param {EditEducationFormData[]} params.educations The education data array
 * @returns {Promise<Result<{ added: number, updated: number, deleted: number, failed: number }>>} Results summary
 */
export async function updateMultipleEducations({
  teamId,
  educations,
}: {
  teamId: string;
  educations: EditEducationFormData[];
}): Promise<
  Result<{ added: number; updated: number; deleted: number; failed: number }>
> {
  return withAuth(async () => {
    try {
      const existingEducationsResult = await listEducations(teamId);

      if (!existingEducationsResult.success) {
        return {
          success: false,
          message: existingEducationsResult.message,
        };
      }

      const existingEducations = existingEducationsResult.data?.documents || [];

      const newEducationIds = educations
        .filter((edu) => edu.id)
        .map((edu) => edu.id as string);

      const toDelete = existingEducations.filter(
        (edu) => !newEducationIds.includes(edu.$id),
      );

      let deletedCount = 0;
      let failedCount = 0;

      for (const edu of toDelete) {
        const result = await deleteEducation(edu.$id);
        if (result.success) deletedCount++;
        else failedCount++;
      }

      let updatedCount = 0;
      let addedCount = 0;

      for (const edu of educations) {
        if (edu.id) {
          const result = await updateEducation({
            id: edu.id,
            data: edu,
          });
          if (result.success) updatedCount++;
          else failedCount++;
        } else {
          const result = await createEducation({
            data: edu,
            teamId,
          });
          if (result.success) addedCount++;
          else failedCount++;
        }
      }

      revalidateTag(`educations:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: `Education updated: ${addedCount} added, ${updatedCount} updated, ${deletedCount} deleted, ${failedCount} failed.`,
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
 * Delete all education for a team
 * @param teamId The ID of the team
 * @returns {Promise<Result<void>>} The result of the operation
 */
export async function deleteAllEducationByTeam(
  teamId: string,
): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      await db.delete(education).where(eq(education.teamId, teamId));

      revalidateTag(`education:team-${teamId}`);

      return {
        success: true,
        message: "Education successfully deleted.",
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
