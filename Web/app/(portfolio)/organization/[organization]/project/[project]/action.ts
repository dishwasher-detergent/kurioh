"use server";

import { Project } from "@/interfaces/project.interface";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/lib/constants";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { createSlug } from "@/lib/utils";

export async function updateProject(id: string, values: any) {
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
    const data = await database.updateDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
      {
        title: values.title,
        short_description: values.short_description,
        description: values.description,
        slug: createSlug(values.title),
        tags: values.tags,
        links: values.links,
        image_ids: values.image_ids,
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
        message: "An unexpected error occurred. Could not update project.",
      },
      data: null,
    };
  }
}
