import { Organization } from "@/interfaces/organization.interface";
import { Project } from "@/interfaces/project.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import {
  DATABASE_ID,
  HOSTNAME,
  PORTFOLIOS_COLLECTION_ID,
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

export async function createProject(organizationId: string, name: string) {
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
        ordinal: 1,
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
    console.error(err);

    toast.error(`Failed to create project!`);
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
    const teamData = await team.create(organizationId, organizationId);

    const data = await database.createDocument<Organization>(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      organizationId,
      {
        title: name,
        slug: createSlug(name),
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

export async function deleteOrganization(organizationId: string) {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  let response;
  const queries = [
    Query.limit(50),
    Query.equal("organizationId", organizationId),
  ];

  do {
    response = await database.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      queries,
    );

    await Promise.all(
      response.documents.map((document) =>
        database.deleteDocument(
          DATABASE_ID,
          PROJECTS_COLLECTION_ID,
          document.$id,
        ),
      ),
    );
  } while (response.documents.length > 0);

  await team.delete(organizationId);
  await database.deleteDocument(
    DATABASE_ID,
    PORTFOLIOS_COLLECTION_ID,
    organizationId,
  );

  const data = await database.listDocuments(
    DATABASE_ID,
    PORTFOLIOS_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  toast.error(`${organizationId} has been deleted!`);

  if (data.documents.length > 0) {
    return data.documents[0].$id;
  }

  return null;
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
    PORTFOLIOS_COLLECTION_ID,
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
