"use server";

import { Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { createSessionClient } from "@/lib/server/appwrite";

import { ID, Models, Permission, Role } from "node-appwrite";
import { PROJECT_BUCKET_ID } from "../constants";

/**
 * Uploads a project image.
 * @param {Object} params The parameters for creating a project image
 * @param {string} [params.id] The ID of the project
 * @param {File} params.data The image data
 * @param {string[]} [params.permissions] The permissions for the image (optional)
 * @returns {Promise<Result<Models.File>>} The file
 */
export async function uploadProjectImage({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: File;
  permissions?: string[];
}): Promise<Result<Models.File>> {
  return withAuth(async (user) => {
    const { storage } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.any()),
    ];

    try {
      const response = await storage.createFile(
        PROJECT_BUCKET_ID,
        id,
        data,
        permissions
      );

      return {
        success: true,
        message: "Project image uploaded successfully.",
        data: response,
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Deletes a project image.
 * @param {string} id
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteProjectImage(
  id: string
): Promise<Result<undefined>> {
  return withAuth(async () => {
    const { storage } = await createSessionClient();

    try {
      await storage.deleteFile(PROJECT_BUCKET_ID, id);

      return {
        success: true,
        message: "Project image successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}
