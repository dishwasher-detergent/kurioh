import { Models } from "appwrite";

export interface Project extends Models.Document {
  title: string;
  short_description: string;
  description: string;
  images_ids: string[];
  ordinal: number;
  tags: string[];
  links: string[];
  color: string;
  slug: string;
  organization_id: string;
}
