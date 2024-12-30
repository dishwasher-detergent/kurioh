import { Models } from "appwrite";

export interface Project extends Models.Document {
  title: string;
  short_description: string;
  description: string;
  image_ids: string[];
  tags: string[];
  links: string[];
  slug: string;
  organization_id: string;
}
