import { Client, Databases, ID, Models, Storage } from "appwrite";

export const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;

// Collections
export const INFORMATION_COLLECTION_ID = process.env
  .NEXT_PUBLIC_INFORMATION_COLLECTION_ID as string;
export const PROJECTS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROJECTS_COLLECTION_ID as string;
export const ARTICLES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_ARTICLES_COLLECTION_ID as string;
export const PORTFOLIO_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROTFOLIO_COLLECTION_ID as string;

// Buckets
export const PORTFOLIO_BUCKET_ID = process.env
  .NEXT_PUBLIC_PORTFOLIO_BUCKET_ID as string;
export const PROJECTS_BUCKET_ID = process.env
  .NEXT_PUBLIC_PROJECTS_BUCKET_ID as string;
export const ARTICLES_BUCKET_ID = process.env
  .NEXT_PUBLIC_ARTICLES_BUCKET_ID as string;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const database = new Databases(client);
const storage = new Storage(client);

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
      id,
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
    queries: string[] = [],
  ) {
    const response = await database.listDocuments<T>(
      DATABASE_ID,
      collectionId,
      queries,
    );

    return response;
  },

  /**
   * Creates a new document in the specified collection.
   *
   * @template {T} - The type of the document.
   * @param {string} collectionId - The ID of the collection.
   * @param {T} data - The data of the document.
   * @param {string} [id=ID.unique()] - The ID of the document (optional).
   * @returns A promise that resolves to the created document.
   */
  async create<T extends Models.Document>(
    collectionId: string,
    data: Omit<T, keyof Models.Document>,
    id: string = ID.unique(),
  ) {
    const response = await database.createDocument<T>(
      DATABASE_ID,
      collectionId,
      id,
      data,
    );

    return response;
  },

  /**
   * Updates the information of a document in a collection.
   *
   * @template {T} - The type of the document.
   * @param {string} collectionId - The ID of the collection.
   * @param {T} data - The updated data for the document.
   * @param {string} [id=data.$id] - The ID of the document. Defaults to the ID specified in the data object.
   * @returns A promise that resolves to the updated document.
   */
  async update<T extends Models.Document>(
    collectionId: string,
    data: Omit<T, keyof Models.Document>,
    id: string,
  ) {
    const response = await database.updateDocument<T>(
      DATABASE_ID,
      collectionId,
      id,
      data,
    );

    return response;
  },

  /**
   * Deletes a document from a collection.
   *
   * @param {string} collectionId - The ID of the collection.
   * @param {string} id - The ID of the document to delete.
   * @returns A promise that resolves to the deleted document.
   */
  async delete(collectionId: string, id: string) {
    const response = await database.deleteDocument(
      DATABASE_ID,
      collectionId,
      id,
    );

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

  /**
   * Uploads a file to the specified bucket.
   *
   * @param {string} bucketId - The ID of the bucket to upload the file to.
   * @param {File} file - The file to upload.
   * @param {string} [id] - The ID to assign to the uploaded file. If not provided, a unique ID will be generated.
   * @returns A promise that resolves to the response from the server.
   */
  async upload(bucketId: string, file: File, id: string = ID.unique()) {
    const response = await storage.createFile(bucketId, id, file);

    return response;
  },

  /**
   * Deletes a file from the specified storage bucket.
   *
   * @param {string} bucketId - The ID of the bucket where the file is stored.
   * @param {string} id - The ID of the file to delete.
   * @returns A promise that resolves to the deleted file.
   */
  async delete(bucketId: string, id: string) {
    const response = await storage.deleteFile(bucketId, id);

    return response;
  },
};
