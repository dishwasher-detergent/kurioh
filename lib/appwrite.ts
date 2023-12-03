import { Information } from "@/interfaces/information";
import { Projects } from "@/interfaces/projects";
import { Client, Databases, ID, Query } from "appwrite";

export const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
export const INFORMATION_COLLECTION_ID = process.env
  .NEXT_PUBLIC_DATABASE_ID as string;
export const PROJECTS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROJECTS_COLLECTION_ID as string;
export const ARTICLES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_ARTICLES_COLLECTION_ID as string;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const db = new Databases(client);

export const AppwriteService = {
  // Information
  /**
   * Retrieves information from the database based on the provided ID.
   * @param id The ID of the information to retrieve.
   * @returns A Promise that resolves to the retrieved information.
   */
  async getInformation(id: string) {
    const documents = await db.getDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      "1",
    );

    return documents;
  },

  /**
   * Retrieves a list of information documents from the database.
   * @returns A promise that resolves to an array of information documents.
   */
  async listInformation() {
    const documents = await db.listDocuments<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
    );

    return documents;
  },

  /**
   * Creates a new information document in the database.
   * @param information The information object to be created.
   * @returns A promise that resolves to the created document.
   */
  async createInformation(information: Information) {
    const documents = await db.createDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      ID.unique(),
      information,
    );

    return documents;
  },

  /**
   * Updates the information in the database.
   * @param information The updated information object.
   * @returns A promise that resolves to the updated documents.
   */
  async updateInformation(information: Information) {
    const documents = await db.updateDocument<Information>(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      information.$id,
      information,
    );

    return documents;
  },

  /**
   * Deletes information with the specified ID.
   * @param id - The ID of the information to delete.
   * @returns A Promise that resolves to the deleted documents.
   */
  async deleteInformation(id: string) {
    const documents = await db.deleteDocument(
      DATABASE_ID,
      INFORMATION_COLLECTION_ID,
      id,
    );

    return documents;
  },

  // Projects
  /**
   * Retrieves a project by its ID.
   * @param id The ID of the project to retrieve.
   * @returns A Promise that resolves to the retrieved project.
   */
  async getProject(id: string) {
    const documents = await db.getDocument<Projects>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
    );

    return documents;
  },

  /**
   * Retrieves a list of projects from the database.
   * @returns A promise that resolves to an array of projects.
   */
  async listProjects() {
    const documents = await db.listDocuments<Projects>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [Query.orderAsc("position")],
    );

    return documents;
  },

  /**
   * Creates a new project in the database.
   * @param project The project object to be created.
   * @returns A promise that resolves to the created project document.
   */
  async createProject(project: Projects) {
    const documents = await db.createDocument<Projects>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      project,
    );

    return documents;
  },

  /**
   * Updates a project in the database.
   * @param project The project object to be updated.
   * @returns A promise that resolves to the updated project documents.
   */
  async updateProject(project: Projects) {
    const documents = await db.updateDocument<Projects>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      project.$id,
      project,
    );

    return documents;
  },

  /**
   * Deletes a project from the database.
   * @param {string} id - The ID of the project to delete.
   * @returns - A promise that resolves to the deleted documents.
   */
  async deleteProject(id: string) {
    const documents = await db.deleteDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
    );

    return documents;
  },

  // Articles
};
