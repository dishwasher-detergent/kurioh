"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { Permission, Query, Role } from "node-appwrite";

import { Information } from "@/interfaces/information.interface";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import {
  DATABASE_ID,
  INFORMATION_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteFile, uploadFile } from "@/lib/storage";
import { EditInformationFormData, EditProjectFormData } from "./schemas";

/**
 * Get a information by ID
 * @param {string} informationId The ID of the information
 * @param {string[]} queries The queries to filter the information
 * @returns {Promise<Result<Information>>} The information
 */
export async function getInformationById(
  informationId: string,
  queries: string[] = [],
): Promise<Result<Information>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async (informationId) => {
        try {
          const information = await database.getDocument<Information>(
            DATABASE_ID,
            INFORMATION_COLLECTION_ID,
            informationId,
            queries,
          );

          const userRes = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            information.userId,
            [Query.select(["$id", "name"])],
          );

          const teamRes = await database.getDocument<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            information.teamId,
            [Query.select(["$id", "name"])],
          );

          return {
            success: true,
            message: "Information successfully retrieved.",
            data: {
              ...information,
              user: userRes,
              team: teamRes,
            },
          };
        } catch (err) {
          const error = err as Error;

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["information", informationId],
      {
        tags: [
          "information",
          `information:${informationId}`,
          `information:team-${informationId}`,
          `information:${informationId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      },
    )(informationId);
  });
}

/**
 * Update a information
 * @param {Object} params The parameters for creating a information
 * @param {string} [params.id] The ID of the information
 * @param {EditProjectFormData} [params.data] The information data
 * @param {string[]} [params.permissions] The permissions for the information (optional)
 * @returns {Promise<Result<Information>>} The updated information
 */
export async function updateInformation({
  id,
  teamId,
  data,
  permissions = undefined,
}: {
  id: string;
  teamId: string;
  data: EditInformationFormData;
  permissions?: string[];
}): Promise<Result<Information>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      const existingInformation = await database.getDocument<Information>(
        DATABASE_ID,
        INFORMATION_COLLECTION_ID,
        id,
      );

      if (data.image instanceof File) {
        if (existingInformation.image) {
          await deleteFile(existingInformation.image);
        }

        const image = await uploadFile({
          data: data.image,
          permissions: [
            Permission.read(Role.team(teamId)),
            Permission.write(Role.team(teamId)),
          ],
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      } else if (data.image === null && existingInformation.image) {
        const image = await deleteFile(existingInformation.image);

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = null;
      }

      const information = await database.updateDocument<Information>(
        DATABASE_ID,
        INFORMATION_COLLECTION_ID,
        id,
        {
          ...data,
          socials:
            data.socials?.map((social) =>
              typeof social === "string" ? social : social.value,
            ) || [],
          userId: user.$id,
        },
        permissions,
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        information.userId,
        [Query.select(["$id", "name"])],
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        information.teamId,
        [Query.select(["$id", "name"])],
      );

      revalidateTag(`information:${id}`);
      revalidateTag(`information:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Information successfully updated.",
        data: {
          ...information,
          user: userRes,
          team: teamRes,
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
