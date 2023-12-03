import { Models } from "appwrite";

export interface Information extends Models.Document {
  title: string;
  description: string;
  icon: string;
  socials: string[];
}
