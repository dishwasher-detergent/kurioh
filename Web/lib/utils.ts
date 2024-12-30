import { Experience } from "@/interfaces/experience.interface";
import { Information } from "@/interfaces/information.interface";
import { Organization } from "@/interfaces/organization.interface";
import { Project } from "@/interfaces/project.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import {
  DATABASE_ID,
  EXPERIENCE_COLLECTION_ID,
  HOSTNAME,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
} from "@/lib/constants";

import { ID, Permission, Query, Role } from "appwrite";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function formatDate(date: Date | string): string {
  date = new Date(date);
  const day = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
  const month = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function extractWebsiteName(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.hostname.split(".");
    return parts[parts.length - 2];
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export async function createProject(name: string, organizationId?: string) {
  const { database } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to create project, no user is defined. Please try logging out and back in.",
    );
    return;
  }

  if (!organizationId) {
    toast.error(
      "Failed to create project, no organization was given for this project.",
    );
    return;
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

    toast.success(`${data.title} has been created!`);
    return data;
  } catch (err) {
    toast.error(`Failed to create project!`);
    return;
  }
}

export async function updateProject(id: string, values: any) {
  const { database } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to update project, no user is defined. Please try logging out and back in.",
    );
    return;
  }

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

    toast.success(`${data.title} has been updated!`);
    return data;
  } catch (err) {
    toast.error(`Failed to update project!`);
    return;
  }
}

export async function deleteProject(id: string) {
  const { database, storage } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to delete project, no user is defined. Please try logging out and back in.",
    );
    return;
  }

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
    toast.success(`Project has been deleted!`);
    return;
  } catch (err) {
    toast.error(`Failed to delete project!`);
    return;
  }
}

export async function createOrganization(name: string) {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    toast.error("You've reached the maximum orgnaization limit.");
    return null;
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

    toast.success(`${data.title} has been created!`);
    return data;
  } catch {
    toast.error(`Failed to create ${organizationId}!`);
    return;
  }
}

export async function deleteOrganization(organizationId?: string) {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to delete organization, no user is defined. Please try logging out and back in.",
    );
    return;
  }

  if (!organizationId) {
    toast.error("Failed to delete organization, no organization was given.");
    return;
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

  toast.error(`${organizationId} has been deleted!`);

  return data;
}

export async function leaveOrganization(organizationId: string) {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  const memberships = await team.listMemberships(organizationId, [
    Query.equal("userId", user.$id),
  ]);

  const membership = memberships.memberships[0];

  if (!membership) {
    toast.error(
      `An error occured while leaving ${organizationId}, please try again.`,
    );
    return;
  }

  if (membership.roles.includes("owner")) {
    toast.error(
      "The owner cannot leave their own organization, delete it instead.",
    );
    return;
  }

  await team.deleteMembership(organizationId, membership.$id);

  const data = await database.listDocuments(
    DATABASE_ID,
    ORGANIZATION_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  toast.error(`You've left ${organizationId}!`);

  if (data.documents.length > 0) {
    return data.documents[0].$id;
  }

  return null;
}

export async function shareOrganization(organizationId: string, email: string) {
  const { team } = await createClient();

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
    toast.error(`Failed to invite ${email} to ${organizationId}`);
    return;
  }

  toast.success(`${email} has been invited to ${organizationId}`);
  return;
}

export async function updateInformation(id: string, values: any) {
  const { database } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to update information, no user is defined. Please try logging out and back in.",
    );
    return;
  }

  try {
    const data = await database.updateDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      id,
      {
        title: values.title,
        description: values.description,
        socials: values.socials,
        image_id: values.image_id,
      },
    );

    toast.success(`${data.title} has been updated!`);
    return data;
  } catch (err) {
    toast.error(`Failed to update information!`);
    return;
  }
}

export async function addExperience(values: any, organizationId: string) {
  const { database } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to add experience, no user is defined. Please try logging out and back in.",
    );
    return;
  }

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

    toast.success(`${data.title} has been added!`);
    return data;
  } catch (err) {
    toast.error(`Failed to add experience!`);
    return;
  }
}

export async function updateExperience(id: string, values: any) {
  const { database } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to update experience, no user is defined. Please try logging out and back in.",
    );
    return;
  }

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

    toast.success(`${data.title} has been updated!`);
    return data;
  } catch (err) {
    toast.error(`Failed to update experience!`);
    return;
  }
}

export async function removeExperience(id: string) {
  const { database } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to add remove, no user is defined. Please try logging out and back in.",
    );
    return;
  }

  try {
    const data = await database.deleteDocument(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      id,
    );

    toast.success(`Experience has been removed!`);
    return data;
  } catch (err) {
    toast.error(`Failed to remove experience!`);
    return;
  }
}

export async function uploadFile(file: File, organizationId: string) {
  const { storage } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to upload file, no user is defined. Please try logging out and back in.",
    );
    return;
  }

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

    return response;
  } catch {
    toast.error(`Failed to upload ${file.name}.`);
    return;
  }
}

export async function deleteFile(id: string) {
  const { storage } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    toast.error(
      "Failed to upload file, no user is defined. Please try logging out and back in.",
    );
    return;
  }

  try {
    const response = await storage.deleteFile(PROJECTS_BUCKET_ID, id);

    return response;
  } catch {
    toast.error("Failed to delete file.");
    return;
  }
}
