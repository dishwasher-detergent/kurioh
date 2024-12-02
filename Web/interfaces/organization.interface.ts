import { Models } from "appwrite";

export interface Organization extends Models.Document {
  title: string;
  slug: string;
  info_id: string | null;
  project_ids: string[];
  experience_id: string | null;
  createdBy: string;
}
