export const HOSTNAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;

export const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
export const API_KEY = process.env.APPWRITE_API_KEY as string;

// Collections
export const EXPERIENCE_COLLECTION_ID = process.env
  .NEXT_PUBLIC_EXPERIENCE_COLLECTION_ID as string;
export const PORTFOLIOS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PORTFOLIOS_COLLECTION_ID as string;
export const INFORMATION_COLLECTION_ID = process.env
  .NEXT_PUBLIC_INFORMATION_COLLECTION_ID as string;
export const ARTICLES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_ARTICLES_COLLECTION_ID as string;
export const PROJECTS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROJECTS_COLLECTION_ID as string;

// Cookie
export const COOKIE_KEY = `a_session_${PROJECT_ID}`;
