"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { Information } from "@/interfaces/information.interface";
import { Project } from "@/interfaces/project.interface";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import {
  DATABASE_ID,
  INFORMATION_COLLECTION_ID,
  PROJECT_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteFile, uploadFile } from "@/lib/storage";
import {
  AddProjectFormData,
  EditInformationFormData,
  EditProjectFormData,
} from "./schemas";

/**
 * Get a list of projects
 * @param {string[]} queries The queries to filter the projects
 * @returns {Promise<Result<Models.DocumentList<Project>>>} The list of projects
 */
export async function listProjects(
  queries: string[] = []
): Promise<Result<Models.DocumentList<Project>>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (queries, userId) => {
        try {
          const projects = await database.listDocuments<Project>(
            DATABASE_ID,
            PROJECT_COLLECTION_ID,
            queries
          );

          const userIds = projects.documents.map((project) => project.userId);
          const uniqueUserIds = Array.from(new Set(userIds));

          const teamIds = projects.documents.map((project) => project.teamId);
          const uniqueTeamIds = Array.from(new Set(teamIds));

          const users = await database.listDocuments<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            [Query.equal("$id", uniqueUserIds), Query.select(["$id", "name"])]
          );

          const teams = await database.listDocuments<UserData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            [Query.equal("$id", uniqueTeamIds), Query.select(["$id", "name"])]
          );

          const userMap = users.documents.reduce<Record<string, UserData>>(
            (acc, user) => {
              if (user) {
                acc[user.$id] = user;
              }
              return acc;
            },
            {}
          );

          const teamMap = teams.documents.reduce<Record<string, TeamData>>(
            (acc, team) => {
              if (team) {
                acc[team.$id] = team;
              }
              return acc;
            },
            {}
          );

          const newProjects = projects.documents.map((project) => ({
            ...project,
            user: userMap[project.userId],
            team: teamMap[project.teamId],
          }));

          projects.documents = newProjects;

          return {
            success: true,
            message: "Projects successfully retrieved.",
            data: projects,
          };
        } catch (err) {
          const error = err as Error;

          console.error(error);

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["projects"],
      {
        tags: [
          "projects",
          `projects:${queries.join("-")}`,
          `projects:user-${user.$id}`,
        ],
        revalidate: 600,
      }
    )(queries, user.$id);
  });
}

/**
 * Get a project by ID
 * @param {string} projectId The ID of the project
 * @param {string[]} queries The queries to filter the project
 * @returns {Promise<Result<Project>>} The project
 */
export async function getProjectById(
  projectId: string,
  queries: string[] = []
): Promise<Result<Project>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async () => {
        try {
          const project = await database.getDocument<Project>(
            DATABASE_ID,
            PROJECT_COLLECTION_ID,
            projectId,
            queries
          );

          const userRes = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            project.userId,
            [Query.select(["$id", "name"])]
          );

          const teamRes = await database.getDocument<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            project.teamId,
            [Query.select(["$id", "name"])]
          );

          return {
            success: true,
            message: "Project successfully retrieved.",
            data: {
              ...project,
              user: userRes,
              team: teamRes,
            },
          };
        } catch (err) {
          const error = err as Error;

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["project", projectId],
      {
        tags: ["projects", `project:${projectId}`],
        revalidate: 600,
      }
    )();
  });
}

/**
 * Create a project
 * @param {Object} params The parameters for creating a project
 * @param {string} [params.id] The ID of the project (optional)
 * @param {AddProjectFormData} params.data The project data
 * @param {string[]} [params.permissions] The permissions for the project (optional)
 * @returns {Promise<Result<Project>>} The created project
 */
export async function createProject({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: AddProjectFormData;
  permissions?: string[];
}): Promise<Result<Project>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.team(data.teamId)),
    ];

    try {
      if (data.image instanceof File) {
        const image = await uploadFile({
          data: data.image,
          permissions: [Permission.read(Role.team(data.teamId))],
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      }

      const project = await database.createDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
        },
        permissions
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        project.userId,
        [Query.select(["$id", "name"])]
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        project.teamId,
        [Query.select(["$id", "name"])]
      );

      revalidateTag("projects");

      return {
        success: true,
        message: "Project successfully created.",
        data: {
          ...project,
          user: userRes,
          team: teamRes,
        },
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Update a project
 * @param {Object} params The parameters for creating a project
 * @param {string} [params.id] The ID of the project
 * @param {EditProjectFormData} params.data The project data
 * @param {string[]} [params.permissions] The permissions for the project (optional)
 * @returns {Promise<Result<Project>>} The updated project
 */
export async function updateProject({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditProjectFormData;
  permissions?: string[];
}): Promise<Result<Project>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      const existingProject = await database.getDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id
      );

      if (data.image instanceof File) {
        if (existingProject.image) {
          await deleteFile(existingProject.image);
        }

        const image = await uploadFile({
          data: data.image,
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      } else if (data.image === null && existingProject.image) {
        const image = await deleteFile(existingProject.image);

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = null;
      }

      const project = await database.updateDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
        },
        permissions
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        project.userId,
        [Query.select(["$id", "name"])]
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        project.teamId,
        [Query.select(["$id", "name"])]
      );

      revalidateTag("projects");
      revalidateTag(`project:${id}`);

      return {
        success: true,
        message: "Project successfully updated.",
        data: {
          ...project,
          user: userRes,
          team: teamRes,
        },
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Delete a project
 * @param {string} id The ID of the project
 * @returns {Promise<Result<Project>>} The deleted project
 */
export async function deleteProject(id: string): Promise<Result<Project>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    try {
      const project = await database.getDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id
      );

      if (project.image) {
        const image = await deleteFile(project.image);

        if (!image.success) {
          throw new Error(image.message);
        }
      }

      await database.deleteDocument(DATABASE_ID, PROJECT_COLLECTION_ID, id);

      revalidateTag("projects");

      return {
        success: true,
        message: "Project successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Get a information by ID
 * @param {string} informationId The ID of the information
 * @param {string[]} queries The queries to filter the information
 * @returns {Promise<Result<Information>>} The information
 */
export async function getInformationById(
  informationId: string,
  queries: string[] = []
): Promise<Result<Information>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async () => {
        try {
          const information = await database.getDocument<Information>(
            DATABASE_ID,
            INFORMATION_COLLECTION_ID,
            informationId,
            queries
          );

          const userRes = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            information.userId,
            [Query.select(["$id", "name"])]
          );

          const teamRes = await database.getDocument<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            information.teamId,
            [Query.select(["$id", "name"])]
          );

          return {
            success: true,
            message: "Information successfully retrieved.",
            data: {
              ...information,
              user: userRes,
              team: teamRes,
            },
          };
        } catch (err) {
          const error = err as Error;

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["information", informationId],
      {
        tags: [`information:${informationId}`],
        revalidate: 600,
      }
    )();
  });
}

/**
 * Update a information
 * @param {Object} params The parameters for creating a information
 * @param {string} [params.id] The ID of the information
 * @param {EditProjectFormData} [params.data] The information data
 * @param {string[]} [params.permissions] The permissions for the information (optional)
 * @returns {Promise<Result<Information>>} The updated information
 */
export async function updateInformation({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditInformationFormData;
  permissions?: string[];
}): Promise<Result<Information>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      const existingInformation = await database.getDocument<Information>(
        DATABASE_ID,
        INFORMATION_COLLECTION_ID,
        id
      );

      if (data.image instanceof File) {
        if (existingInformation.image) {
          await deleteFile(existingInformation.image);
        }

        const image = await uploadFile({
          data: data.image,
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      } else if (data.image === null && existingInformation.image) {
        const image = await deleteFile(existingInformation.image);

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = null;
      }

      const information = await database.updateDocument<Information>(
        DATABASE_ID,
        INFORMATION_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
        },
        permissions
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        information.userId,
        [Query.select(["$id", "name"])]
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        information.teamId,
        [Query.select(["$id", "name"])]
      );

      revalidateTag(`information:${id}`);

      return {
        success: true,
        message: "Information successfully updated.",
        data: {
          ...information,
          user: userRes,
          team: teamRes,
        },
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}
