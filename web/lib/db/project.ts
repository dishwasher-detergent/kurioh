"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { Project } from "@/interfaces/project.interface";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import {
  DATABASE_ID,
  PROJECT_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteFile, uploadFile } from "@/lib/storage";
import { createSlug } from "@/lib/utils";
import { AddProjectFormData, EditProjectFormData } from "./schemas";

/**
 * Get a list of projects
 * @param {string[]} queries The queries to filter the projects
 * @returns {Promise<Result<Models.DocumentList<Project>>>} The list of projects
 */
export async function listProjectsByTeam(
  id: string,
  queries: string[] = [],
): Promise<Result<Models.DocumentList<Project>>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (queries, id, userId) => {
        try {
          const projects = await database.listDocuments<Project>(
            DATABASE_ID,
            PROJECT_COLLECTION_ID,
            [Query.equal("teamId", id), ...queries],
          );

          if (!projects.documents.length) {
            return {
              success: true,
              message: "No projects found.",
              data: projects,
            };
          }

          const userIds = projects.documents.map((project) => project.userId);
          const uniqueUserIds = Array.from(new Set(userIds));

          const teamIds = projects.documents.map((project) => project.teamId);
          const uniqueTeamIds = Array.from(new Set(teamIds));

          const users = await database.listDocuments<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            [Query.equal("$id", uniqueUserIds), Query.select(["$id", "name"])],
          );

          const teams = await database.listDocuments<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            [Query.equal("$id", uniqueTeamIds), Query.select(["$id", "name"])],
          );

          const userMap = users.documents.reduce<Record<string, UserData>>(
            (acc, user) => {
              if (user) {
                acc[user.$id] = user;
              }
              return acc;
            },
            {},
          );

          const teamMap = teams.documents.reduce<Record<string, TeamData>>(
            (acc, team) => {
              if (team) {
                acc[team.$id] = team;
              }
              return acc;
            },
            {},
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
          `projects:team-${id}`,
        ],
        revalidate: 600,
      },
    )(queries, id, user.$id);
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
  queries: string[] = [],
): Promise<Result<Project>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async (projectId, queries) => {
        try {
          const project = await database.getDocument<Project>(
            DATABASE_ID,
            PROJECT_COLLECTION_ID,
            projectId,
            queries,
          );

          const userRes = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            project.userId,
            [Query.select(["$id", "name"])],
          );

          const teamRes = await database.getDocument<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            project.teamId,
            [Query.select(["$id", "name"])],
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

          console.error(error);

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["projects", projectId],
      {
        tags: [
          "projects",
          `project:${projectId}`,
          `project:${projectId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      },
    )(projectId, queries);
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
      Permission.write(Role.team(data.teamId)),
    ];

    try {
      const existingProject = await database.listDocuments<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [
          Query.orderDesc("ordinal"),
          Query.limit(1),
          Query.equal("teamId", data.teamId),
          Query.select(["ordinal"]),
        ],
      );

      const project = await database.createDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id,
        {
          ...data,
          slug: createSlug(data.name),
          ordinal: existingProject.documents[0]?.ordinal + 1 || 1,
          userId: user.$id,
        },
        permissions,
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        project.userId,
        [Query.select(["$id", "name"])],
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        project.teamId,
        [Query.select(["$id", "name"])],
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

      // This is where you would look to something like Splunk.
      console.error(error);

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
  teamId,
  data,
  permissions = undefined,
}: {
  id: string;
  teamId: string;
  data: EditProjectFormData;
  permissions?: string[];
}): Promise<Result<Project>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      const existingProject = await database.getDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id,
      );

      // Handle ordinal changes and reordering
      if (existingProject.ordinal !== data.ordinal) {
        // Get all projects for this team to manage ordinals
        const allProjects = await database.listDocuments<Project>(
          DATABASE_ID,
          PROJECT_COLLECTION_ID,
          [Query.equal("teamId", teamId), Query.orderAsc("ordinal")],
        );

        const oldOrdinal = existingProject.ordinal;
        const newOrdinal = data.ordinal;

        // Update other projects' ordinals based on move direction
        if (oldOrdinal < newOrdinal) {
          // Moving down: Projects between old and new positions move up
          for (const project of allProjects.documents) {
            if (
              project.$id !== id &&
              project.ordinal > oldOrdinal &&
              project.ordinal <= newOrdinal
            ) {
              await database.updateDocument(
                DATABASE_ID,
                PROJECT_COLLECTION_ID,
                project.$id,
                { ordinal: project.ordinal - 1 },
              );
            }
          }
        } else if (oldOrdinal > newOrdinal) {
          // Moving up: Projects between new and old positions move down
          for (const project of allProjects.documents) {
            if (
              project.$id !== id &&
              project.ordinal >= newOrdinal &&
              project.ordinal < oldOrdinal
            ) {
              await database.updateDocument(
                DATABASE_ID,
                PROJECT_COLLECTION_ID,
                project.$id,
                { ordinal: project.ordinal + 1 },
              );
            }
          }
        }
      }

      if (data.images) {
        const existingImageIds = Array.isArray(existingProject.images)
          ? existingProject.images
          : [];
        const newImageIds: string[] = [];

        const imageIdsToKeep = data.images.filter(
          (img) => typeof img === "string",
        ) as string[];

        for (const oldImageId of existingImageIds) {
          if (!imageIdsToKeep.includes(oldImageId)) {
            await deleteFile(oldImageId);
          }
        }

        for (const img of data.images) {
          if (img instanceof File) {
            const uploadResult = await uploadFile({
              data: img,
              permissions: [
                Permission.read(Role.team(teamId)),
                Permission.write(Role.team(teamId)),
              ],
            });

            if (!uploadResult.success) {
              throw new Error(uploadResult.message);
            }

            if (uploadResult.data?.$id) {
              newImageIds.push(uploadResult.data.$id);
            }
          } else if (typeof img === "string") {
            newImageIds.push(img);
          }
        }

        // Update the images array with the final set of image IDs
        data.images = newImageIds;
      }

      const project = await database.updateDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id,
        {
          ...data,
          tags:
            data.tags?.map((tag) =>
              typeof tag === "string" ? tag : tag.value,
            ) || [],
          links:
            data.links?.map((link) =>
              typeof link === "string" ? link : link.value,
            ) || [],
          userId: user.$id,
        },
        permissions,
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        project.userId,
        [Query.select(["$id", "name"])],
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        project.teamId,
        [Query.select(["$id", "name"])],
      );

      revalidateTag("projects");
      revalidateTag(`project:${id}`);
      revalidateTag(`projects:team-${teamId}`);

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

      // This is where you would look to something like Splunk.
      console.error(error);

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
        id,
      );

      if (project.images) {
        for (const imageId of project.images) {
          const image = await deleteFile(imageId);

          if (!image.success) {
            throw new Error(image.message);
          }
        }
      }

      await database.deleteDocument(DATABASE_ID, PROJECT_COLLECTION_ID, id);

      revalidateTag(`projects:team-${project.teamId}`);

      return {
        success: true,
        message: "Project successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}
