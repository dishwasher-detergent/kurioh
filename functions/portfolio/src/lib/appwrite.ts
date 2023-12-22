import { Client, Databases, Models } from 'node-appwrite';

export const ENDPOINT =
  process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
export const PROJECT_ID = process.env.APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.DATABASE_ID as string;

// Collections
export const INFORMATION_COLLECTION_ID = process.env
  .INFORMATION_COLLECTION_ID as string;
export const PROJECTS_COLLECTION_ID = process.env
  .PROJECTS_COLLECTION_ID as string;
export const ARTICLES_COLLECTION_ID = process.env
  .ARTICLES_COLLECTION_ID as string;
export const PORTFOLIO_COLLECTION_ID = process.env
  .PROTFOLIO_COLLECTION_ID as string;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const database = new Databases(client);

export const database_service = {
  /**
   * Retrieves information from the database based on the provided document ID and collection ID.
   *
   * @template {T} - The type of the document to retrieve.
   * @param {string} collectionId - The ID of the collection where the document is stored.
   * @param {string} id - The ID of the document to retrieve.
   * @returns A promise that resolves to the retrieved document.
   */
  async get<T extends Models.Document>(collectionId: string, id: string) {
    const response = await database.getDocument<T>(
      DATABASE_ID,
      collectionId,
      id
    );

    return response;
  },

  /**
   * Retrieves a list of documents from a specific collection.
   *
   * @template {T} - The type of the documents to retrieve.
   * @param {string} collectionId - The ID of the collection to retrieve documents from.
   * @returns A promise that resolves to an array of documents of type T.
   */
  async list<T extends Models.Document>(
    collectionId: string,
    queries: string[] = []
  ) {
    const response = await database.listDocuments<T>(
      DATABASE_ID,
      collectionId,
      queries
    );

    return response;
  },
};
