export const STORAGE_URL = process.env.STORAGE_URL as string;

export function getStorageFileUrl(key: string): string {
  return `${STORAGE_URL}/${key}`;
}
