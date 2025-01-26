"use server";

import { Information } from "@/interfaces/information.interface";
import {
  DATABASE_ID,
  INFORMATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
} from "@/lib/constants";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { ID, Permission, Role } from "node-appwrite";

export async function submitForm(value: any) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { database } = await createSessionClient();

  try {
    const data = await database.updateDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      value.id,
      {
        title: value.title,
        description: value.description,
        socials: value.socials,
        image_id: value.image_id,
      },
    );

    return {
      errors: null,
      data: data,
    };
  } catch (error) {
    console.error(error);

    return {
      errors: {
        message: "An unexpected error occurred. Could not update information.",
      },
      data: null,
    };
  }
}

export async function uploadFile(file: File, organizationId: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { storage } = await createSessionClient();

  try {
    const response = await storage.createFile(
      PROJECTS_BUCKET_ID,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()),
        Permission.read(Role.user(user.$id)),
        Permission.write(Role.user(user.$id)),
        Permission.read(Role.team(organizationId)),
        Permission.write(Role.team(organizationId)),
      ],
    );

    return {
      errors: null,
      data: response,
    };
  } catch (error) {
    console.error(error);

    return {
      errors: {
        message: "An unexpected error occurred. Could not upload file.",
      },
      data: null,
    };
  }
}

export async function deleteFile(id: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { storage } = await createSessionClient();

  try {
    const response = await storage.deleteFile(PROJECTS_BUCKET_ID, id);

    return {
      errors: null,
      data: response,
    };
  } catch (error) {
    console.error(error);

    return {
      errors: {
        message: "An unexpected error occurred. Could not delete file.",
      },
      data: null,
    };
  }
}
