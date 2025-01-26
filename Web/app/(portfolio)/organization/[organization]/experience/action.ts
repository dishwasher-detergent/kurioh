"use server";

import { Experience } from "@/interfaces/experience.interface";
import { DATABASE_ID, EXPERIENCE_COLLECTION_ID } from "@/lib/constants";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";

import { ID } from "node-appwrite";

export async function addExperience(values: any, organizationId: string) {
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
    const data = await database.createDocument<Experience>(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      ID.unique(),
      {
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        company: values.company,
        skills: values.skills,
        website: values.website,
        createdBy: user.$id,
        organization_id: organizationId,
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
        message: "An unexpected error occurred. Could not add experience.",
      },
      data: null,
    };
  }
}

export async function updateExperience(id: string, values: any) {
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
    const data = await database.updateDocument<Experience>(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      id,
      {
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        company: values.company,
        skills: values.skills,
        website: values.website,
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
        message: "An unexpected error occurred. Could not update experience.",
      },
      data: null,
    };
  }
}

export async function removeExperience(id: string) {
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
    const data = await database.deleteDocument(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      id,
    );

    return {
      errors: null,
      data: data,
    };
  } catch (error) {
    console.error(error);

    return {
      errors: {
        message: "An unexpected error occurred. Could not remove experience.",
      },
      data: null,
    };
  }
}
