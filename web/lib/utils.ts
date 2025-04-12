import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets initials from a name string
 * @param name Full name string
 * @param maxLength Maximum number of initials to return (default: 2)
 * @returns Uppercase initials string
 */
export function getInitials(name?: string, maxLength: number = 2): string {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join("")
    .toUpperCase();
}

export function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function formatDate(date: Date | string): string {
  date = new Date(date);
  const day = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
  const month = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function extractWebsiteName(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.hostname.split(".");
    return parts[parts.length - 2];
  } catch {
    return "";
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function transformZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
