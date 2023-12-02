import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractWebsiteName(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.hostname.split(".");
    return parts[parts.length - 2];
  } catch (e) {
    console.error(e);
    return "";
  }
}
