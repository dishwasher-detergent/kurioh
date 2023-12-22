export const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || "cloud.appwrite.io";
export const SSR_HOSTNAME = process.env.NEXT_PUBLIC_SSR_HOSTNAME || "localhost";
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
