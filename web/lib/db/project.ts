"use server";

import { and, asc, eq, gt, ilike } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";

import { DocumentList, Result } from "@/interfaces/result.interface";
import { Project } from "@/interfaces/project.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import { MAX_PROJECT_IMAGE_LIMIT, MAX_PROJECT_LIMIT } from "@/lib/constants";
import { db } from "@/lib/db/client";
import { profile, project, teamProfile } from "@/lib/db/schema";
import { deleteFile, uploadFile } from "@/lib/storage";
import { createSlug } from "@/lib/utils";
import { AddProjectFormData, EditProjectFormData } from "./schemas";

function toProject(row: typeof project.$inferSelect): Project {
  return {
    $id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    shortDescription: row.shortDescription ?? "",
    images: row.images ?? [],
    tags: row.tags ?? [],
    links: row.links ?? [],
    published: row.published,
    ordinal: row.ordinal,
    userId: row.userId,
    teamId: row.teamId,
  };
}

async function attachUserAndTeam(item: Project): Promise<Project> {
  const [userRow] = await db
    .select({ id: profile.id, name: profile.name })
    .from(profile)
    .where(eq(profile.id, item.userId));

  const [teamRow] = await db
    .select({ id: teamProfile.id })
    .from(teamProfile)
    .where(eq(teamProfile.id, item.teamId));

  return {
    ...item,
    user: userRow
      ? ({ $id: userRow.id, name: userRow.name, about: "" } as UserData)
      : undefined,
    team: teamRow ? ({ $id: teamRow.id } as unknown as TeamData) : undefined,
  };
}

export interface ListProjectsOptions {
  search?: string;
  limit?: number;
  cursorId?: string;
}

/**
 * Get a list of projects for a team
 * @param {string} id The ID of the team
 * @param {ListProjectsOptions} options The query options
 * @returns {Promise<Result<DocumentList<Project>>>} The list of projects
 */
export async function listProjectsByTeam(
  id: string,
  options: ListProjectsOptions = {},
): Promise<Result<DocumentList<Project>>> {
  return withAuth(async (user) => {
    const { search, limit = 5, cursorId } = options;

    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (id, search, limit, cursorId, userId) => {
        try {
          let cursorOrdinal: number | undefined;

          if (cursorId) {
            const [cursorRow] = await db
              .select({ ordinal: project.ordinal })
              .from(project)
              .where(eq(project.id, cursorId));
            cursorOrdinal = cursorRow?.ordinal;
          }

          const conditions = [eq(project.teamId, id)];

          if (search) {
            conditions.push(ilike(project.name, `%${search}%`));
          }

          if (cursorOrdinal !== undefined) {
            conditions.push(gt(project.ordinal, cursorOrdinal));
          }

          const rows = await db
            .select()
            .from(project)
            .where(and(...conditions))
            .orderBy(asc(project.ordinal))
            .limit(limit);

          const total = await db.$count(project, eq(project.teamId, id));

          const documents = await Promise.all(
            rows.map((row) => attachUserAndTeam(toProject(row))),
          );

          return {
            success: true,
            message: "Projects successfully retrieved.",
            data: { documents, total },
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
          `projects:${search ?? ""}-${limit}-${cursorId ?? ""}`,
          `projects:team-${id}`,
        ],
        revalidate: 600,
      },
    )(id, search, limit, cursorId, user.$id);
  });
}

/**
 * Get a project by ID
 * @param {string} projectId The ID of the project
 * @returns {Promise<Result<Project>>} The project
 */
export async function getProjectById(
  projectId: string,
): Promise<Result<Project>> {
  return withAuth(async () => {
    return unstable_cache(
      async (projectId) => {
        try {
          const [row] = await db
            .select()
            .from(project)
            .where(eq(project.id, projectId));

          if (!row) {
            return {
              success: false,
              message: "Project not found.",
            };
          }

          return {
            success: true,
            message: "Project successfully retrieved.",
            data: await attachUserAndTeam(toProject(row)),
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
        tags: ["projects", `project:${projectId}`],
        revalidate: 600,
      },
    )(projectId);
  });
}

/**
 * Create a project
 * @param {Object} params The parameters for creating a project
 * @param {AddProjectFormData} params.data The project data
 * @returns {Promise<Result<Project>>} The created project
 */
export async function createProject({
  data,
}: {
  data: AddProjectFormData;
}): Promise<Result<Project>> {
  return withAuth(async (user) => {
    try {
      const projectCount = await db.$count(
        project,
        eq(project.teamId, data.teamId),
      );

      if (projectCount > MAX_PROJECT_LIMIT) {
        return {
          success: false,
          message: `You have reached the maximum number of projects (${MAX_PROJECT_LIMIT}) for this team.`,
        };
      }

      const [lastProject] = await db
        .select({ ordinal: project.ordinal })
        .from(project)
        .where(eq(project.teamId, data.teamId))
        .orderBy(asc(project.ordinal))
        .limit(1);

      const [row] = await db
        .insert(project)
        .values({
          id: crypto.randomUUID(),
          name: data.name,
          description: data.description,
          slug: createSlug(data.name),
          teamId: data.teamId,
          userId: user.$id,
          ordinal: (lastProject?.ordinal ?? 0) + 1,
          published: false,
        })
        .returning();

      revalidateTag("projects");

      return {
        success: true,
        message: "Project successfully created.",
        data: await attachUserAndTeam(toProject(row)),
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
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
 * @param {Object} params The parameters for updating a project
 * @param {string} params.id The ID of the project
 * @param {string} params.teamId The ID of the team
 * @param {EditProjectFormData} params.data The project data
 * @returns {Promise<Result<Project>>} The updated project
 */
export async function updateProject({
  id,
  teamId,
  data,
}: {
  id: string;
  teamId: string;
  data: EditProjectFormData;
}): Promise<Result<Project>> {
  return withAuth(async (user) => {
    try {
      const [existingProject] = await db
        .select()
        .from(project)
        .where(eq(project.id, id));

      if (!existingProject) {
        return {
          success: false,
          message: "Project not found.",
        };
      }

      if (data.images && data.images.length > MAX_PROJECT_IMAGE_LIMIT) {
        return {
          success: false,
          message: `You have reached the maximum number of images (${MAX_PROJECT_IMAGE_LIMIT}) for this project.`,
        };
      }

      // Handle ordinal changes and reordering
      if (existingProject.ordinal !== data.ordinal) {
        const allProjects = await db
          .select()
          .from(project)
          .where(eq(project.teamId, teamId))
          .orderBy(asc(project.ordinal));

        const oldOrdinal = existingProject.ordinal;
        const newOrdinal = data.ordinal;

        if (oldOrdinal < newOrdinal) {
          for (const proj of allProjects) {
            if (
              proj.id !== id &&
              proj.ordinal > oldOrdinal &&
              proj.ordinal <= newOrdinal
            ) {
              await db
                .update(project)
                .set({ ordinal: proj.ordinal - 1 })
                .where(eq(project.id, proj.id));
            }
          }
        } else if (oldOrdinal > newOrdinal) {
          for (const proj of allProjects) {
            if (
              proj.id !== id &&
              proj.ordinal >= newOrdinal &&
              proj.ordinal < oldOrdinal
            ) {
              await db
                .update(project)
                .set({ ordinal: proj.ordinal + 1 })
                .where(eq(project.id, proj.id));
            }
          }
        }
      }

      let images = existingProject.images ?? [];

      if (data.images) {
        const existingImageIds = existingProject.images ?? [];
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
            const uploadResult = await uploadFile({ data: img });

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

        images = newImageIds;
      }

      const [row] = await db
        .update(project)
        .set({
          name: data.name,
          description: data.description,
          shortDescription: data.short_description,
          tags: data.tags?.map((tag) =>
            typeof tag === "string" ? tag : tag.value,
          ),
          links: data.links?.map((link) =>
            typeof link === "string" ? link : link.value,
          ),
          images,
          ordinal: data.ordinal,
          published: data.published,
          userId: user.$id,
          updatedAt: new Date(),
        })
        .where(eq(project.id, id))
        .returning();

      revalidateTag("projects");
      revalidateTag(`project:${id}`);
      revalidateTag(`projects:team-${teamId}`);

      return {
        success: true,
        message: "Project successfully updated.",
        data: await attachUserAndTeam(toProject(row)),
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
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
 * @returns {Promise<Result<void>>} The deleted project
 */
export async function deleteProject(id: string): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      const [row] = await db.select().from(project).where(eq(project.id, id));

      if (!row) {
        return {
          success: false,
          message: "Project not found.",
        };
      }

      if (row.images) {
        for (const imageId of row.images) {
          const image = await deleteFile(imageId);

          if (!image.success) {
            throw new Error(image.message);
          }
        }
      }

      await db.delete(project).where(eq(project.id, id));

      revalidateTag(`projects:team-${row.teamId}`);

      return {
        success: true,
        message: "Project successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Delete all projects by team ID
 * @param teamId The ID of the team
 * @returns {Promise<Result<void>>} The deleted project
 */
export async function deleteAllProjectsByTeam(
  teamId: string,
): Promise<Result<void>> {
  return withAuth(async () => {
    try {
      const rows = await db
        .select({ id: project.id })
        .from(project)
        .where(eq(project.teamId, teamId));

      await Promise.all(rows.map((row) => deleteProject(row.id)));

      revalidateTag(`projects:team-${teamId}`);

      return {
        success: true,
        message: "Project successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}
