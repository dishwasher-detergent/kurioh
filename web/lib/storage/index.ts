"use server";

import { Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { createSessionClient } from "@/lib/server/appwrite";

import { ID, Models, Permission, Role } from "node-appwrite";
import { PROJECT_BUCKET_ID } from "../constants";

/**
 * Uploads a file.
 * @param {Object} params The parameters for creating a file
 * @param {string} [params.id] The ID of the file
 * @param {File} params.data The file data
 * @param {string[]} [params.permissions] The permissions for the file (optional)
 * @returns {Promise<Result<Models.File>>} The file
 */
export async function uploadFile({
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
        message: "File uploaded successfully.",
        data: response,
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
 * Deletes a file.
 * @param {string} id
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteFile(id: string): Promise<Result<undefined>> {
  return withAuth(async () => {
    const { storage } = await createSessionClient();

    try {
      await storage.deleteFile(PROJECT_BUCKET_ID, id);

      return {
        success: true,
        message: "File successfully deleted.",
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
