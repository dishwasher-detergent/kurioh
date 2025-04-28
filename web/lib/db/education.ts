"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { Education } from "@/interfaces/education.interface";
import { Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { DATABASE_ID, EDUCATION_COLLECTION_ID } from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { EditEducationFormData } from "./schemas";

/**
import { Education } from "@/interfaces/education.interface";
 * Get a list of educations for a team
 * @param {string} teamId The ID of the team
 * @param {string[]} queries The queries to filter the educations
 * @returns {Promise<Result<Models.DocumentList<Education>>>} The list of educations
 */
export async function listEducations(
  teamId: string,
  queries: string[] = [],
): Promise<Result<Models.DocumentList<Education>>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (teamId, queries, userId) => {
        try {
          const educations = await database.listDocuments<Education>(
            DATABASE_ID,
            EDUCATION_COLLECTION_ID,
            [Query.equal("teamId", teamId), ...queries],
          );

          return {
            success: true,
            message: "Educations successfully retrieved.",
            data: educations,
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
        tags: [
          "educations",
          `educations:team-${teamId}`,
          `educations:team-${teamId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      },
    )(teamId, queries, user.$id);
  });
}

/**
 * Create an education
 * @param {Object} params The parameters for creating an education
 * @param {string} [params.id] The ID of the education (optional)
 * @param {EditEducationFormData} params.data The education data
 * @param {string} params.teamId The ID of the team
 * @param {string[]} [params.permissions] The permissions for the education (optional)
 * @returns {Promise<Result<Education>>} The created education
 */
export async function createEducation({
  id = ID.unique(),
  data,
  teamId,
  permissions = [],
}: {
  id?: string;
  data: EditEducationFormData;
  teamId: string;
  permissions?: string[];
}): Promise<Result<Education>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.team(teamId)),
      Permission.write(Role.team(teamId)),
    ];

    try {
      const education = await database.createDocument<Education>(
        DATABASE_ID,
        EDUCATION_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
          teamId,
        },
        permissions,
      );

      revalidateTag(`educations:team-${teamId}`);
      revalidateTag(`education:${education.$id}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Education successfully created.",
        data: education,
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
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
 * @param {string[]} [params.permissions] The permissions for the education (optional)
 * @returns {Promise<Result<Education>>} The updated education
 */
export async function updateEducation({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditEducationFormData;
  permissions?: string[];
}): Promise<Result<Education>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      await database.getDocument<Education>(
        DATABASE_ID,
        EDUCATION_COLLECTION_ID,
        id,
      );

      const education = await database.updateDocument<Education>(
        DATABASE_ID,
        EDUCATION_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
        },
        permissions,
      );

      revalidateTag(`educations:team-${education.teamId}`);
      revalidateTag(`education:${education.$id}`);
      revalidateTag(`team:${education.teamId}`);

      return {
        success: true,
        message: "Education successfully updated.",
        data: education,
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
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
    const { database } = await createSessionClient();

    try {
      const education = await database.getDocument<Education>(
        DATABASE_ID,
        EDUCATION_COLLECTION_ID,
        id,
      );

      await database.deleteDocument(DATABASE_ID, EDUCATION_COLLECTION_ID, id);

      revalidateTag(`educations:team-${education.teamId}`);
      revalidateTag(`education:${education.$id}`);
      revalidateTag(`team:${education.teamId}`);

      return {
        success: true,
        message: "Education successfully deleted.",
        data: education,
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
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
 * @returns {Promise<Result<{ added: number, updated: number, deleted: number }>>} Results summary
 */
export async function updateTeamEducations({
  teamId,
  educations,
}: {
  teamId: string;
  educations: EditEducationFormData[];
}): Promise<Result<{ added: number; updated: number; deleted: number }>> {
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
        .filter((exp) => exp.id)
        .map((exp) => exp.id as string);

      const toDelete = existingEducations.filter(
        (exp) => !newEducationIds.includes(exp.$id),
      );

      let deletedCount = 0;
      for (const exp of toDelete) {
        const result = await deleteEducation(exp.$id);
        if (result.success) deletedCount++;
      }

      let updatedCount = 0;
      let addedCount = 0;

      for (const exp of educations) {
        if (exp.id) {
          const result = await updateEducation({
            id: exp.id,
            data: exp,
          });
          if (result.success) updatedCount++;
        } else {
          const result = await createEducation({
            data: exp,
            teamId,
          });
          if (result.success) addedCount++;
        }
      }

      revalidateTag(`educations:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: `Educations updated successfully: ${addedCount} added, ${updatedCount} updated, ${deletedCount} deleted.`,
        data: {
          added: addedCount,
          updated: updatedCount,
          deleted: deletedCount,
        },
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
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
    const { database } = await createSessionClient();

    try {
      let response;
      const queries = [Query.limit(50), Query.equal("teamId", teamId)];

      do {
        response = await database.listDocuments<Education>(
          DATABASE_ID,
          EDUCATION_COLLECTION_ID,
          queries,
        );

        await Promise.all(
          response.documents.map((document) => deleteEducation(document.$id)),
        );
      } while (response.documents.length > 0);

      revalidateTag(`education:team-${teamId}`);

      return {
        success: true,
        message: "Education successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}
