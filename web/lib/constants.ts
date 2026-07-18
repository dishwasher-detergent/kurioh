export const HOSTNAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;
export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

// Neon Object Storage (S3-compatible, public_read bucket)
export const STORAGE_BUCKET = process.env.NEON_STORAGE_BUCKET as string;
export const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL as string;

export function getStorageFileUrl(key: string): string {
  return `${STORAGE_URL}/${key}`;
}

// Additional
export const MAX_TEAM_LIMIT =
  Number(process.env.NEXT_PUBLIC_MAX_TEAM_LIMIT) || 5;
export const MAX_PROJECT_LIMIT =
  Number(process.env.NEXT_PUBLIC_MAX_PROJECT_LIMIT) || 10;
export const MAX_PROJECT_IMAGE_LIMIT =
  Number(process.env.NEXT_PUBLIC_MAX_PROJECT_IMAGE_LIMIT) || 3;
