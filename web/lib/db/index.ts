"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { Experience } from "@/interfaces/experience.interface";
import { Information } from "@/interfaces/information.interface";
import { Project } from "@/interfaces/project.interface";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import {
  DATABASE_ID,
  EXPERIENCE_COLLECTION_ID,
  INFORMATION_COLLECTION_ID,
  PROJECT_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteFile, uploadFile } from "@/lib/storage";
import { createSlug } from "@/lib/utils";
import {
  AddProjectFormData,
  EditExperienceFormData,
  EditInformationFormData,
  EditProjectFormData,
} from "./schemas";

/**
 * Get a list of projects
 * @param {string[]} queries The queries to filter the projects
 * @returns {Promise<Result<Models.DocumentList<Project>>>} The list of projects
 */
export async function listProjectsByTeam(
  id: string,
  queries: string[] = []
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
            [Query.equal("teamId", id), ...queries]
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
          `projects:team-${id}`,
        ],
        revalidate: 600,
      }
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
  queries: string[] = []
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
      ["projects", projectId],
      {
        tags: [
          "projects",
          `project:${projectId}`,
          `project:${projectId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      }
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
      const project = await database.createDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        id,
        {
          ...data,
          slug: createSlug(data.name),
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
        id
      );

      if (data.images) {
        const existingImageIds = Array.isArray(existingProject.images)
          ? existingProject.images
          : [];
        const newImageIds: string[] = [];

        const imageIdsToKeep = data.images.filter(
          (img) => typeof img === "string"
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
              typeof tag === "string" ? tag : tag.value
            ) || [],
          links:
            data.links?.map((link) =>
              typeof link === "string" ? link : link.value
            ) || [],
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
        id
      );

      if (project.image) {
        const image = await deleteFile(project.image);

        if (!image.success) {
          throw new Error(image.message);
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
      async (informationId) => {
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
        tags: [
          "information",
          `information:${informationId}`,
          `information:team-${informationId}`,
          `information:${informationId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      }
    )(informationId);
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
  teamId,
  data,
  permissions = undefined,
}: {
  id: string;
  teamId: string;
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
          permissions: [
            Permission.read(Role.team(teamId)),
            Permission.write(Role.team(teamId)),
          ],
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
          socials:
            data.socials?.map((social) =>
              typeof social === "string" ? social : social.value
            ) || [],
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
      revalidateTag(`information:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

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
 * Get a list of experiences for a team
 * @param {string} teamId The ID of the team
 * @param {string[]} queries The queries to filter the experiences
 * @returns {Promise<Result<Models.DocumentList<Experience>>>} The list of experiences
 */
export async function listExperiences(
  teamId: string,
  queries: string[] = []
): Promise<Result<Models.DocumentList<Experience>>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (teamId, queries, userId) => {
        try {
          const experiences = await database.listDocuments<Experience>(
            DATABASE_ID,
            EXPERIENCE_COLLECTION_ID,
            [Query.equal("teamId", teamId), ...queries]
          );

          return {
            success: true,
            message: "Experiences successfully retrieved.",
            data: experiences,
          };
        } catch (err) {
          const error = err as Error;

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["experiences", teamId],
      {
        tags: [
          "experiences",
          `experiences:team-${teamId}`,
          `experiences:team-${teamId}:${queries.join("-")}`,
        ],
        revalidate: 600,
      }
    )(teamId, queries, user.$id);
  });
}

/**
 * Create an experience
 * @param {Object} params The parameters for creating an experience
 * @param {string} [params.id] The ID of the experience (optional)
 * @param {EditExperienceFormData} params.data The experience data
 * @param {string} params.teamId The ID of the team
 * @param {string[]} [params.permissions] The permissions for the experience (optional)
 * @returns {Promise<Result<Experience>>} The created experience
 */
export async function createExperience({
  id = ID.unique(),
  data,
  teamId,
  permissions = [],
}: {
  id?: string;
  data: EditExperienceFormData;
  teamId: string;
  permissions?: string[];
}): Promise<Result<Experience>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.team(teamId)),
      Permission.write(Role.team(teamId)),
    ];

    try {
      const experience = await database.createDocument<Experience>(
        DATABASE_ID,
        EXPERIENCE_COLLECTION_ID,
        id,
        {
          ...data,
          website:
            data.website && data.website != ""
              ? new URL(data.website)
              : undefined,
          skills:
            data.skills?.map((skill) =>
              typeof skill === "string" ? skill : skill.value
            ) || [],
          userId: user.$id,
          teamId,
        },
        permissions
      );

      revalidateTag(`experiences:team-${teamId}`);
      revalidateTag(`experience:${experience.$id}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: "Experience successfully created.",
        data: experience,
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
 * Update an experience
 * @param {Object} params The parameters for updating an experience
 * @param {string} params.id The ID of the experience
 * @param {EditExperienceFormData} params.data The experience data
 * @param {string[]} [params.permissions] The permissions for the experience (optional)
 * @returns {Promise<Result<Experience>>} The updated experience
 */
export async function updateExperience({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditExperienceFormData;
  permissions?: string[];
}): Promise<Result<Experience>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      await database.getDocument<Experience>(
        DATABASE_ID,
        EXPERIENCE_COLLECTION_ID,
        id
      );

      const experience = await database.updateDocument<Experience>(
        DATABASE_ID,
        EXPERIENCE_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
          skills: data.skills || [],
        },
        permissions
      );

      revalidateTag(`experiences:team-${experience.teamId}`);
      revalidateTag(`experience:${experience.$id}`);
      revalidateTag(`team:${experience.teamId}`);

      return {
        success: true,
        message: "Experience successfully updated.",
        data: experience,
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
 * Delete an experience
 * @param {string} id The ID of the experience
 * @returns {Promise<Result<Experience>>} The deleted experience
 */
export async function deleteExperience(
  id: string
): Promise<Result<Experience>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    try {
      const experience = await database.getDocument<Experience>(
        DATABASE_ID,
        EXPERIENCE_COLLECTION_ID,
        id
      );

      await database.deleteDocument(DATABASE_ID, EXPERIENCE_COLLECTION_ID, id);

      revalidateTag(`experiences:team-${experience.teamId}`);
      revalidateTag(`experience:${experience.$id}`);
      revalidateTag(`team:${experience.teamId}`);

      return {
        success: true,
        message: "Experience successfully deleted.",
        data: experience,
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
 * Update multiple experiences for a team
 * @param {Object} params The parameters for updating experiences
 * @param {string} params.teamId The ID of the team
 * @param {EditExperienceFormData[]} params.experiences The experience data array
 * @returns {Promise<Result<{ added: number, updated: number, deleted: number }>>} Results summary
 */
export async function updateTeamExperiences({
  teamId,
  experiences,
}: {
  teamId: string;
  experiences: EditExperienceFormData[];
}): Promise<Result<{ added: number; updated: number; deleted: number }>> {
  return withAuth(async () => {
    try {
      const existingExperiencesResult = await listExperiences(teamId);

      if (!existingExperiencesResult.success) {
        return {
          success: false,
          message: existingExperiencesResult.message,
        };
      }

      const existingExperiences =
        existingExperiencesResult.data?.documents || [];

      const newExperienceIds = experiences
        .filter((exp) => exp.id)
        .map((exp) => exp.id as string);

      const toDelete = existingExperiences.filter(
        (exp) => !newExperienceIds.includes(exp.$id)
      );

      let deletedCount = 0;
      for (const exp of toDelete) {
        const result = await deleteExperience(exp.$id);
        if (result.success) deletedCount++;
      }

      let updatedCount = 0;
      let addedCount = 0;

      for (const exp of experiences) {
        if (exp.id) {
          const result = await updateExperience({
            id: exp.id,
            data: exp,
          });
          if (result.success) updatedCount++;
        } else {
          const result = await createExperience({
            data: exp,
            teamId,
          });
          if (result.success) addedCount++;
        }
      }

      revalidateTag(`experiences:team-${teamId}`);
      revalidateTag(`team:${teamId}`);

      return {
        success: true,
        message: `Experiences updated successfully: ${addedCount} added, ${updatedCount} updated, ${deletedCount} deleted.`,
        data: {
          added: addedCount,
          updated: updatedCount,
          deleted: deletedCount,
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
