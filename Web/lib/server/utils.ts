"use server";

import { Experience } from "@/interfaces/experience.interface";
import { Information } from "@/interfaces/information.interface";
import { Organization } from "@/interfaces/organization.interface";
import { Project } from "@/interfaces/project.interface";
import { Result } from "@/interfaces/result.interface";
import {
  COOKIE_KEY,
  DATABASE_ID,
  EXPERIENCE_COLLECTION_ID,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { createSlug } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ID, Models, Permission, Query, Role } from "node-appwrite";

export async function getOrganization(organizationId: string): Promise<Result<any>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Organization retrieved successfully.",
      data: {
        organization: org,
        information: information,
        experience: exp.documents,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Could not get organization.",
    };
  }
}

export async function getOrganizations(): Promise<Result<Organization[]>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    const org = await database.listDocuments<Organization>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
    );

    return {
      success: true,
      message: "Organizations retrieved successfully.",
      data: org.documents,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Could not get organizations.",
    };
  }
}

export async function getProject(projectId: string): Promise<Result<Project>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Project retrieved successfully.",
      data: project,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Could not get project.",
    };
  }
}

export async function getProjects(organizationId?: string): Promise<Result<Project[]>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  if (!organizationId) {
    return {
      success: false,
      message: "No organization id was given.",
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
      success: true,
      message: "Projects retrieved successfully.",
      data: project.documents,
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred. Could not get projects.",
    };
  }
}

export async function addExperience(values: any, organizationId: string): Promise<Result<Experience>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Experience added successfully.",
      data: data,
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not add experience.",
    };
  }
}

export async function updateExperience(id: string, values: any): Promise<Result<Experience>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Experience updated successfully.",
      data: data,
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not update experience.",
    };
  }
}

export async function removeExperience(id: string): Promise<Result<null>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    await database.deleteDocument(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      id,
    );

    return {
      success: true,
      message: "Experience removed successfully.",
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not remove experience.",
    };
  }
}

export async function updateInformation(value: any): Promise<Result<Information>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Information updated successfully.",
      data: data,
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not update information.",
    };
  }
}

export async function uploadFile(file: File, organizationId: string): Promise<Result<Models.File>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "File uploaded successfully.",
      data: response,
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not upload file.",
    };
  }
}

export async function deleteFile(id: string): Promise<Result<null>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { storage } = await createSessionClient();

  try {
    await storage.deleteFile(PROJECTS_BUCKET_ID, id);

    return {
      success: true,
      message: "File deleted successfully.",
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not delete file.",
    };
  }
}

export async function createProject(name: string, organizationId?: string): Promise<Result<Project>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  if (!organizationId) {
    return {
      success: false,
      message: "Failed to create project, no organization was given for this project.",
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
      success: true,
      message: "Project created successfully.",
      data: data,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to create project!",
    };
  }
}

export async function updateProject(id: string, values: any): Promise<Result<Project>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Project updated successfully.",
      data: data,
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not update project.",
    };
  }
}

export async function deleteProject(id: string): Promise<Result<null>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
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
      success: true,
      message: "Project deleted successfully.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to delete project!",
    };
  }
}

export async function createOrganization(name: string): Promise<Result<Organization>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    return {
      success: false,
      message: "You've reached the maximum orgnaization limit.",
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
      success: true,
      message: "Organization created successfully.",
      data: data,
    };
  } catch {
    return {
      success: false,
      message: `Failed to create ${organizationId}!`,
    };
  }
}

export async function deleteOrganization(organizationId?: string): Promise<Result<Organization[]>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  if (!organizationId) {
    return {
      success: false,
      message: "Failed to delete organization, no organization was given.",
    };
  }

  let response;
  const queries = [
    Query.limit(50),
    Query.equal("organization_id", organizationId),
  ];

  try {
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
      success: true,
      message: "Organization deleted successfully.",
      data: data.documents,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Could not delete organization.",
    };
  }
}

export async function leaveOrganization(organizationId: string): Promise<Result<string>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  const memberships = await team.listMemberships(organizationId, [
    Query.equal("userId", user.$id),
  ]);

  const membership = memberships.memberships[0];

  if (!membership) {
    return {
      success: false,
      message: `An error occured while leaving ${organizationId}, please try again.`,
    };
  }

  if (membership.roles.includes("owner")) {
    return {
      success: false,
      message: "The owner cannot leave their own organization, delete it instead.",
    }
  }

  await team.deleteMembership(organizationId, membership.$id);

  const data = await database.listDocuments<Organization>(
    DATABASE_ID,
    ORGANIZATION_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  if (data.documents.length > 0) {
    return {
      success: true,
      message: "Organization left successfully.",
      data: data.documents[0].$id
    };
  }

  return {
    success: false,
    message: "No documents found.",
  };
}

export async function setLastVisitedOrganization(organizationId: string): Promise<Result<null>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { account } = await createSessionClient();

  try {
    await account.updatePrefs({
      lastVisitedOrg: organizationId,
    });

    return {
      success: true,
      message: "Last visited organization set successfully.",
    };
  } catch (error) {

    return {
      success: false,
      message: "An unexpected error occurred. Could not set last visited organization.",
    };
  }
}

export async function logOut() {
  const { account } = await createSessionClient();

  account.deleteSession("current");
  (await cookies()).delete(COOKIE_KEY);

  redirect("/login");
}
