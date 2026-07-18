"use server";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { STORAGE_BUCKET } from "@/lib/constants";
import { s3 } from "@/lib/server/storage";

/**
 * Uploads a file.
 * @param {Object} params The parameters for creating a file
 * @param {string} [params.id] The ID of the file
 * @param {File} params.data The file data
 * @returns {Promise<Result<{ $id: string }>>} The uploaded object's key
 */
export async function uploadFile({
  id = crypto.randomUUID(),
  data,
}: {
  id?: string;
  data: File;
}): Promise<Result<{ $id: string }>> {
  return withAuth(async () => {
    try {
      const key = `${id}`;
      const buffer = Buffer.from(await data.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: STORAGE_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: data.type || undefined,
        }),
      );

      return {
        success: true,
        message: "File uploaded successfully.",
        data: { $id: key },
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
 * Deletes a file.
 * @param {string} key
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteFile(key: string): Promise<Result<undefined>> {
  return withAuth(async () => {
    try {
      await s3.send(
        new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }),
      );

      return {
        success: true,
        message: "File successfully deleted.",
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
