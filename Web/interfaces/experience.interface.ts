import { Organization } from "@/interfaces/organization.interface";
import { Models } from "appwrite";

export interface Experience extends Models.Document {
  company: string;
  website: string;
  title: string;
  description: string;
  languages: string[];
  start: Date;
  end: Date;
  organizations: Organization;
  creator: string;
}
