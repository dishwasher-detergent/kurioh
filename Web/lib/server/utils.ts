"use server";

import { Experience } from "@/interfaces/experience.interface";
import { Information } from "@/interfaces/information.interface";
import { Organization } from "@/interfaces/organization.interface";
import { Project } from "@/interfaces/project.interface";
import {
  DATABASE_ID,
  EXPERIENCE_COLLECTION_ID,
  HOSTNAME,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { createSlug } from "@/lib/utils";

import { ID, Permission, Query, Role } from "node-appwrite";

export async function getOrganization(organizationId: string) {
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
    const org = await database.getDocument<Organization>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
      organizationId,
    );

    if (!org) throw new Error("Missing organization.");

    const exp = await database.listDocuments<Experience>(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      [Query.equal("organization_id", organizationId)],
    );

    const information = await database.getDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      org.information_id,
    );

    return {
      errors: null,
      data: {
        organization: org,
        information: information,
        experience: exp.documents,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: "An unexpected error occurred. Could not get organization.",
      },
      data: null,
    };
  }
}

export async function getOrganizations() {
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
    const org = await database.listDocuments<Organization>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
    );

    return {
      errors: null,
      data: org.documents,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: "An unexpected error occurred. Could not get organizations.",
      },
      data: null,
    };
  }
}

export async function getProject(projectId: string) {
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
    const project = await database.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
    );

    return {
      errors: null,
      data: project,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: "An unexpected error occurred. Could not get project.",
      },
      data: null,
    };
  }
}

export async function getProjects(organizationId?: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  if (!organizationId) {
    return {
      errors: {
        message: "No organization was given.",
      },
      data: null,
    };
  }

  const { database } = await createSessionClient();

  try {
    const project = await database.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [Query.equal("organization_id", organizationId)],
    );

    return {
      errors: null,
      data: project.documents,
    };
  } catch {
    return {
      errors: {
        message: "An unexpected error occurred. Could not get projects.",
      },
      data: null,
    };
  }
}

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

export async function updateInformation(value: any) {
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

export async function createProject(name: string, organizationId?: string) {
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

  if (!organizationId) {
    return {
      errors: {
        message:
          "Failed to create project, no organization was given for this project.",
      },
      data: null,
    };
  }

  try {
    const data = await database.createDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      {
        title: name,
        short_description: null,
        description: null,
        slug: createSlug(name),
        organization_id: organizationId,
        createdBy: user.$id,
      },
      [
        Permission.read(Role.team(organizationId)),
        Permission.write(Role.team(organizationId)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ],
    );

    return {
      errors: null,
      data: data,
    };
  } catch (err) {
    return {
      errors: {
        message: "Failed to create project!",
      },
      data: null,
    };
  }
}

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

export async function deleteProject(id: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { storage, database } = await createSessionClient();

  try {
    const data = await database.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
    );

    Promise.all(
      data.image_ids.map((imageId) =>
        storage.deleteFile(PROJECTS_BUCKET_ID, imageId),
      ),
    );

    await database.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);

    return {
      errors: null,
      data: null,
    };
  } catch (err) {
    return {
      errors: {
        message: "Failed to delete project!",
      },
      data: null,
    };
  }
}

export async function createOrganization(name: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { database, team } = await createSessionClient();

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    return {
      errors: {
        message: "You've reached the maximum orgnaization limit.",
      },
      data: null,
    };
  }

  const organizationId = ID.unique();

  try {
    const teamData = await team.create(organizationId, name);

    const information = await database.createDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      organizationId,
      {
        title: name,
        createdBy: user.$id,
        organization_id: organizationId,
      },
      [
        Permission.read(Role.team(teamData.$id)),
        Permission.write(Role.team(teamData.$id)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ],
    );

    const data = await database.createDocument<Organization>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
      organizationId,
      {
        title: name,
        slug: createSlug(name),
        information_id: information.$id,
        createdBy: user.$id,
      },
      [
        Permission.read(Role.team(teamData.$id)),
        Permission.write(Role.team(teamData.$id)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ],
    );

    return {
      errors: null,
      data: data,
    };
  } catch {
    return {
      errors: {
        message: `Failed to create ${organizationId}!`,
      },
      data: null,
    };
  }
}

export async function deleteOrganization(organizationId?: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { database, team } = await createSessionClient();

  if (!organizationId) {
    return {
      errors: {
        message: "Failed to delete organization, no organization was given.",
      },
      data: null,
    };
  }

  let response;
  const queries = [
    Query.limit(50),
    Query.equal("organization_id", organizationId),
  ];

  do {
    response = await database.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      queries,
    );

    await Promise.all(
      response.documents.map((document) => deleteProject(document.$id)),
    );
  } while (response.documents.length > 0);

  await team.delete(organizationId);
  await database.deleteDocument(
    DATABASE_ID,
    ORGANIZATION_COLLECTION_ID,
    organizationId,
  );

  await database.deleteDocument(
    DATABASE_ID,
    INFORMATION_COLLECTION_ID,
    organizationId,
  );

  const data = await database.listDocuments<Organization>(
    DATABASE_ID,
    ORGANIZATION_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  return {
    errors: {
      message: "Failed to delete organization, no organization was given.",
    },
    data: data,
  };
}

export async function leaveOrganization(organizationId: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { database, team } = await createSessionClient();

  const memberships = await team.listMemberships(organizationId, [
    Query.equal("userId", user.$id),
  ]);

  const membership = memberships.memberships[0];

  if (!membership) {
    return {
      errors: {
        message: `An error occured while leaving ${organizationId}, please try again.`,
      },
      data: null,
    };
  }

  if (membership.roles.includes("owner")) {
    return {
      errors: {
        message:
          "The owner cannot leave their own organization, delete it instead.",
      },
      data: null,
    };
  }

  await team.deleteMembership(organizationId, membership.$id);

  const data = await database.listDocuments(
    DATABASE_ID,
    ORGANIZATION_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  if (data.documents.length > 0) {
    return data.documents[0].$id;
  }

  return {
    errors: {
      message: "No documents found.",
    },
    data: null,
  };
}

export async function shareOrganization(organizationId: string, email: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      errors: {
        message: "You must be logged in to perform this action.",
      },
      data: null,
    };
  }

  const { team } = await createSessionClient();

  try {
    await team.createMembership(
      organizationId,
      [],
      email,
      undefined,
      undefined,
      `${location.protocol}//${HOSTNAME}/${organizationId}/accept`,
      undefined,
    );
  } catch {
    return {
      errors: {
        message: `Failed to invite ${email} to ${organizationId}`,
      },
      data: null,
    };
  }

  return {
    errors: null,
    data: null,
  };
}
