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
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteFile, uploadFile } from "@/lib/storage";
import { EditInformationFormData } from "./schemas";

/**
 * Get a information by ID
 * @param {string} teamId The ID of the information
 * @param {string[]} queries The queries to filter the information
 * @returns {Promise<Result<TeamData>>} The information
 */
export async function getInformationById(
  teamId: string,
  queries: string[] = [],
): Promise<Result<TeamData>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async (teamId) => {
        try {
          const team = await database.getDocument<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            teamId,
            queries,
          );

          const userRes = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            team.userId,
            [Query.select(["$id", "name"])],
          );

          return {
            success: true,
            message: "Information successfully retrieved.",
            data: {
              ...team,
              user: userRes,
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
      ["information", teamId],
      {
        tags: [
          "information",
          `information:${teamId}`,
          `information:team-${teamId}`,
          `information:${teamId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      },
    )(teamId);
  });
}

/**
 * Update a information
 * @param {Object} params The parameters for creating a information
 * @param {string} [params.id] The ID of the information
 * @param {EditInformationFormData} [params.data] The information data
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
        TEAM_COLLECTION_ID,
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
        TEAM_COLLECTION_ID,
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

      revalidateTag(`information:${id}`);
      revalidateTag(`information:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Information successfully updated.",
        data: {
          ...information,
          user: userRes,
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
