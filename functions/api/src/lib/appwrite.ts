import { AppwriteException, Client, Models, Storage, TablesDB } from 'node-appwrite';
import { NotFoundError } from './utils.js';

export const ENDPOINT = process.env.APPWRITE_ENDPOINT as string;
export const PROJECT_ID = process.env.APPWRITE_PROJECT_ID as string;
export const API_KEY = process.env.KEY as string;
export const DATABASE_ID = process.env.DB_ID as string;

// Collections
export const EXPERIENCE_COLLECTION_ID = process.env.EXPERIENCE_ID as string;
export const ORGANIZATION_COLLECTION_ID = process.env.ORGANIZATION_ID as string;
export const PROJECTS_COLLECTION_ID = process.env.PROJECTS_ID as string;
export const EDUCATION_COLLECTION_ID = process.env.EDUCATION_ID as string;

// Buckets
export const PROJECTS_BUCKET_ID = process.env.BUCKET_ID as string;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const database = new TablesDB(client);
const storage = new Storage(client);

export const database_service = {
  /**
   * Retrieves information from the database based on the provided document ID and collection ID.
   *
   * @template {T} - The type of the document to retrieve.
   * @param {string} collectionId - The ID of the collection where the document is stored.
   * @param {string} id - The ID of the document to retrieve.
   * @param {string} [notFoundMessage] - Message used for the NotFoundError thrown when the row doesn't exist.
   * @returns A promise that resolves to the retrieved document.
   * @throws {NotFoundError} When no row with the given ID exists in the collection.
   */
  async get<T extends Models.Row>(
    collectionId: string,
    id: string,
    notFoundMessage = 'Resource not found'
  ) {
    try {
      return await database.getRow<T>({
        databaseId: DATABASE_ID,
        tableId: collectionId,
        rowId: id,
      });
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 404) {
        throw new NotFoundError(notFoundMessage);
      }
      throw error;
    }
  },

  /**
   * Retrieves a list of documents from a specific collection.
   *
   * @template {T} - The type of the documents to retrieve.
   * @param {string} collectionId - The ID of the collection to retrieve documents from.
   * @returns A promise that resolves to an array of documents of type T.
   */
  async list<T extends Models.Row>(
    collectionId: string,
    queries: string[] = []
  ) {
    const response = await database.listRows<T>({
      databaseId: DATABASE_ID,
      tableId: collectionId,
      queries,
    });

    return response;
  },
};

export const storage_service = {
  /**
   * Retrieves a file from the specified storage bucket.
   *
   * @param {string} bucketId - The ID of the bucket where the file is stored.
   * @param {string} id - The ID of the file to retrieve.
   * @returns A promise that resolves to the retrieved file.
   */
  async get(bucketId: string, id: string) {
    const response = await storage.getFile(bucketId, id);

    return response;
  },

  /**
   * Retrieves a list of files from the specified storage bucket.
   *
   * @param {string} bucketId - The ID of the bucket to retrieve files from.
   * @returns A promise that resolves to an array of files.
   */
  async list(bucketId: string) {
    const response = await storage.listFiles(bucketId);

    return response;
  },

  async getFileView(bucketId: string, id: string) {
    try {
      const response = await storage.getFileView(bucketId, id);

      return response;
    } catch (err) {
      return null;
    }
  },
};
