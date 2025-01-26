import { Experience } from "@/interfaces/experience.interface";
import { Information } from "@/interfaces/information.interface";
import { Organization } from "@/interfaces/organization.interface";
import { Project } from "@/interfaces/project.interface";
import { unstable_cache } from "next/cache";
import { Databases, Query } from "node-appwrite";
import {
  DATABASE_ID,
  EXPERIENCE_COLLECTION_ID,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
} from "./constants";

export const getOrganization = unstable_cache(
  async (organizationId: string, database: Databases) => {
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

      console.log(org, information, exp.documents);

      return {
        organization: org,
        information: information,
        experience: exp.documents,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  ["organization"],
  { revalidate: false, tags: ["organization"] },
);

export const getProject = unstable_cache(
  async (projectId: string, database: Databases) => {
    try {
      const project = await database.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectId,
      );

      return project;
    } catch {
      return null;
    }
  },
  ["project"],
  { revalidate: false, tags: ["project"] },
);

export const getProjects = unstable_cache(
  async (projectId: string, database: Databases) => {
    try {
      const project = await database.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [Query.equal("organization_id", projectId)],
      );

      return project.documents;
    } catch {
      return null;
    }
  },
  ["project"],
  { revalidate: false, tags: ["projects"] },
);
