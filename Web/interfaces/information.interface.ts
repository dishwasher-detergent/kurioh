import { Models } from "appwrite";

export interface Information extends Models.Document {
  title: string;
  description: string;
  image_id: string;
  socials: string[];
  organization_id: string;
  createdBy: string;
}

export interface Social {
  url: string;
  value: string;
}
