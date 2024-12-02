import { Portfolio } from "@/interfaces/portfolio.interface";
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
import { generate } from "random-words";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createProject() {
  const { database } = await createClient();
  const user = await getLoggedInUser();
  const currentProject = "TEST";

  if (!user) {
    return;
  }

  try {
    const data = await database.createDocument<Project>(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      ID.unique(),
      {},
      [
        Permission.read(Role.team(currentProject)),
        Permission.write(Role.team(currentProject)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ],
    );

    toast.success(`${data.$id} has been created!`);
    return data;
  } catch (err) {
    toast.error(`Failed to create project!`);
    return;
  }
}

export async function createPortfolio() {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();
  const maxCheckCount = 5;
  let id = generate({
    exactly: 10,
    wordsPerString: 3,
    separator: "-",
  }) as string[];

  if (!user) {
    return;
  }

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    toast.error("You've reached the maximum orgnaization limit.");
    return null;
  }

  let doesPortfolioExist = true;
  let checks = 0;
  let portfolioId;

  do {
    checks++;
    const checkedPortfolios = await database.listDocuments(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      [Query.equal("$id", id)],
    );

    if (checkedPortfolios.total < 10) {
      doesPortfolioExist = false;
      portfolioId = id.filter(
        (x) => !checkedPortfolios.documents.map((y) => y.$id).includes(x),
      )[0];
    } else {
      id = generate({
        exactly: 10,
        wordsPerString: 3,
        separator: "-",
      }) as string[];
    }
  } while (doesPortfolioExist == true || checks == maxCheckCount);

  if (checks == maxCheckCount) {
    toast.error("Could not find valid org name.");

    return;
  }

  if (!portfolioId) {
    toast.error("Could not generate valid org name.");

    return;
  }

  try {
    const teamData = await team.create(portfolioId, portfolioId);

    const data = await database.createDocument<Portfolio>(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      portfolioId,
      {
        shared: false,
        description: null,
      },
      [
        Permission.read(Role.team(teamData.$id)),
        Permission.write(Role.team(teamData.$id)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ],
    );

    toast.success(`${data.$id} has been created!`);
    return data;
  } catch {
    toast.error(`Failed to create ${portfolioId}!`);
    return;
  }
}

export async function deletePortfolio(portfolioId: string) {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  let response;
  const queries = [Query.limit(50), Query.equal("portfolioId", portfolioId)];

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

  await team.delete(portfolioId);
  await database.deleteDocument(
    DATABASE_ID,
    PORTFOLIOS_COLLECTION_ID,
    portfolioId,
  );

  const data = await database.listDocuments(
    DATABASE_ID,
    PORTFOLIOS_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  toast.error(`${portfolioId} has been deleted!`);

  if (data.documents.length > 0) {
    return data.documents[0].$id;
  }

  return null;
}

export async function leavePortfolio(portfolioId: string) {
  const { database, team } = await createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  const memberships = await team.listMemberships(portfolioId, [
    Query.equal("userId", user.$id),
  ]);

  const membership = memberships.memberships[0];

  if (!membership) {
    toast.error(
      `An error occured while leaving ${portfolioId}, please try again.`,
    );
    return;
  }

  if (membership.roles.includes("owner")) {
    toast.error(
      "The owner cannot leave their own portfolio, delete it instead.",
    );
    return;
  }

  await team.deleteMembership(portfolioId, membership.$id);

  const data = await database.listDocuments(
    DATABASE_ID,
    PORTFOLIOS_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  toast.error(`You've left ${portfolioId}!`);

  if (data.documents.length > 0) {
    return data.documents[0].$id;
  }

  return null;
}

export async function sharePortfolio(portfolioId: string, email: string) {
  const { team } = await createClient();

  try {
    await team.createMembership(
      portfolioId,
      [],
      email,
      undefined,
      undefined,
      `${location.protocol}//${HOSTNAME}/${portfolioId}/accept`,
      undefined,
    );
  } catch {
    toast.error(`Failed to invite ${email} to ${portfolioId}`);
    return;
  }

  toast.success(`${email} has been invited to ${portfolioId}`);
  return;
}
